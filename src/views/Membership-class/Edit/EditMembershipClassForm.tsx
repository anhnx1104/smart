import { yupResolver } from '@hookform/resolvers/yup';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import LoadingButton from '@mui/lab/LoadingButton';
import { Collapse, Grid, TextField } from '@mui/material';
import LinkButton from 'components/common/LinkButton';
import LoadingScreen from 'components/common/LoadingScreen';
import ControllerSwitch from 'components/Form/ControllerSwitch';
import ControllerTextField from 'components/Form/ControllerTextField';
import EntitySelecter from 'components/Form/EntitySelecter';
import FormContent from 'components/Form/FormContent';
import FormFooter from 'components/Form/FormFooter';
import FormGroup from 'components/Form/FormGroup';
import FormHeader from 'components/Form/FormHeader';
import FormLabel from 'components/Form/FormLabel';
import FormPaperGrid from 'components/Form/FormPaperGrid';
import useMounted from 'hooks/useMounted';
import useNotification from 'hooks/useNotification';
import {
  emailTemplateOptions,
  pointTypeOptions,
  unitOptions,
} from 'mock-axios';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import TypedObject from 'utils/TypedObject';
import * as yup from 'yup';
import {
  editMembershipClass,
  getMembershipClassDetails,
  MembershipClass,
} from '../../../services/membershipClass';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ImageButton from '../../../components/common/ImageButton';
import ControllerCheckbox from '../../../components/Form/ControllerCheckbox';
import { ChangeEvent } from '../../../types';

interface FormData {
  name: string;
  description: string;
  categories: number;
  condition: string;
  pointOfClass: string;
  image: File | null;
  fileUpload: File | null;
  endowPoint: boolean;
  value: number;
  unit: number;
  pointType: number;
  status: number;
  sendMail: boolean;
  sendMail50: boolean;
  sendMail75: boolean;
  sendMail90: boolean;
  otherDiscount: boolean;
  discount: boolean;
  emailId: string;
}

const validationSchema = yup.object().shape({
  name: yup.string().required('Không được để trống').max(255),
  description: yup.string().max(255),
  pointOfClass: yup.string().required('Không được để trống'),
  value: yup.mixed().when('endowPoint', {
    is: true,
    then: yup.number().required('Không được để trống'),
  }),
});

