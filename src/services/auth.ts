import { client_params } from 'config';
import { CommonResponse } from 'types/common';
import { UserInfo } from 'types/user';
import HttpClient from 'utils/HttpClient';
import { stringify } from 'query-string';
export interface LoginParams {
  username: string;
  password: string;
  rememberMe?: boolean;
}

interface ForgotPasswordResponse {
  status: string;
  message?: string;
  error?: {
    code?:string
  };
}

export interface ResetPasswordParams {
  email: string | (string | null)[] | null;
  resetToken: string | undefined | (string | null)[] | null;
  password: string;
}
export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
  error: string;
  error_description: string;
}

export const apiLogin = async (params: LoginParams) => {
  return HttpClient.post<typeof params, LoginResponse>(
    `${process.env.REACT_APP_BASE_URL?.replace('api', '')}connect/token`,
    stringify({ ...params, ...client_params }),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );
};

export const apiSendPasswordResetCode = async (email: string) => {
  return HttpClient.post<typeof email, ForgotPasswordResponse>(
    'app/cus-account/send-password-reset-code',
    {
      email,
      appName: 'MVC',
      returnUrl: null,
      returnUrlHash: null,
    }
  );
};

export const sendSuccessLoginEmail = async (email: string) => {
  return HttpClient.post<typeof email>(
    `${process.env.REACT_APP_BASE_URL}/app/email/send-email`,
    {
      sendTo: email,
      subject: "Success",
      body: "email have been send"
    },
    {withToken: false}
  );
};

export const apiResetPassword = async (params: ResetPasswordParams) => {
  return HttpClient.post<typeof params, ForgotPasswordResponse>(
    'app/cus-account/reset-password',
    params
  );
};

export const getUserDetails = async () => {
  return HttpClient.get<null, CommonResponse<UserInfo>>(
    '/Shared/User/GetUserDetails'
  );
};
