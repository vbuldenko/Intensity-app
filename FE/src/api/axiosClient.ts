import {
  InternalAxiosRequestConfig,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from "axios";
import { createClient } from "./index";
import { accessTokenService } from "../services/accessTokenService";
import { authService } from "../services/authService";

const axiosClient = createClient();

axiosClient.interceptors.request.use(onRequest);
axiosClient.interceptors.response.use(onResponseSuccess, onResponseError);

function onRequest(request: InternalAxiosRequestConfig<any>) {
  const token = localStorage.getItem("accessToken");
  if (token) {
    request.headers["Authorization"] = `Bearer ${token}`;
  }
  return request;
}

let isRefreshing = false;
let failedQueue: Array<(token: string | null, error?: AxiosError) => void> = [];

// Function to handle the queued requests when a token refresh completes
const processQueue = (error: AxiosError | null, token: string | null) => {
  failedQueue.forEach((callback) => {
    if (error) {
      callback(null, error);
    } else {
      callback(token);
    }
  });
  failedQueue = [];
};

function onResponseSuccess(response: AxiosResponse) {
  return response.data;
}

async function onResponseError(error: AxiosError): Promise<any> {
  const originalRequest = error.config as AxiosRequestConfig & {
    _retry?: boolean;
  };

  if (error.response?.status !== 401 || originalRequest._retry) {
    return Promise.reject(error);
  }

  if (isRefreshing) {
    // Return a promise that resolves/rejects when the token refresh completes
    return new Promise((resolve, reject) => {
      failedQueue.push((token, refreshError) => {
        if (refreshError) {
          reject(refreshError); // Reject with the refresh error
        } else if (token) {
          resolve(axiosClient(originalRequest)); // Retry the original request
        } else {
          reject(error); // Reject with the original error if no token
        }
      });
    });
  }

  originalRequest._retry = true;
  isRefreshing = true;

  try {
    const { accessToken } = await authService.refresh();
    accessTokenService.save(accessToken);

    processQueue(null, accessToken); // Retry all queued requests with the new token
    return axiosClient.request(originalRequest); // Retry the original request
  } catch (refreshError: any) {
    processQueue(refreshError, null);
    return Promise.reject(refreshError);
  } finally {
    isRefreshing = false;
  }
}

export default axiosClient;
