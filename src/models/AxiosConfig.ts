import { TypeQueryParameter } from './QueryDirectory';
import { AxiosRequestConfig } from 'axios';

// export interface ConfigAxios{
//     readonly axiosRequestConfig: any;// AxiosRequestConfig | ((param?) => void);
//     readonly label: ConfigAxiosTrigger;
//     readonly actif?: boolean;
//     readonly actionToDispatch?: (data: any) => void;
//     // readonly codeAdditionel?: (param?) => void;
// }

// export type ConfigAxiosTrigger = string;

/**
 * reduxIsActif ça peut servir
 */
// export interface SettingsInitializerRnhrh {
//     baseUrl: string,
//     reduxIsActif?: boolean;
// }

export interface ConfigAxiosEtat {
    readonly axiosRequestConfig: AxiosRequestConfig;
    readonly label: ConfigAxiosTrigger;
    readonly addToDirectory?: boolean; // S'utilise si l'on veut executer une seule fois la requête
                                         // Si true, la valeur pourra etre mise à jour avec le service QueryStorageService
   // readonly actif?: boolean; 
}

export interface ConfigAxios {
    readonly configAxiosEtat: ConfigAxiosEtat;
    readonly justeReponse?: boolean;
    readonly actionToDispatch?: (data: any) => void;
    readonly actionToDispatchSuplementaires?: ActionToDispatch[]
    readonly dataFromRoute?: DataFromRoute;
}

export interface DataFromRoute {
    params: string[],
    typeQueryParameter: TypeQueryParameter,
}

export type ConfigAxiosTrigger = string;

export type ActionToDispatch = { type: string; payload?: any };
