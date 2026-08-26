// import axios, { type AxiosRequestConfig } from "axios";
// import { OrderSummaryDto } from "@/entities/OrderSummaryDto";
// import { useAuthStore } from "@/Store/AuthStore";
// import { CheckoutRequestDto } from "@/entities/CheckoutRequestDto";
// import { CheckoutResponseDto } from "@/entities/CheckoutResponseDto";
// import { axiosInstance } from "./ApiClient";
// class APICLIENT<TRequest, TResponse> {
//   endpoint: string;

//   constructor(endpoint: string) {
//     this.endpoint = endpoint;
//   }

//   // Generic GET all
//   getAll = (config?: AxiosRequestConfig) =>
//     axiosInstance.get<TResponse[]>(this.endpoint, config).then(res => res.data);

//   // Generic GET by id
//   get = (id: string | number, config?: AxiosRequestConfig) =>
//     axiosInstance.get<TResponse>(`${this.endpoint}/${id}`, config).then(res => res.data);

//   // Generic POST
//   post = (path: string = "", body?: TRequest, config?: AxiosRequestConfig) =>
//     axiosInstance.post<TResponse>(`${this.endpoint}${path}`, body, config).then(res => res.data);

//   // Generic PUT
//   put = (path: string, body?: Partial<TRequest>, config?: AxiosRequestConfig) =>
//     axiosInstance.put<TResponse>(`${this.endpoint}${path}`, body, config).then(res => res.data);

//   // Generic DELETE
//   delete = (path: string, config?: AxiosRequestConfig) =>
//     axiosInstance.delete<TResponse>(`${this.endpoint}${path}`, config).then(res => res.data);
// }
