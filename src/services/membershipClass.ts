import { CommonResponse, FilterParams } from 'types/common';
import HttpClient from 'utils/HttpClient';
import { stringify } from 'query-string';

export interface MembershipClass {
  id: number;
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
  emailId: string
}

export const getListMembershipClass = async (params: FilterParams) => {
  return HttpClient.get<typeof params, CommonResponse<MembershipClass[]>>(
    `${process.env.REACT_APP_BASE_URL}/app/membership-class?`+
    stringify(params, {
      skipNull: true,
      skipEmptyString: true,
    }),
    {withToken: true}
  );
};

export const deleteMembershipClass = async (id: number) => {
  return HttpClient.delete<number, CommonResponse<MembershipClass[]>>(
    `${process.env.REACT_APP_BASE_URL}/app/membership-class/${id}`,
    {withToken: true}
  );
};

interface CreateParams {
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
  emailId: string
}

export const createMembershipClass = async (params: any) => {
  return HttpClient.post<CreateParams, CommonResponse>(
    `${process.env.REACT_APP_BASE_URL}/app/membership-class`,
    params,
    {
      withToken: true,
      headers: {
        'Content-Type': 'multipart/form-data',
      },}
  );
};

export const getMembershipClassDetails = async (id: string) => {
  return HttpClient.get<string, CommonResponse>(
    `${process.env.REACT_APP_BASE_URL}/app/membership-class/${id}`,
    {withToken: true}
  );
};

export const editMembershipClass = async (params: any) => {
  return HttpClient.put<CreateParams, CommonResponse>(`${process.env.REACT_APP_BASE_URL}/app/membership-class`,
    params,
    {withToken: true});
};
