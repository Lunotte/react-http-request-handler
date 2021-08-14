/*
 * File: AxiosConfig.ts                                                        *
 * Project: react-http-request-handler                                         *
 * Created Date: 2021 05 15                                                    *
 * Author: Charly Beaugrand                                                    *
 * -----                                                                       *
 * Last Modified: 2021 08 14 - 01:10 pm                                        *
 * Modified By: Charly Beaugrand                                               *
 * -----                                                                       *
 * Copyright (c) 2021 Lunotte                                                  *
 * ----------	---	---------------------------------------------------------  *
 */






import { AxiosRequestConfig } from 'axios';

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
    readonly successHandler?: (param?: any) => void; // Ce champ est obligatoire pour obtenir un résultat si on est en mode sans state
    readonly errorHandler?: (param?: any) => void; // Si specifié ici, alors il sera utilisé en priorité, sinon, si définit dans la conf global, il sera utilisé
}

export type ConfigAxiosTrigger = string;

export type ActionToDispatch = { type: string; payload?: any };
