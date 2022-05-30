import { CommonResponse, FilterParams } from 'types/common';
import HttpClient from 'utils/HttpClient';

export interface ExampleCRUD {
  id: number;
  textField: string;
  selectField: number;
  mutipleSelectField: number[];
  radioField: number;
  switchField: boolean;
  date: string;
  time: string;
  image: string;
}

export const getListExampleCRUD = async (params: FilterParams) => {
  return HttpClient.post<typeof params, CommonResponse<ExampleCRUD[]>>(
    '/Example/CRUD/ListCRUD',
    params
  );
};

export const deleteExampleCRUD = async (id: number) => {
  return HttpClient.delete<number, CommonResponse<ExampleCRUD[]>>(
    `/Example/CRUD/Delete?id=${id}`
  );
};

interface CreateParams {
  id: number;
  textField: string;
  selectField: number;
  mutipleSelectField: number[];
  radioField: number;
  switchField: boolean;
  date: string;
  time: string;
  image: string;
}

export const createExampleCRUD = async (params: CreateParams) => {
  return HttpClient.post<typeof params, CommonResponse>(
    '/Example/CRUD/Create',
    params
  );
};

export const getCRUDDetails = async (id: string) => {
  return HttpClient.get<string, CommonResponse>(
    `/Example/CRUD/Detail?id=${id}`
  );
};

export const editExampleCRUD = async (params: CreateParams) => {
  return HttpClient.put<CreateParams, CommonResponse>('/Example/CRUD/Edit');
};
