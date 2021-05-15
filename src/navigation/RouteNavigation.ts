import * as React from 'react';

export const ROUTE_PAR_DEFAUT = 'ListeRendezVous';

export const navigationRef = React.createRef();

export function navigateTo(name, params?) {
    (<any>navigationRef.current)?.navigate(name);
}

/**
 * Redirige vers la page précédente ou l'accueil
 */
export function navigateToPrevious() {

    const current: any = navigationRef.current;
    const currentRoute = current.getCurrentRoute().name;
    if (currentRoute === 'Inscription') {
        current?.navigate(currentRoute);
    } 
    else {
        current?.navigate('ListeRendezVous');
    } 
}