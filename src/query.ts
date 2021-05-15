import { apiJoursSemaine } from './ws/url';
import { ConfigAxios } from './models/AxiosConfig';

export const AXIOS_CONFIG_JOUR_SEMAINE = 'AXIOS_CONFIG_JOUR_SEMAINE';

export const JOURS_SEMAINE_ACTION = 'JOURS_SEMAINE_ACTION';
export const joursSemaineAction = (joursSemaine: any) => {
    return { type:  JOURS_SEMAINE_ACTION, payload: joursSemaine };
  };

export const axiosConfigJourSemaine: ConfigAxios = { axiosRequestConfig: apiJoursSemaine, label: AXIOS_CONFIG_JOUR_SEMAINE, actif: false, actionToDispatch: joursSemaineAction };
