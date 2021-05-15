import Axios, { AxiosPromise, AxiosRequestConfig } from "axios";
import axiosConfig from "../config/AxiosConfig";
import { catchError } from "./ErrorHttp";

/**
 * Aller chercher les données
 * @param config Configuration de la requète
 * @param dataImmediat Si on veut récupérer l'objet data ou bien conserver les information de la requête (ex: header, config, etc...)
 * @returns 
 */
export async function fetchApi(config: AxiosRequestConfig, dataImmediat?: boolean): Promise<any> {
  try {
    const resultData = await axiosConfig.request(config);
    console.log('les données ont été récupérées depuis la lib', resultData);
    
    if (resultData.status === 200) {
      return (dataImmediat) ? resultData.data : resultData;
    }
  } catch (error) {
    catchError(error.response);
  }
}

export async function postApiAuth(url: string, data: any, params?: any): Promise<AxiosPromise | undefined> {
  try{
    return await Axios({method: 'post', url, data, params});

  } catch (err) {
      console.log(err);
  }
}
