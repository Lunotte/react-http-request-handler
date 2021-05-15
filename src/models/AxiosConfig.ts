import { AxiosRequestConfig } from 'axios';

export interface ConfigAxios{
    readonly axiosRequestConfig: AxiosRequestConfig;
    readonly label: ConfigAxiosTrigger;
    readonly actif?: boolean;
    readonly actionToDispatch: (data: any) => void;
}

export type ConfigAxiosTrigger = string;
