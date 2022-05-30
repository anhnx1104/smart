import { yupResolver } from '@hookform/resolvers/yup';
import MailOutlineOutlinedIcon from '@mui/icons-material/MailOutlineOutlined';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Page from 'components/common/Page';
import RouteLink from 'components/common/RouteLink';
import ControllerTextField from 'components/Form/ControllerTextField';
import FormGroup from 'components/Form/FormGroup';
import useMounted from 'hooks/useMounted';
import useNotification from 'hooks/useNotification';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { apiSendPasswordResetCode } from 'services/auth';
import { validateLine } from 'utils/constants';
import * as yup from 'yup';

type ForgotParams = {
  email: string;
};

const validationSchema = yup.object().shape({
  email: yup
    .string()
    .trim(validateLine.trim)
    .strict(true)
    .email(validateLine.email)
    .max(255)
    .required(validateLine.required)
    .default(''),
});

const ForgotPassword = () => {
  const setNotification = useNotification();
  const [loading, setLoading] = useState<boolean>(false);
  const isMounted = useMounted();
  const { control, handleSubmit } = useForm<ForgotParams>({
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
    defaultValues: validationSchema.getDefault(),
  });

  const onSubmit = async (data: ForgotParams) => {
    try {
      setLoading(true);
      const response = await apiSendPasswordResetCode(data.email);
      if (response.status === 'Success') {
        setNotification({
          message: `Một email đã được gửi tới hòm thư của ${data.email}! Vui lòng kiểm tra!`,
        });
      }
    } catch (error: any) {
      const { response } = error;
      if(response.status === 403){
        setNotification({
          error: `Không tìm thấy email: ${data.email}`,
        });
      }else if (response.status === 401){
        setNotification({
          error: response.data.error.message
        })
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  };

  return (
    <Page title="Quên mật khẩu">
      <Grid
        direction="row"
        justifyContent="center"
        alignItems="center"
        container
        sx={{ height: 1 }}
      >
        <Grid item xs={12} sm={8} md={6} lg={4}>
          <Form noValidate onSubmit={handleSubmit(onSubmit)}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'baseline',
                justifyContent: 'space-between',
                width: '100%',
                mb: 3,
              }}
            >
              <Typography
                variant="h5"
                align="center"
                color="primary"
                sx={{
                  fontStyle: 'bold',
                  fontWeight: '1000',
                }}
                textAlign="left"
              >
                Quên mật khẩu
              </Typography>
              <RouteLink to="/login" variant="subtitle2" gutterBottom>
                Đăng nhập
              </RouteLink>
            </Box>

            <FormGroup sx={{ mb: 4 }} fullWidth>
              <ControllerTextField
                variant="standard"
                hiddenLabel
                name="email"
                control={control}
                placeholder="Email"
                required
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MailOutlineOutlinedIcon />
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

export default ForgotPassword;
