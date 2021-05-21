import { CHARGER_CONFIG_ACTION, UTILISER_CONFIG_ACTION, DESACTIVER_CONFIG_ACTION } from './hook-action';
import { ConfigAxiosEtat } from './../models/AxiosConfig';

const initialHookState: HookState = {
  configs: [],
};

export default function hookReducer(state = initialHookState, action) {

  switch (action.type) {
    case CHARGER_CONFIG_ACTION:
    case DESACTIVER_CONFIG_ACTION:
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
  let index: number;
  let newState: ConfigAxiosEtat[];

  switch (action.type) {
    case CHARGER_CONFIG_ACTION:
      newState = [...state.configs];

      action.payload.forEach((actionConfig: ConfigAxiosEtat) => {
        const condition = state.configs.find(config => config.label === actionConfig.label);

        if (condition != null && !condition.actif && actionConfig.actif) {
           // Si un élément a déjà été ajouté, on le remplace, peut-être qu'un paramètre a été modifié
           newState = state.configs.filter(config => config.label !== actionConfig.label);
           newState = [...newState, actionConfig];
        }
        
        if (!condition) {
          newState = [...newState, actionConfig];
        }
      });
      
      return { ...state, configs: newState };
    
    case UTILISER_CONFIG_ACTION:
      index = state.configs.findIndex(config => config.label === action.payload);
      newState = [...state.configs];
      return { ...state, configs: [{...newState[index], actif: true}]  };
    
    case DESACTIVER_CONFIG_ACTION:
      index = state.configs.findIndex(config => config.label === action.payload);
      newState = [...state.configs];
      return { ...state, configs: [{ ...newState[index], actif: false }] };
    
  }
}

export interface HookState {
  readonly configs: ConfigAxiosEtat[];
}
