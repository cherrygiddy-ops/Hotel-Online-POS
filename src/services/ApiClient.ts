import axios, { type AxiosRequestConfig } from "axios";
import { useAuthStore } from "../components/Store/AuthStore";
import { MonthlyRevenue } from "@/entities/MonthlyRevenue";
console.log("url:"+import.meta.env.VITE_API_BASE_URL)
 export const axiosInstance = axios.create({
   baseURL: import.meta.env.VITE_API_BASE_URL
 });

axiosInstance.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);



// axiosInstance.interceptors.response.use(
//   (res) => res,
//   async (error) => {
//     const originalRequest = error.config;

//     if (error.response?.status === 401 && !originalRequest._retry) {
//       if (isRefreshing) {
//         return new Promise((resolve, reject) => {
//           failedQueue.push({ resolve, reject });
//         })
//           .then((token) => {
//             originalRequest.headers.Authorization = `Bearer ${token}`;
//             return axiosInstance(originalRequest);
//           })
//           .catch((err) => Promise.reject(err));
//       }

//       originalRequest._retry = true;
//       isRefreshing = true;

//       try {
//         // ✅ Refresh directly with refreshClient
//         const res = await refreshClient.post<{ token: string }>(
//           "/auth/refresh"
//         );
//         const newToken = res.data.token;
//         useAuthStore.getState().setAccessToken(newToken);

//         processQueue(null, newToken);

//         originalRequest.headers.Authorization = `Bearer ${newToken}`;
//         return axiosInstance(originalRequest);
//       } catch (err) {
//         processQueue(err, null);
//         useAuthStore.getState().logout();
//         window.location.href = "/login";
//         return Promise.reject(err);
//       } finally {
//         isRefreshing = false;
//       }
//     }

//     return Promise.reject(error);
//   }
// );



interface Entity {
  id?: number | string;
}

class APICLIENT<TRequest, TResponse> {
  endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  getAll = (config?: AxiosRequestConfig) => {
    return axiosInstance
      .get<TResponse[]>(this.endpoint, config)
      .then((res) => res.data);
  };


  get = (id: number | string) => {
    return axiosInstance
      .get<TResponse>(this.endpoint + "/" + id)
      .then((res) => res.data);
  };

  delete = (id: number) => {
    return axiosInstance
      .delete(this.endpoint + `/${id}`)
      .then((res) => res.data);
  };


  login = (entity: TRequest) => {
    return axiosInstance
      .post<TResponse>(this.endpoint + "/login", entity)
      .then((res) => res.data);
  };
  singUp = (entity: TRequest) => {
    return axiosInstance
      .post<TResponse>(this.endpoint, entity)
      .then((res) => res.data);
  };

  getStats = () => {
  return axiosInstance
    .get<TResponse>(this.endpoint)
    .then((res) => res.data);
};

  getMonthlyRevenue = () => {
    return axiosInstance
      .get<MonthlyRevenue[]>(this.endpoint)
      .then((res) => res.data);
  };
}

export default APICLIENT;
