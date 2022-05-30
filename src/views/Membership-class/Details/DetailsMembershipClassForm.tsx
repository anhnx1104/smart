import { yupResolver } from '@hookform/resolvers/yup';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import { Collapse, Grid, TextField } from '@mui/material';
import LinkButton from 'components/common/LinkButton';
import LoadingScreen from 'components/common/LoadingScreen';
import ControllerDatePicker from 'components/Form/ControllerDatePicker';
import ControllerRadio from 'components/Form/ControllerRadio';
import ControllerSwitch from 'components/Form/ControllerSwitch';
import ControllerTextField from 'components/Form/ControllerTextField';
import ControllerTimePicker from 'components/Form/ControllerTimePicker';
import EntityMultipleSelecter from 'components/Form/EntityMultipleSelecter';
import EntitySelecter from 'components/Form/EntitySelecter';
import FormContent from 'components/Form/FormContent';
import FormFooter from 'components/Form/FormFooter';
import FormGroup from 'components/Form/FormGroup';
import FormHeader from 'components/Form/FormHeader';
import FormLabel from 'components/Form/FormLabel';
import FormPaperGrid from 'components/Form/FormPaperGrid';
import useMounted from 'hooks/useMounted';
import {
  emailTemplateOptions,
  mockMutipleSelectOptions,
  mockRadioOptions,
  mockSelectFieldOptions,
  pointTypeOptions,
  unitOptions,
} from 'mock-axios';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { ExampleCRUD, getCRUDDetails } from 'services/crud';
import * as yup from 'yup';
import {
  getMembershipClassDetails,
  MembershipClass,
} from '../../../services/membershipClass';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ImageButton from '../../../components/common/ImageButton';
import ControllerCheckbox from '../../../components/Form/ControllerCheckbox';

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

const validationSchema = yup.object().shape({});

