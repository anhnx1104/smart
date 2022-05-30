import type {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import axios from 'axios';
import { baseURL } from 'config';
import LocalStorage from './LocalStorage';
import SessionStorage from './SessionStorage';

const headers: AxiosRequestConfig['headers'] = {
  'Content-Type': 'application/json',
  "type": "formData",
};

declare module "axios" {
  export interface AxiosRequestConfig {
    withToken?: boolean;
  }
}

class Axios {
  private httpInstance: AxiosInstance;

  constructor() {
    const httpInstance = axios.create({
      baseURL,
      headers,
    });

    // Request interceptor
    httpInstance.interceptors.request.use(
      (config: AxiosRequestConfig) => {
        if (config?.withToken) {
          const accessToken = LocalStorage.get('accessToken') || SessionStorage.get('accessToken');
          if (config.headers) {
            if (accessToken) {
              config.headers.Authorization = `Bearer ${accessToken}`;
            } else {
              delete config.headers.Authorization;
            }
          }
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    httpInstance.interceptors.response.use(
      (response: AxiosResponse) => response.data,
      (error: AxiosError) => Promise.reject(error)
    );

    this.httpInstance = httpInstance;
  }

  public get HttpClient(): AxiosInstance {
    return this.httpInstance;
  }

  public post<T = any, R = T>(
    url: string,
    data?: T,
    config?: AxiosRequestConfig
  ): Promise<R> {
    return this.HttpClient.post<T, R>(url, data, config);
  }

  public get<T = any, R = T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<R> {
    return this.HttpClient.get<T, R>(url, config);
  }

  public delete<T = any, R = T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<R> {
    return this.HttpClient.delete<T, R>(url, config);
  }
}

const { HttpClient } = new Axios();

export default HttpClient;
