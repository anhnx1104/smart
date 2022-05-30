import { yupResolver } from '@hookform/resolvers/yup';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import LoadingButton from '@mui/lab/LoadingButton';
import { Grid } from '@mui/material';
import LinkButton from 'components/common/LinkButton';
import LoadingScreen from 'components/common/LoadingScreen';
import ControllerDatePicker from 'components/Form/ControllerDatePicker';
import ControllerTextField from 'components/Form/ControllerTextField';
import FormContent from 'components/Form/FormContent';
import FormFooter from 'components/Form/FormFooter';
import FormGroup from 'components/Form/FormGroup';
import FormHeader from 'components/Form/FormHeader';
import FormLabel from 'components/Form/FormLabel';
import FormPaperGrid from 'components/Form/FormPaperGrid';
import useMounted from 'hooks/useMounted';
import useNotification from 'hooks/useNotification';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { editCompany, company, getCompanyDetails } from 'services/setting';
import TypedObject from 'utils/TypedObject';
import * as yup from 'yup';
import Regexs from '../../../utils/Regexs';
import FormInputAdornment from '../../../components/Form/FormInputAdornment';
import Divider from '@mui/material/Divider';
import { validateLine } from '../../../utils/constants';

interface FormData {
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  website: string;
  establishDate: Date | null;
  district: string;
  faxNumber: string;
  commune: string;
  city: string;
  street: string;
  teanantId: string;
}

const validationSchema = yup.object().shape({
  name: yup
    .string()
    .required(validateLine.required)
    .trim(validateLine.trim)
    .strict(true)
    .max(255, 'Tên doanh nghiệp không được chứa quá 255 ký tự')
    .default(''),
  email: yup
    .string()
    .required(validateLine.required)
    .trim(validateLine.trim)
    .matches(Regexs.email, validateLine.email)
    .strict(true)
    .max(255, 'Email không được chứa quá 255 ký tự')
    .default(''),
  address: yup
    .string()
    .required(validateLine.required)
    .trim(validateLine.trim)
    .strict(true)
    .max(255, 'Số nhà không được chứa quá 255 ký tự')
    .default(''),
  district: yup
    .string()
    .trim(validateLine.trim)
    .strict(true)
    .default(''),
  commune: yup
    .string()
    .trim(validateLine.trim)
    .strict(true)
    .default(''),
  city: yup
    .string()
    .trim(validateLine.trim)
    .strict(true)
    .default(''),
  street: yup
    .string()
    .required(validateLine.required)
    .trim(validateLine.trim)
    .strict(true)
    .max(255, 'Phố không được chứa quá 255 ký tự')
    .default(''),
  website: yup
    .string()
    .trim(validateLine.trim)
    .strict(true)
    .max(255, 'Website không được chứa quá 255 ký tự')
    .default(''),
  phoneNumber: yup
    .string()
    .required(validateLine.required)
    .matches(Regexs.phone, 'Số điện thoại không hợp lệ')
    .max(10, 'Số điên thoại không được chứa quá 10 ký tự')
    .default(''),
  faxNumber: yup
    .string()
    .matches(Regexs.phone, 'Số fax không hợp lệ')
    .default(''),
  establishDate: yup
    .date()
    .required(validateLine.required)
    .nullable()
    .typeError('Invalid time')
    .default(null),

});

