import { ResponseFetchApi } from "./FetchApi";

export interface Rh2StateErreurApi {
    label: string;
    error: ResponseFetchApi;
  }
  
export interface Rh2State {
    globalConfig: any;
    configs: any[];
    queryInProgress: string[];
    erreurApi: Rh2StateErreurApi[];
  }
  