const DetailsMembershipClassForm = () => {
  const { id: membershipClassId } = useParams();
  const mounted = useMounted();
  const [membershipClassDetails, setMembershipClassDetails] =
    useState<MembershipClass | null>(null);
  const [taskQueue, setTaskQueue] = useState<number>(0); //to render loading
  const [expanded, setExpanded] = useState<boolean>(false);
  const [expandedDiscount, setExpandedDiscount] = useState<boolean>(false);
  const [expandedOtherDiscount, setExpandedOtherDiscount] =
    useState<boolean>(false);
  const [checkedEndowPoint, setCheckedEndowPoint] = useState<boolean>(false);
  const [checkedDiscount, setCheckedDiscount] = useState<boolean>(false);
  const [checkedOtherDiscount, setCheckedOtherDiscount] =
    useState<boolean>(false);
  const [checkedSendMail, setCheckedSendMail] = useState<boolean>(false);
  const [checkedSendMail50, setCheckedSendMail50] = useState<boolean>(false);
  const [checkedSendMail75, setCheckedSendMail75] = useState<boolean>(false);
  const [checkedSendMail90, setCheckedSendMail90] = useState<boolean>(false);
  const [expandedSendMail, setExpandedSendMail] = useState<boolean>(false);
  const [expandedSendMail50, setExpandedSendMail50] = useState<boolean>(false);
  const [expandedSendMail75, setExpandedSendMail75] = useState<boolean>(false);
  const [expandedSendMail90, setExpandedSendMail90] = useState<boolean>(false);

  const {
    control,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
    defaultValues: validationSchema.getDefault(),
  });

  //call api to get data details
  useEffect(() => {
    if (!membershipClassId) return;

    setTaskQueue((task) => task + 1);
    getMembershipClassDetails(membershipClassId)
      .then((res) => {
        setMembershipClassDetails(res.data);
        if (res.data?.endowPoint === true) {
          setCheckedEndowPoint(true);
          setExpanded(true);
        }
        if (res.data?.discount === true) {
          setCheckedDiscount(true);
          setExpandedDiscount(true);
        }
        if (res.data?.otherDiscount === true) {
          setCheckedOtherDiscount(true);
          setExpandedOtherDiscount(true);
        }
        if (res.data?.sendMail === true) {
          setCheckedSendMail(true);
          setExpandedSendMail(true);
        }
        if (res.data?.sendMail50 === true) {
          setCheckedSendMail50(true);
          setExpandedSendMail50(true);
        }
        if (res.data?.sendMail75 === true) {
          setCheckedSendMail75(true);
          setExpandedSendMail75(true);
        }
        if (res.data?.sendMail90 === true) {
          setCheckedSendMail90(true);
          setExpandedSendMail90(true);
        }
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
    <FormPaperGrid noValidate>
      <FormHeader title="Chi tiết hạng hội viên" />
      <FormContent>
        <Box>
          <Typography>Thông tin chung</Typography>
        </Box>

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
                disabled
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
                disabled
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
                disabled
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
              <ControllerTextField name="image" control={control} disabled />
            </Grid>
          </Grid>
        </FormGroup>
        <Divider />
        <Box style={{ paddingTop: 20 }}>
          <Typography>Ưu đãi</Typography>
        </Box>
        <Collapse in={expanded}>
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
                  disabled
                />
              </Grid>
              <Grid item xs={12} sm={12} md={12}>
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
                    <ControllerTextField
                      name="value"
                      control={control}
                      disabled
                    />
                  </Grid>
                  <Grid item xs={12} sm={4} md={1}>
                    <FormLabel required title="Đơn vị" name="unit" />
                  </Grid>
                  <Grid item xs={12} sm={8} md={3}>
                    <ControllerTextField
                      name="unit"
                      control={control}
                      disabled
                    />
                  </Grid>
                  <Grid item xs={12} sm={4} md={1}>
                    <FormLabel required title="Loại điểm" name="pointType" />
                  </Grid>
                  <Grid item xs={12} sm={8} md={3}>
                    <ControllerTextField
                      name="pointType"
                      control={control}
                      disabled
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </FormGroup>
        </Collapse>
        <Collapse in={expandedDiscount}>
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
                  disabled
                />
              </Grid>
            </Grid>
          </FormGroup>
        </Collapse>
        <Collapse in={expandedOtherDiscount}>
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
                  disabled
                />
              </Grid>
            </Grid>
          </FormGroup>
        </Collapse>
        <Divider />
        <Box style={{ paddingTop: 20 }}>
          <Typography>Cấu hình sự kiện</Typography>
        </Box>
        <Collapse in={expandedSendMail50}>
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
                  disabled
                />
              </Grid>
              <Grid item xs={12} sm={4} md={2}>
                <FormLabel title="Mẫu email" name="emailId" />
              </Grid>
              <Grid item xs={12} sm={8} md={4}>
                <ControllerTextField
                  name="emailId"
                  control={control}
                  disabled
                />
              </Grid>
            </Grid>
          </FormGroup>
        </Collapse>
        <Collapse in={expandedSendMail75}>
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
                  label="Gửi email 50% điểm nâng hạng"
                  checked={checkedSendMail75}
                  disabled
                />
              </Grid>
              <Grid item xs={12} sm={4} md={2}>
                <FormLabel title="Mẫu email" name="emailId" />
              </Grid>
              <Grid item xs={12} sm={8} md={4}>
                <ControllerTextField
                  name="emailId"
                  control={control}
                  disabled
                />
              </Grid>
            </Grid>
          </FormGroup>
        </Collapse>
        <Collapse in={expandedSendMail90}>
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
                  label="Gửi email 90% điểm nâng hạng"
                  checked={checkedSendMail90}
                  disabled
                />
              </Grid>
              <Grid item xs={12} sm={4} md={2}>
                <FormLabel title="Mẫu email" name="emailId" />
              </Grid>
              <Grid item xs={12} sm={8} md={4}>
                <ControllerTextField
                  name="emailId"
                  control={control}
                  disabled
                />
              </Grid>
            </Grid>
          </FormGroup>
        </Collapse>
        <Collapse in={expandedSendMail}>
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
                  disabled
                />
              </Grid>
              <Grid item xs={12} sm={4} md={2}>
                <FormLabel title="Mẫu email" name="emailId" />
              </Grid>
              <Grid item xs={12} sm={8} md={4}>
                <ControllerTextField
                  name="emailId"
                  control={control}
                  disabled
                />
              </Grid>
            </Grid>
          </FormGroup>
        </Collapse>
      </FormContent>
      <FormFooter>
        <LinkButton startIcon={<ArrowBackIcon />} to="/membershipClass/list">
          Quay lại
        </LinkButton>

        <LinkButton
          variant="contained"
          startIcon={<EditIcon />}
          to={`/membershipClass/list/${membershipClassId}/edit`}
        >
          Sửa
        </LinkButton>
      </FormFooter>
    </FormPaperGrid>
  );
};

export default DetailsMembershipClassForm;
