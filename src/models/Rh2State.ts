import { ErreurFetchApi } from "./FetchApi";

export interface Rh2StateErreurApi {
    label: string;
    error: ErreurFetchApi;
  }
  
export interface Rh2State {
    globalConfig: any;
    configs: any[];
    queryInProgress: string[];
    erreurApi: Rh2StateErreurApi[];
  }
  