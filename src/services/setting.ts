import { parse, stringify } from 'query-string';
// import { Member } from 'services/setting';
import { CommonResponse } from 'types/common';
import HttpClient from 'utils/HttpClient';

export interface company {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  website: string;
  establishDate: string;
  district: string;
  faxNumber: string;
  commune: string;
  city: string;
  street: string;
  teanantId: string;
  image: string;
  logo: string;
  slogan: string;
  programName: string;
}

interface CreateParams {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  website: string;
  establishDate: string;
  district: string;
  faxNumber: string;
  commune: string;
  city: string;
  street: string;
}

interface UpdateBrandParams {
  id:string;
  image: File | null;
  logo: File | null;
  // image: string;
  // logo: string;
  slogan: string;
  programName: string;
}

export interface Member {
  id:string;
  ageCHD: number;
  chdAccount: boolean;
  emailId: string;
  inActiveAccount: boolean;
  inActiveTime: number;
  memberCode: number;
  supspendedAccount: boolean;
  abnormalTransaction: boolean;
  differentMemberName: boolean;
  conflictTransaction: boolean;
  differentDob: boolean;
  differentPhoneNumber: boolean;
  tenantId: string;
  timeUnit: number;
  transactionType: number;
}

interface EditMember {
  id:string;
  ageCHD: number;
  chdAccount: boolean;
  emailId: string;
  inActiveAccount: boolean;
  inActiveTime: number;
  memberCode: number;
  supspendedAccount: boolean;
  abnormalTransaction: boolean;
  differentMemberName: boolean;
  conflictTransaction: boolean;
  differentDob: boolean;
  differentPhoneNumber: boolean;
  tenantId: string;
  timeUnit: number|null;
  transactionType: number;
}

export interface Point {
  id:string;
  pointRatingName : string;
  pointRatingPeriod : number;
  pointRatingTimeUnit : number;
  pointRatingTime : number;
  pointRatingExpiredDate :  Date | null;
  pointGiftName :  string ;
  pointGiftPeriod : number;
  pointGiftTimeUnit : number;
  pointGiftTime : number;
  gotIt : number;
  pointGiftExpiredDate :  Date | null;
}

interface EditPoint {
  id:string;
  pointRatingName : string;
  pointRatingPeriod : number;
  pointRatingTimeUnit : number;
  pointRatingTime : number;
  pointRatingExpiredDate :  Date | null;
  pointGiftName :  string ;
  pointGiftPeriod : number;
  pointGiftTimeUnit : number;
  pointGiftTime : number;
  gotIt : number;
  pointGiftExpiredDate :  Date | null;
}



export const createCompany = async (params: CreateParams) => {
  return HttpClient.post<typeof params, CommonResponse>(
    '/Example/CRUD/Create',
    params
  );
};


export const getCompanyDetails = async (id: string) => {
  return HttpClient.get<string, CommonResponse>(
    `${process.env.REACT_APP_BASE_URL}/app/business/?tenantId=${id}`,
    {withToken: false}
  );
};

export const editCompany = async (params: CreateParams) => {
  return HttpClient.put<CreateParams, CommonResponse>(`${process.env.REACT_APP_BASE_URL}/app/business/?tenantId=${params.id}`,
    params,
    {withToken: false});
};

export const editBrand = async (params: any, id :string) => {
  return HttpClient.put<UpdateBrandParams, CommonResponse>(`${process.env.REACT_APP_BASE_URL?.replace('api', '')}update-brand/${id}`,
    params,
    {
      withToken: false,
      headers: {
        'Content-Type': 'multipart/form-data',
      },})
    ;

};

export const getMemberSetting = async (id: string) => {
  return HttpClient.get<string, CommonResponse>(
    `${process.env.REACT_APP_BASE_URL}/app/member-setting/?tenantId=${id}`,
    {withToken: false}
  );
};
// export const getMemberTable = async (params: MemberTableRequest) => {
//   return HttpClient.get<string, CommonResponse>(
//     `/app/member`, {
//       params
//     }
//   );
// };


export const editMemberSetting = async (params: EditMember) => {
  return HttpClient.put<EditMember, CommonResponse>(`${process.env.REACT_APP_BASE_URL}/app/member-setting/?tenantId=${params.id}`,
    params,
    {withToken: false});
};

export const getPointDetails = async (id: string) => {
  return HttpClient.get<string, CommonResponse>(
    `${process.env.REACT_APP_BASE_URL}/app/point-setting/${id}`,
    {withToken: false}
  );
};

export const editPointSetting = async (params: EditPoint) => {
  return HttpClient.put<EditPoint, CommonResponse>(`${process.env.REACT_APP_BASE_URL}/app/point-setting/${params.id}`,
    params,
    {withToken: false});
};
