import { axiosConfigJourSemaine } from './../query';
import { CHARGER_CONFIG_ACTION, DECHARGER_CONFIG_ACTION, UTILISER_CONFIG_ACTION } from './hook-action';
import { ConfigAxios } from './../models/AxiosConfig';

const initialHookState: HookState = {
  configs: [axiosConfigJourSemaine],
};

export default function hookReducer(state = initialHookState, action) {

  switch (action.type) {
    case CHARGER_CONFIG_ACTION:
    case DECHARGER_CONFIG_ACTION:
    case UTILISER_CONFIG_ACTION:
      return configReducer(state, action);
    default:
      return state;
  }
}



/////////////////////////////////////////////////////
//          SECTION CONFIG REDUCER            //
/////////////////////////////////////////////////////

function configReducer(state = initialHookState, action) {
  let config: ConfigAxios;
  let index: number;
  let newState: ConfigAxios[];

  switch (action.type) {
    case CHARGER_CONFIG_ACTION:
      config = { ...action.payload, actif: false };
      return { ...state, configs: [...state.configs, config] };
    
    case UTILISER_CONFIG_ACTION:
      index = state.configs.findIndex(config => config.label === action.payload);
      newState = [...state.configs];
      return { ...state, configs: [{...newState[index], actif: true}]  };
    
    case DECHARGER_CONFIG_ACTION:
      index = state.configs.findIndex(config => config.label === action.payload);
      newState = [...state.configs];
      return { ...state, configs: [{ ...newState[index], actif: false }] };
    
  }
}

export interface HookState {
  readonly configs: ConfigAxios[];
}
