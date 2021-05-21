import { AxiosRequestConfig } from 'axios';

// export interface ConfigAxios{
//     readonly axiosRequestConfig: any;// AxiosRequestConfig | ((param?) => void);
//     readonly label: ConfigAxiosTrigger;
//     readonly actif?: boolean;
//     readonly actionToDispatch?: (data: any) => void;
//     // readonly codeAdditionel?: (param?) => void;
// }

// export type ConfigAxiosTrigger = string;

export interface ConfigAxiosEtat {
    readonly axiosRequestConfig: AxiosRequestConfig;
    readonly label: ConfigAxiosTrigger;
    readonly actif?: boolean;
}

export interface ConfigAxios {
    readonly actionToDispatch?: (data: any) => void;
    readonly configAxiosEtat: ConfigAxiosEtat;
}

export type ConfigAxiosTrigger = string;