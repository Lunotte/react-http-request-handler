import { AxiosRequestConfig } from "axios";
import configAxiosInstance from "../config/ConfigAxiosInstance";
import { ErreurFetchApi, ResponseFetchApi } from "../models";

/**
 * Aller chercher les données
 * @param config Configuration de la requète
 * @param dataImmediat Si on veut récupérer l'objet data ou bien conserver les information de la requête (ex: header, config, etc...)
 * @returns 
 */
export async function fetchApi(config: AxiosRequestConfig, dataImmediat?: boolean): Promise<ResponseFetchApi> {

  let fetchSuccess: ResponseFetchApi = {
    isSuccess: false,
    isError: false,
    responseSuccess: null,
    responseErreur: null,
    status: null
  }

  let fetchErreur: ErreurFetchApi = {
    isResponseError: false,
    isRequestError: false,
    responseError: null,
    requestError: null,
    messageError: null,
    config: null
  }

  try {
    const resultData = await configAxiosInstance.request(config);
    console.log('les données ont été récupérées depuis la lib', resultData);

    if (resultData.status >= 200 && resultData.status < 300) {
      return { ...fetchSuccess, isSuccess: true, responseSuccess: (dataImmediat) ? resultData.data : resultData, status: resultData.status };
    }
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log(error.response);
      console.log(error.response.status);
      return { ...fetchSuccess, status: error.response.status, isError: true, responseErreur: {...fetchErreur, isResponseError: true, responseError: error.response, messageError: error.message, config: error.config } };
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      console.log(error.request);
      return { ...fetchSuccess, isError: true, responseErreur: {...fetchErreur, isRequestError: true, requestError: error.request, messageError: error.message, config: error.config } };
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log('Error', error.message);
      return { ...fetchSuccess, isError: true, responseErreur: {...fetchErreur, messageError: error.message, config: error.config } };
    }
  }

}

// export async function postApiAuth(url: string, data: any, params?: any): Promise<AxiosPromise | undefined> {
//   try {
//     return await Axios({ method: 'post', url, data, params });

//   } catch (err) {
//     console.log(err);
//   }
// }
