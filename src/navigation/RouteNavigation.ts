import { useNavigation } from '@react-navigation/native';
import * as React from 'react';

export const ROUTE_PAR_DEFAUT = 'ListeRendezVous';
export const navigationRef = React.createRef<any>();

export function navigateTo(name, params?) {
    navigationRef.current?.navigate(name);
}

/**
 * Redirige vers la page précédente ou l'accueil
 */
export function navigateToPrevious() {

    const currentRoute = navigationRef.current.getCurrentRoute().name;
    if (currentRoute === 'Inscription') {
        navigationRef.current?.navigate(currentRoute);
    } 
    else {
        navigationRef.current?.navigate('ListeRendezVous');
    } 
}