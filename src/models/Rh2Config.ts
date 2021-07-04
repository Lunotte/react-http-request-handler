export interface SettingsInitializerRnhrh {
    baseUrl?: string; // Si la valeur est null alors on considère que les urls possèdent le chemin complet
    headerUrl?: KeyValue[]; // Par défaut : [{key: 'Content-Type', value: 'application/json'}]
    reduxIsActif?: boolean; // Si l'application qui implémente la lib utilise redux
    useAsyncStorage?: boolean; // Si l'application qui implémente la lib utilise @react-native-async-storage/async-storage
                              // et quelle veut l'utiliser nécessaire dans les cas des authentifications de type Bearer
    errorHandler?: (param?: any) => void;
    modeDebug?: boolean
}

export interface KeyValue {
    key: string;
    value: string;
}
