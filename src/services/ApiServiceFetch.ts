import Axios, { AxiosPromise, AxiosRequestConfig } from "axios";
import { Platform } from "react-native";
import axiosConfig from "../config/AxiosConfig";
import { isMobile, isWeb } from "../tools/Utils";
//import { catchError } from "./ErrorHttp";
import { Alert } from "react-native";

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
    console.log(error);
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      console.log(error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log('Error', error.message);
    }
    console.log(error.config);



    // catchError(error.response);
    console.log(error.response);

    if (isMobile()) {
      Alert.alert('problem', error.message,
        [
          { text: "OK", onPress: () => console.log('Rien de déclaré') }
        ],
        { cancelable: false });
    }

    if (isWeb()) {
      console.log('Log pour message vers la console du navigateur')
    }

  }

}

export async function postApiAuth(url: string, data: any, params?: any): Promise<AxiosPromise | undefined> {
  try {
    return await Axios({ method: 'post', url, data, params });

  } catch (err) {
    console.log(err);
  }
}
