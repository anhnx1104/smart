import { yupResolver } from '@hookform/resolvers/yup';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Page from 'components/common/Page';
import ControllerTextField from 'components/Form/ControllerTextField';
import FormGroup from 'components/Form/FormGroup';
import useMounted from 'hooks/useMounted';
import useNotification from 'hooks/useNotification';
import { parse } from 'query-string';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import { apiResetPassword } from 'services/auth';
import { validateLine } from 'utils/constants';
import Regexs from 'utils/Regexs';
import * as yup from 'yup';

type ResetParams = {
  password: string;
  confirmPassword: string;
};

const validationSchema = yup.object().shape({
  password: yup
    .string()
    .trim(validateLine.trim)
    .strict(true)
    .required(validateLine.required)
    .min(8, 'Mật khẩu phải chứa ít nhất 8 ký tự')
    .max(50, 'Mật khẩu không được quá 50 ký tự')
    .matches(Regexs.password, validateLine.regexPassword)
    .default(''),
  confirmPassword: yup
    .string()
    .trim(validateLine.trim)
    .oneOf([yup.ref('password'), null], validateLine.confirmPassword)
    .strict(true)
    .required(validateLine.required)
    .default(''),
});

const ResetPassword = () => {
  const setNotification = useNotification();
  const isMounted = useMounted();
  const location = useLocation();
  const navigate = useNavigate();
  const { email, resetToken } = parse(location.search);
  const [loading, setLoading] = useState<boolean>(false);

  const { control, handleSubmit } = useForm<ResetParams>({
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
    defaultValues: validationSchema.getDefault(),
  });


  const onSubmit = async (data: ResetParams) => {
    try {
      setLoading(true);
      const response = await apiResetPassword({
        password: data.password,
        email,
        resetToken: resetToken?.toString().replaceAll(/ /g, "+"),
      });
      if (response.status === 'success') {
        setNotification({
          message: 'Reset password thành công!',
        });
        navigate('/login');
      }
    } catch (error) {
      console.log(error);
      setNotification({
        error: 'Mã đặt lại mật khẩu hết hạn',
      });
      navigate('/forgot-password');
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  };

  return (
    <Page title="Tạo mật khẩu mới">
      <Grid
        direction="row"
        justifyContent="center"
        alignItems="center"
        container
        sx={{ height: 1 }}
      >
        <Grid item xs={12} sm={8} md={6} lg={4}>
          <Form noValidate onSubmit={handleSubmit(onSubmit)}>
            <Typography
              variant="h5"
              align="center"
              color="primary"
              sx={{
                width: '100%',
                mb: 3,
                fontStyle: 'bold',
                fontWeight: '1000',
              }}
              textAlign="left"
            >
              Tạo mật khẩu mới
            </Typography>

            <FormGroup sx={{ mb: 2 }} fullWidth>
              <ControllerTextField
                variant="standard"
                hiddenLabel
                name="password"
                control={control}
                type="password"
                required
                fullWidth
                placeholder="Mật khẩu"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlinedIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </FormGroup>
            <FormGroup sx={{ mb: 4 }} fullWidth>
              <ControllerTextField
                variant="standard"
                hiddenLabel
                name="confirmPassword"
                control={control}
                type="password"
                required
                fullWidth
                placeholder="Xác nhận mật khẩu"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlinedIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </FormGroup>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%',
              }}
            >
              <LoadingButton
                loading={loading}
                loadingPosition="center"
                type="submit"
                sx={{ mb: 2, width: '100%' }}
              >
                Xác nhận
              </LoadingButton>
            </Box>
          </Form>
        </Grid>
      </Grid>
    </Page>
  );
};

const Form = styled('form')(({ theme }) => ({
  width: '100%',
  height: '100%',
  padding: theme.spacing(10),
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
}));

export default ResetPassword;
