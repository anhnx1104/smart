import { yupResolver } from '@hookform/resolvers/yup';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import LoadingButton from '@mui/lab/LoadingButton';
import { Grid } from '@mui/material';
import LinkButton from 'components/common/LinkButton';
import LoadingScreen from 'components/common/LoadingScreen';
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
import { company, getCompanyDetails, editBrand } from 'services/setting';
import TypedObject from 'utils/TypedObject';
import * as yup from 'yup';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import ImagePlaceHolder from '../../../components/common/ImagePlaceHolder';
import LogoDropzone from '../../../components/common/LogoDropzone';
import { validateLine } from '../../../utils/constants';

interface FormData {
  id: string;
  image: string;
  logo: string;
  slogan: string | null;
  programName: string | null;
}

const validationSchema = yup.object().shape({
  slogan: yup
    .string()
    .nullable(true)
    .trim(validateLine.trim)
    .max(255, 'Slogan không được quá 255 ký tự')
    .default(''),
  programName: yup
    .string()
    .nullable(true)
    .max(255, 'Tên chương trình không được quá 255 ký tự')
    .trim(validateLine.trim)
    .default(''),
});

const BrandIdentityForm = () => {
  const { id: tenantId } = useParams();
  const mounted = useMounted();
  const setNotification = useNotification();
  const [companyDetails, setCompanyDetails] = useState<company | null>(null);
  const [taskQueue, setTaskQueue] = useState<number>(0); //to render loading
  const [logo, setLogo] = useState<File | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [logoPreview, setLogoPreview] = useState<string>('');
  const [imagePreview, setImagePreview] = useState<string>('');

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

  useEffect(() => {
    setLogo(null);
    setImage(null);
  }, []);

  const handleDropLogo = async ([file]: File[]) => {
    if (file.size >= 1048576 && file.size <= 5242880) {
      const logoPreview = URL.createObjectURL(file);
      setLogoPreview(logoPreview);
      setLogo(file);
    } else {
      setNotification({
        error: 'Logo phải lớn hơn 1MB và nhỏ hơn 5MB',
      });
    }
  };

  const handleDropImage = async ([file]: File[]) => {
    if (file.size >= 1048576 && file.size <= 5242880) {
      const logoPreview = URL.createObjectURL(file);
      setImagePreview(logoPreview);
      setImage(file);
    } else {
      setNotification({
        error: 'Ảnh nền phải lớn hơn 1MB và nhỏ hơn 5MB',
      });
    }
  };

  const onSubmit = async (data: FormData) => {
    if (!logo || !image) {
      setNotification({
        error: 'Phải có ảnh nền đăng nhập và logo',
      });
    } else {
      const formData = new FormData();
      if (!tenantId) return;
      setLoading(true);
      if (logo) {
        formData.append('Logo', logo, logo.name);
      }
      if (image) {
        formData.append('Image', image, image.name);
      }

      formData.append('Slogan', data.slogan ? data.slogan : '');

      formData.append('ProgramName', data.programName ? data.programName : '');

      editBrand(formData, tenantId)
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
    }

    // }
  };

  //call api to get data details
  useEffect(() => {
    if (!tenantId) return;

    setTaskQueue((task) => task + 1);
    getCompanyDetails(tenantId)
      .then((res: any | null) => {
        console.log(res);
        setCompanyDetails(res.data);
      })
      .catch((err) => console.log(err))
      .finally(() => {
        if (mounted.current) {
          setTaskQueue((task) => task - 1);
        }
      });
  }, [tenantId, mounted]);

  //reset form value form data details
  useEffect(() => {
    if (!companyDetails) return;

    const { slogan, programName } = companyDetails;

    reset({
      slogan,
      programName,
    });
    setLogoPreview(companyDetails.logo || '');
    setImagePreview(companyDetails.image || '');
  }, [companyDetails, reset]);

  if (taskQueue > 0) {
    return <LoadingScreen />;
  }

  return (
    <FormPaperGrid noValidate onSubmit={handleSubmit(onSubmit)}>
      <FormHeader title="Nhận diện thương hiệu" />
      <FormContent>
        <FormGroup>
          <Grid
            container
            alignItems="center"
            spacing={3}
            style={{ padding: 20 }}
          >
            <Grid item xs={12} sm={4} md={2}>
              <FormLabel required title="Logo" name="logo" />
            </Grid>
            <Grid item xs={12} sm={8} md={4}>
              <Box sx={{ display: 'flex' }}>
                <ImagePlaceHolder
                  src={logoPreview ? logoPreview : companyDetails?.logo}
                  height={280}
                  width={350}
                />
                <LogoDropzone
                  accept="image/*"
                  maxFiles={1}
                  onDrop={handleDropLogo}
                />
              </Box>
            </Grid>

            <Grid item xs={12} sm={4} md={2}>
              <FormLabel required title="Ảnh nền đăng nhập" name="image" />
            </Grid>
            <Grid item xs={12} sm={8} md={4}>
              <Box sx={{ display: 'flex' }}>
                <ImagePlaceHolder
                  src={imagePreview ? imagePreview : companyDetails?.image}
                  height={280}
                  width={350}
                />
                <LogoDropzone
                  accept="image/*"
                  maxFiles={1}
                  onDrop={handleDropImage}
                />
              </Box>
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
              <FormLabel title="Tên chương trình" name="programName" />
            </Grid>
            <Grid item xs={12} sm={8} md={4}>
              <ControllerTextField
                name="programName"
                control={control}
                placeholder="Nhập tên chương trình"
              />
            </Grid>

            <Grid item xs={12} sm={4} md={2}>
              <FormLabel title="Slogan" name="slogan" />
            </Grid>
            <Grid item xs={12} sm={8} md={4}>
              <ControllerTextField
                name="slogan"
                control={control}
                placeholder="Nhập slogan"
              />
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

export default BrandIdentityForm;
