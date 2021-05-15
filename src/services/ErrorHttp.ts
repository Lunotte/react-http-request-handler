import { toastOne } from "./ToastService";
import * as RouteNavigation from "../navigation/RouteNavigation";


export function catchError(error) {
    console.log(error);

    const routePourAccueil: Function = () => RouteNavigation.navigateToPrevious();
    switch (error.data.status) {
                
        /*  case 503:
              props.history.push('/503') //we will redirect user into 503 page 
              break*/
          case 400:
              toastOne({ title: 'Hmmm', message: error.data.error.message, onOk: routePourAccueil });
              break;
          case 403:
          case 404:
              const message = 'La donnée qui est actuellement recherchée ne semble plus être d\'actualité';
              toastOne({ title: 'Donnée erronée', message, onOk: routePourAccueil });
              break;
        case 500:
              toastOne({ title: 'C\'est très étrange ...', message: 'Essayer encore', onOk: routePourAccueil });
              break;
          default:
              toastOne({ title: 'C\'est embarrassant !!!', message: 'Cette erreur a été remontée', onOk: routePourAccueil });
              break
      }
}