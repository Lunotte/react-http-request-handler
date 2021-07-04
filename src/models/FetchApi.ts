import { AxiosResponse, AxiosError, AxiosRequestConfig } from "axios";

export interface ResponseFetchApi {
    readonly isSuccess: boolean;
    readonly isError: boolean;
    readonly responseSuccess: AxiosResponse;
    readonly responseErreur: ErreurFetchApi;
    readonly status: number;
}

export interface ErreurFetchApi {
    readonly isResponseError: boolean;
    readonly isRequestError: boolean;
    readonly responseError: AxiosError;
    readonly requestError: any;
    readonly messageError: string;
    readonly config: AxiosRequestConfig;
}