const EditMembershipClassForm = () => {
  const { id: membershipClassId } = useParams();
  const mounted = useMounted();
  const setNotification = useNotification();
  const navigate = useNavigate();
  const [membershipClassDetails, setMembershipClassDetails] =
    useState<MembershipClass | null>(null);
  const [taskQueue, setTaskQueue] = useState<number>(0); //to render loading
  const [loading, setLoading] = useState<boolean>(false);
  const [image, setImage] = useState<File | null>(null);
  const [status, setStatus] = useState<number>(0);
  const [checkedSendMail, setCheckedSendMail] = useState<boolean>(false);
  const [checkedSendMail50, setCheckedSendMail50] = useState<boolean>(false);
  const [checkedSendMail75, setCheckedSendMail75] = useState<boolean>(false);
  const [checkedSendMail90, setCheckedSendMail90] = useState<boolean>(false);
  const [checkedOtherDiscount, setCheckedOtherDiscount] =
    useState<boolean>(false);
  const [checkedDiscount, setCheckedDiscount] = useState<boolean>(false);
  const [checkedEndowPoint, setCheckedEndowPoint] = useState<boolean>(false);
  const [expanded, setExpanded] = useState<boolean>(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
    defaultValues: {
      unit: 2,
      pointType: 1,
    },
  });

  const handleDropImage = async ([file]: File[]) => {
    if (file.size >= 1048576 && file.size <= 5242880) {
      setImage(file);
    } else {
      setNotification({
        error: 'Ảnh hạng thẻ phải lớn hơn 1MB và nhỏ hơn 5MB',
      });
    }
  };

  const onHandleChange: ChangeEvent = (event) => {
    setCheckedEndowPoint(event.target.checked);
    if (!checkedEndowPoint) {
      setExpanded((expanded) => !expanded);
    } else {
      setExpanded(false);
    }
  };

  const onSubmit = async (data: FormData) => {
    if (!membershipClassId) return;

    setLoading(true);
    const formData = new FormData();

    formData.append('Name', data.name);
    formData.append('Description', data.description);
    if (image) {
      formData.append('FileUpload', image, image.name);
    }
    formData.append('Id', membershipClassId);
    formData.append('Condition', 'Điểm xếp hạng');
    formData.append('Value', data.value.toString());
    formData.append('Status', status.toString());
    formData.append('Categories', data.categories.toString());
    formData.append('PointOfClass', data.pointOfClass);
    formData.append('SendMail', checkedSendMail.toString());
    formData.append('SendMail50', checkedSendMail50.toString());
    formData.append('SendMail75', checkedSendMail75.toString());
    formData.append('SendMail90', checkedSendMail90.toString());
    formData.append('Discount', checkedDiscount.toString());
    formData.append('OtherDiscount', checkedOtherDiscount.toString());
    formData.append('EndowPoint', checkedEndowPoint.toString());
    formData.append('Unit', data.unit.toString());
    formData.append('PointType', data.pointType.toString());

    editMembershipClass(formData)
      .then((res) => {
        if (res.success) {
          navigate('/membershipClass/list');
          setNotification({
            message: 'Cập nhật thành công.',
            severity: 'success',
          });
        }
      })
      .catch((err) => {
        setNotification({
          error: err || 'Cập nhật thất bại.',
        });
      })
      .finally(() => {
        if (mounted.current) {
          setLoading(false);
        }
      });
  };

  //call api to get data details
  useEffect(() => {
    if (!membershipClassId) return;

    setTaskQueue((task) => task + 1);
    getMembershipClassDetails(membershipClassId)
      .then((res) => {
        setMembershipClassDetails(res.data);
      })
      .catch((err) => console.log(err))
      .finally(() => {
        if (mounted.current) {
          setTaskQueue((task) => task - 1);
        }
      });
  }, [membershipClassId, mounted]);

  //reset form value form data details
  useEffect(() => {
    if (!membershipClassDetails) return;

    const {
      name,
      description,
      categories,
      condition,
      pointOfClass,
      image,
      fileUpload,
      endowPoint,
      value,
      unit,
      pointType,
      status,
      sendMail,
      sendMail50,
      sendMail75,
      sendMail90,
      otherDiscount,
      discount,
      emailId,
    } = membershipClassDetails;

    reset({
      name,
      description,
      categories,
      condition,
      pointOfClass,
      image,
      fileUpload,
      endowPoint,
      value,
      unit,
      pointType,
      status,
      sendMail,
      sendMail50,
      sendMail75,
      sendMail90,
      otherDiscount,
      discount,
      emailId,
    });
  }, [membershipClassDetails, reset]);

  if (taskQueue > 0) {
    return <LoadingScreen />;
  }

  return (
    <FormPaperGrid noValidate onSubmit={handleSubmit(onSubmit)}>
      <FormHeader title="Cập nhật hạng hội viên" />
      <FormContent>
        <Box>
          <Typography>Thông tin chung</Typography>
        </Box>
        <FormGroup>
          <Grid
            container
            alignItems="center"
            spacing={3}
            style={{ padding: 20 }}
          >
            <Grid item xs={12} sm={4} md={2}>
              <FormLabel required title="Tên hạng" name="name" />
            </Grid>
            <Grid item xs={12} sm={8} md={4}>
              <ControllerTextField
                name="name"
                control={control}
                placeholder={'Tên hạng'}
              />
            </Grid>
            <Grid item xs={12} sm={4} md={2}>
              <FormLabel required title="Mô tả" name="description" />
            </Grid>
            <Grid item xs={12} sm={8} md={4}>
              <ControllerTextField
                name="description"
                control={control}
                placeholder={'Mô tả'}
              />
            </Grid>
          </Grid>
        </FormGroup>
        <Divider />
        <FormGroup>
          <Grid
            container
            alignItems="center"
            spacing={3}
            style={{ padding: 20 }}
          >
            <Grid item xs={12} sm={4} md={2}>
              <FormLabel required title="Xếp hạng" name="categories" />
            </Grid>
            <Grid item xs={12} sm={8} md={4}>
              <ControllerTextField
                name="categories"
                control={control}
                placeholder={'Hạng thấp nhất là 1'}
              />
            </Grid>

            <Grid item xs={12} sm={4} md={2}>
              <FormLabel title="Kích hoạt" name="status" />
            </Grid>
            <Grid item xs={12} sm={8} md={4}>
              <ControllerSwitch
                name="status"
                label=""
                control={control}
                onChangeSelect={(e) => (e ? setStatus(1) : setStatus(0))}
              />
            </Grid>
          </Grid>
        </FormGroup>
        <Divider />
        <FormGroup>
          <Grid
            container
            alignItems="center"
            spacing={3}
            style={{ padding: 20 }}
          >
            <Grid item xs={12} sm={4} md={2}>
              <FormLabel required title="Điều kiện" name="condition" />
            </Grid>
            <Grid item xs={12} sm={8} md={4}>
              <ControllerTextField
                name="condition"
                control={control}
                value={'Điểm xếp hạng'}
                disabled
              />
            </Grid>
            <Grid item xs={12} sm={4} md={2}>
              <FormLabel required title="Điểm xét hạng" name="pointOfClass" />
            </Grid>
            <Grid item xs={12} sm={8} md={4}>
              <ControllerTextField
                name="pointOfClass"
                control={control}
                placeholder={'Điểm xét hạng'}
              />
            </Grid>
          </Grid>
        </FormGroup>
        <Divider />
        <FormGroup>
          <Grid
            container
            alignItems="center"
            spacing={3}
            style={{ padding: 20 }}
          >
            <Grid item xs={12} sm={4} md={2}>
              <FormLabel required title="Ảnh hạng thẻ" name="image" />
            </Grid>
            <Grid item xs={12} sm={8} md={4}>
              <Box sx={{ display: 'flex' }}>
                <TextField
                  style={{ width: '60%' }}
                  value={image?.name}
                  disabled
                  placeholder={'Ảnh hạng thẻ'}
                />
                <ImageButton
                  accept="image/*"
                  maxFiles={1}
                  onDrop={handleDropImage}
                />
              </Box>
            </Grid>
          </Grid>
        </FormGroup>
        <Divider />
        <Box style={{ paddingTop: 20 }}>
          <Typography>Ưu đãi</Typography>
        </Box>
        <FormGroup>
          <Grid
            container
            alignItems="center"
            spacing={3}
            style={{ padding: 20 }}
          >
            <Grid item xs={12} sm={12} md={12}>
              <ControllerCheckbox
                control={control}
                name="endowPoint"
                label="Ưu đãi điểm"
                checked={checkedEndowPoint}
                onChange={onHandleChange}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <Collapse in={expanded}>
                <Divider />
                <Grid
                  container
                  alignItems="center"
                  spacing={3}
                  style={{ paddingTop: 20 }}
                >
                  <Grid item xs={12} sm={4} md={1}>
                    <FormLabel required title="Giá trị" name="value" />
                  </Grid>
                  <Grid item xs={12} sm={8} md={3}>
                    <ControllerTextField name="value" control={control} />
                  </Grid>
                  <Grid item xs={12} sm={4} md={1}>
                    <FormLabel required title="Đơn vị" name="unit" />
                  </Grid>
                  <Grid item xs={12} sm={8} md={3}>
                    <EntitySelecter
                      name="unit"
                      control={control}
                      options={unitOptions}
                      renderLabel={(field) => field.name}
                      placeholder="Chọn đơn vị"
                    />
                  </Grid>
                  <Grid item xs={12} sm={4} md={1}>
                    <FormLabel required title="Loại điểm" name="pointType" />
                  </Grid>
                  <Grid item xs={12} sm={8} md={3}>
                    <EntitySelecter
                      name="pointType"
                      control={control}
                      options={pointTypeOptions}
                      renderLabel={(field) => field.name}
                      placeholder="Chọn loại điểm"
                    />
                  </Grid>
                </Grid>
              </Collapse>
            </Grid>
          </Grid>
        </FormGroup>
        <Divider />
        <FormGroup>
          <Grid
            container
            alignItems="center"
            spacing={3}
            style={{ padding: 20 }}
          >
            <Grid item xs={12} sm={12} md={12}>
              <ControllerCheckbox
                control={control}
                name="discount"
                label="Ưu đãi giảm giá"
                checked={checkedDiscount}
                onChange={(e) => setCheckedDiscount(e.target.checked)}
              />
            </Grid>
          </Grid>
        </FormGroup>
        <Divider />
        <FormGroup>
          <Grid
            container
            alignItems="center"
            spacing={3}
            style={{ padding: 20 }}
          >
            <Grid item xs={12} sm={12} md={12}>
              <ControllerCheckbox
                control={control}
                name="otherDiscount"
                label="Ưu đãi khác"
                checked={checkedOtherDiscount}
                onChange={(e) => setCheckedOtherDiscount(e.target.checked)}
              />
            </Grid>
          </Grid>
        </FormGroup>
        <Divider />
        <Box style={{ paddingTop: 20 }}>
          <Typography>Cấu hình sự kiện</Typography>
        </Box>
        <FormGroup>
          <Grid
            container
            alignItems="center"
            spacing={3}
            style={{ padding: 20 }}
          >
            <Grid item xs={12} sm={12} md={6}>
              <ControllerCheckbox
                control={control}
                name="sendMail50"
                label="Gửi email 50% điểm nâng hạng"
                checked={checkedSendMail50}
                onChange={(e) => setCheckedSendMail50(e.target.checked)}
              />
            </Grid>
            <Grid item xs={12} sm={4} md={2}>
              <FormLabel title="Mẫu email" name="emailId" />
            </Grid>
            <Grid item xs={12} sm={8} md={4}>
              <EntitySelecter
                name="emailId"
                control={control}
                options={emailTemplateOptions}
                renderLabel={(field) => field.name}
                placeholder="Chọn mẫu email"
              />
            </Grid>
          </Grid>
        </FormGroup>
        <Divider />
        <FormGroup>
          <Grid
            container
            alignItems="center"
            spacing={3}
            style={{ padding: 20 }}
          >
            <Grid item xs={12} sm={12} md={6}>
              <ControllerCheckbox
                control={control}
                name="sendMail75"
                label="Gửi email 75% điểm nâng hạng"
                checked={checkedSendMail75}
                onChange={(e) => setCheckedSendMail75(e.target.checked)}
              />
            </Grid>
            <Grid item xs={12} sm={4} md={2}>
              <FormLabel title="Mẫu email" name="emailId" />
            </Grid>
            <Grid item xs={12} sm={8} md={4}>
              <EntitySelecter
                name="emailId"
                control={control}
                options={emailTemplateOptions}
                renderLabel={(field) => field.name}
                placeholder="Chọn mẫu email"
              />
            </Grid>
          </Grid>
        </FormGroup>
        <Divider />
        <FormGroup>
          <Grid
            container
            alignItems="center"
            spacing={3}
            style={{ padding: 20 }}
          >
            <Grid item xs={12} sm={12} md={6}>
              <ControllerCheckbox
                control={control}
                name="sendMail90"
                label="Gửi email 90% điểm nâng hạng"
                checked={checkedSendMail90}
                onChange={(e) => setCheckedSendMail90(e.target.checked)}
              />
            </Grid>
            <Grid item xs={12} sm={4} md={2}>
              <FormLabel title="Mẫu email" name="emailId" />
            </Grid>
            <Grid item xs={12} sm={8} md={4}>
              <EntitySelecter
                name="emailId"
                control={control}
                options={emailTemplateOptions}
                renderLabel={(field) => field.name}
                placeholder="Chọn mẫu email"
              />
            </Grid>
          </Grid>
        </FormGroup>
        <Divider />
        <FormGroup>
          <Grid
            container
            alignItems="center"
            spacing={3}
            style={{ padding: 20 }}
          >
            <Grid item xs={12} sm={12} md={6}>
              <ControllerCheckbox
                control={control}
                name="sendMail"
                label="Gửi email nâng hạng"
                checked={checkedSendMail}
                onChange={(e) => setCheckedSendMail(e.target.checked)}
              />
            </Grid>
            <Grid item xs={12} sm={4} md={2}>
              <FormLabel title="Mẫu email" name="emailId" />
            </Grid>
            <Grid item xs={12} sm={8} md={4}>
              <EntitySelecter
                name="emailId"
                control={control}
                options={emailTemplateOptions}
                renderLabel={(field) => field.name}
                placeholder="Chọn mẫu email"
              />
            </Grid>
          </Grid>
        </FormGroup>
      </FormContent>
      <FormFooter>
        <LinkButton startIcon={<ArrowBackIcon />} to="/example/crud">
          Back to list
        </LinkButton>
        <LoadingButton
          startIcon={<SaveIcon />}
          loading={loading}
          loadingPosition="start"
          type="submit"
          disabled={!TypedObject.isEmpty(errors)}
        >
          Save
        </LoadingButton>
      </FormFooter>
    </FormPaperGrid>
  );
};

export default EditMembershipClassForm;
