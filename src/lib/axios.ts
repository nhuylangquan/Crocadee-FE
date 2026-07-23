import axios, {
  AxiosError,
  type InternalAxiosRequestConfig,
  type AxiosResponse,
} from 'axios';

export const apiClient = axios.create({
  baseURL:
    (import.meta.env.VITE_API_URL as string | undefined) ??
    'http://localhost:3000',
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token =
      localStorage.getItem('token') ?? sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError): Promise<never> => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    return response.data as unknown as AxiosResponse;
  },
  (error: AxiosError): Promise<never> => {
    if (error.response?.status === 401) {
      console.log('Your login has expired, please log in again!');
    }
    const finalError =
      error instanceof Error ? error : new Error(String(error));
    return Promise.reject(finalError);
  }
);
