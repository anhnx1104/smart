import { CommonResponse, FilterParams } from 'types/common';
import HttpClient from 'utils/HttpClient';
import { stringify } from 'query-string';



interface MemberTableRequest {
    SearchText : string;
    SearchColumn : string;
    PageIndex : number;
    PageSize :  number;
    SortBy :  string ;
    SortDirection: Order;
  }

export type Order = 'asc' | 'desc' | '';
  
  
export const uploadExcel = async (params: FilterParams) => {
    return HttpClient.post<typeof params, CommonResponse>(
      '/app/member/import-excel',
      params
    );
  };


  
export const getMemberTable = async (params: FilterParams) => {
    return HttpClient.get<typeof params, CommonResponse<MemberTableRequest[]>>(
      `/app/member`+
      stringify(params, {
        skipNull: true,
        skipEmptyString: true,
      }),
      {withToken: true}
    );
  };
  
  