const EditCompanyForm = () => {
  const { id: companyId } = useParams();
  const mounted = useMounted();
  const setNotification = useNotification();
  const [companyDetails, setCompanyDetails] =
    useState<company | null>(null);
  const [taskQueue, setTaskQueue] = useState<number>(0); //to render loading

  const [loading, setLoading] = useState<boolean>(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
    defaultValues: validationSchema.getDefault(),
  });

  const onSubmit = async (data: FormData) => {
    if (!companyId) return;

    setLoading(true);
    const crudData = {
      ...data,
      id: companyId,
      image: '',
      establishDate: data.establishDate?.toISOString() ?? '',
    };

    editCompany(crudData)
      .then((res) => {
        if (res.success) {
          // navigate('/settings/company');
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
    if (!companyId) return;

    setTaskQueue((task) => task + 1);
    getCompanyDetails(companyId)
      .then((res: any | null) => {
        setCompanyDetails(res.data);
      })
      .catch((err) => console.log(err))
      .finally(() => {
        if (mounted.current) {
          setTaskQueue((task) => task - 1);
        }
      });
  }, [companyId, mounted]);

  //reset form value form data details
  useEffect(() => {
    if (!companyDetails) return;

    const {
      name,
      establishDate,
      phoneNumber,
      email,
      address,
      website,
      district,
      faxNumber,
      commune,
      city,
      street,
    } = companyDetails;

    reset({
      establishDate: new Date(establishDate),
      name,
      phoneNumber,
      email,
      address,
      website,
      district,
      faxNumber,
      commune,
      city,
      street,
    });
  }, [companyDetails, reset]);

  if (taskQueue > 0) {
    return <LoadingScreen />;
  }

  return (
    <FormPaperGrid noValidate onSubmit={handleSubmit(onSubmit)}>
      <FormHeader title="Cài đặt thông tin doanh nghiệp" />
      <FormContent>
        <FormGroup>
          <Grid container alignItems="center" spacing={3} style={{padding: 20}}>
            <Grid item xs={12} sm={4} md={2}>
              <FormLabel required title="Tên doanh nghiệp" name="name" />
            </Grid>
            <Grid item xs={12} sm={8} md={4}>
              <ControllerTextField name="name" control={control} placeholder="Nhập tên doanh nghiệp" />
            </Grid>

            <Grid item xs={12} sm={4} md={2}>
              <FormLabel required title="Email" name="email" />
            </Grid>
            <Grid item xs={12} sm={8} md={4}>
              <ControllerTextField name="email" control={control} placeholder="Nhập email" />
            </Grid>
          </Grid>
        </FormGroup>
        <Divider />
        <FormGroup>
          <Grid container alignItems="center" columnSpacing={3} style={{padding: 20}}>
            <Grid item xs={12} sm={4} md={2}>
              <FormLabel
                required
                title="Số điện thoại"
                name="phoneNumber"
              />
            </Grid>
            <Grid item xs={12} sm={8} md={4}>
              <ControllerTextField
                name="phoneNumber"
                control={control}
                InputProps={{
                  startAdornment: (
                    <FormInputAdornment
                      position="start"
                      title={"(+84)"}
                    />
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} sm={4} md={2}>
              <FormLabel
                title="Số Fax"
                name="faxNumber"
              />
            </Grid>
            <Grid item xs={12} sm={8} md={4}>
              <ControllerTextField
                name="faxNumber"
                control={control}
              />
            </Grid>
          </Grid>
        </FormGroup>
        <Divider />
        <FormGroup>
          <Grid container alignItems="center" columnSpacing={3} style={{padding: 20}}>
            <Grid item xs={12} sm={4} md={2}>
              <FormLabel required title="Số nhà" name="address" />
            </Grid>
            <Grid item xs={12} sm={8} md={4}>
              <ControllerTextField name="address" control={control} placeholder="Nhập số nhà" />
            </Grid>

            <Grid item xs={12} sm={4} md={2}>
              <FormLabel required title="Phố" name="street" />
            </Grid>
            <Grid item xs={12} sm={8} md={4}>
              <ControllerTextField name="street" control={control} placeholder="Nhập phố" />
            </Grid>
          </Grid>
        </FormGroup>
        <Divider />
        <FormGroup>
          <Grid container alignItems="center" columnSpacing={3} style={{padding: 20}}>
            <Grid item xs={12} sm={4} md={2}>
              <FormLabel title="Thành phố" name="city" />
            </Grid>
            <Grid item xs={12} sm={8} md={4}>
              <ControllerTextField name="city" control={control} placeholder="Nhập thành phố" />
            </Grid>

            <Grid item xs={12} sm={4} md={2}>
              <FormLabel title="Quận/ Huyện" name="district" />
            </Grid>
            <Grid item xs={12} sm={8} md={4}>
              <ControllerTextField name="district" control={control} placeholder="Nhập quận/ huyện" />
            </Grid>
          </Grid>
        </FormGroup>
        <Divider />
        <FormGroup>
          <Grid container alignItems="center" columnSpacing={3} style={{padding: 20}}>
            <Grid item xs={12} sm={4} md={2}>
              <FormLabel title="Phường/ Xã" name="commune" />
            </Grid>
            <Grid item xs={12} sm={8} md={4}>
              <ControllerTextField name="commune" control={control} placeholder="Nhập phường/ xã" />
            </Grid>

            <Grid item xs={12} sm={4} md={2}>
              <FormLabel required title="Ngày thành lập" name="establishDate" />
            </Grid>
            <Grid item xs={12} sm={8} md={4}>
              <ControllerDatePicker
                name="establishDate"
                control={control}
                errors={errors}
                maxDate={new Date()}
              />
            </Grid>
          </Grid>
        </FormGroup>
        <Divider />
        <FormGroup>
          <Grid container alignItems="center" columnSpacing={2} style={{padding: 20}}>
            <Grid item xs={12} sm={4} md={2}>
              <FormLabel title="Website" name="website" />
            </Grid>
            <Grid item xs={12} sm={8} md={4}>
              <ControllerTextField name="website" control={control} placeholder="Nhập website" />
            </Grid>
          </Grid>
        </FormGroup>
      </FormContent>
      <FormFooter>
        <LinkButton startIcon={<ArrowBackIcon />} to="/settings/company">
          Hủy
        </LinkButton>
        <LoadingButton
          startIcon={<SaveIcon />}
          loading={loading}
          loadingPosition="start"
          type="submit"
          disabled={!TypedObject.isEmpty(errors)}
        >
          Lưu
        </LoadingButton>
      </FormFooter>
    </FormPaperGrid>
  );
};

export default EditCompanyForm;
