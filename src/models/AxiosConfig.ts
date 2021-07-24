import { AxiosRequestConfig } from 'axios';
import { TypeQueryParameter } from './Rh2Directory';

/**
 * keyOfInstance: If is not provided, first instance will be used
 */
export interface Rh2AxiosConfig {
    readonly keyOfInstance?: string; // Instance axios
    readonly axiosRequestConfig: AxiosRequestConfig;
    readonly label: ConfigAxiosTrigger;
    readonly addToDirectory?: boolean; // S'utilise si l'on veut executer une seule fois la requête
    // Si true, la valeur pourra etre mise à jour avec le service QueryStorageService
    readonly justeReponse?: boolean;
    readonly dataFromRoute?: DataFromRoute;
    readonly successHandler?: (param?: any) => void; // Ce champ est obligatoire pour obtenir un résultat si on est en mode sans state
    readonly errorHandler?: (param?: any) => void; // Si specifié ici, alors il sera utilisé en priorité, sinon, si définit dans la conf global, il sera utilisé
}

export interface DataFromRoute {
    params: string[],
    typeQueryParameter: TypeQueryParameter,
}

export type ConfigAxiosTrigger = string;

export type ActionToDispatch = { type: string; payload?: any };
