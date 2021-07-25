import { AxiosRequestConfig } from "axios";
import { ErreurFetchApi, ResponseFetchApi } from "../models";
import { isModeDebugThenDisplayInfo, isModeDebugThenDisplayWarn } from "../tools/Utils";
import configAxiosInstance from "./Rh2AxiosInstanceService";

/**
 * Go get the data
 
 * @param axiosInstance Axios instance that will be used to request
 * @param config Request configuration
 * @param dataImmediat If we want to retrieve the data object or keep the information of the request (ex: header, config, etc ...)
 * @returns Promise<ResponseFetchApi>
 */
export async function fetchApi(axiosInstance: string, config: AxiosRequestConfig, dataImmediat?: boolean): Promise<ResponseFetchApi> {

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
    const axiosInstanceToUse = (axiosInstance != null) ? axiosInstance : Object.keys(configAxiosInstance)[0];

    const resultData = await configAxiosInstance[axiosInstanceToUse].request(config);
    isModeDebugThenDisplayInfo('Data was fetched from lib', resultData);

    if (resultData.status >= 200 && resultData.status < 300) {
      return {
        ...fetchSuccess, isSuccess: true,
        responseSuccess: (dataImmediat) ? resultData.data : resultData, status: resultData.status
      };
    }
  } catch (error) {
    if (error.response) {
      fetchSuccess = {
        ...fetchSuccess, status: error.response.status, isError: true,
        responseErreur:
          { ...fetchErreur, isResponseError: true, responseError: error.response, messageError: error.message, config: error.config }
      };
      isModeDebugThenDisplayWarn('Error in response', fetchSuccess);
      return fetchSuccess;
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      fetchSuccess = { ...fetchSuccess, isError: true, responseErreur: { ...fetchErreur, isRequestError: true, requestError: error.request, messageError: error.message, config: error.config } };

      isModeDebugThenDisplayWarn('Error in request: The request was made but no response was received', fetchSuccess);
      return fetchSuccess;
    } else {
      // Something happened in setting up the request that triggered an Error
      // This case can happen if the user cancels the request.
      fetchSuccess = { ...fetchSuccess, isError: true, responseErreur: { ...fetchErreur, messageError: error.message, config: error.config } };
      isModeDebugThenDisplayWarn('Unrecognized error : This case can happen if the user cancels the request.', fetchSuccess);
      return fetchSuccess;
    }
  }

}
