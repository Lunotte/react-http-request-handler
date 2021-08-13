/*
 * File: Navigation.tsx
 * Project: react-http-request-handler
 * Created Date: Sunday, August 1st 2021, 8:45:24 pm
 * Author: Charly Beaugrand
 * 
 * Copyright (c) 2021 Lunotte
 */

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import axios, { AxiosRequestConfig } from 'axios';
import React, { useState } from 'react';
import { Button, Text, View } from 'react-native';
import { ResponseFetchApi, Rh2AxiosConfig, rh2AxiosConfigService } from '../src';
import { Rh2EffectSuccessNotRequiredHandler } from '../src/models/Rh2Effect';
import { useRh2WithParameters } from '../src/services/Rh2EffectsService';



const GOOGLE = 'GOOGLE';
const MICROSOFT = 'MICROSOFT';
const AMAZON = 'AMAZON';


const axiosConfig3: AxiosRequestConfig = {
    url: `https://www.google.com/`,
    method: 'GET' 
};
const configuration3: Rh2EffectSuccessNotRequiredHandler = {
    config: axiosConfig3,
    keyOfInstance: 'Test2' 
};


const CancelToken = axios.CancelToken;
let source;// = CancelToken.source();

const axiosConfigBis: AxiosRequestConfig = {
    url: 'https://www.google.com/',
    method: 'post' 
};
let configurationBis: Rh2EffectSuccessNotRequiredHandler = {
    config: axiosConfigBis 
};

//const dispatch = useDispatch();

const traitementErreur = (data: ResponseFetchApi) => {
    let message;

    switch (data.status) {
    case 405:
        message = 'C’est une erreur 405 !';
        console.log(message);
        //  dispatch(pourTestAction(message));
        break;
    case 404:
        message = 'C’est une erreur 404 !';
        console.log(message);
        // dispatch(pourTestAction(message));
        break;
    default:
        message = 'Facheux ce problème !';
        console.log(message);
        // dispatch(pourTestAction(message));
        break;
    }
}

// const initSettings: Rh2InitializationParameter = {
//     axiosConfig: [
//         {
//             key: 'Test1',
//             axiosConfig: { baseURL: 'https://www.test.com/' },
//             defaultInterceptor: false,
//             headerUrl: [
//                 { key: 'KeyToTest',
//                     value: 'value to test' }
//             ]
//         }
//     ],
//     modeDebug: true,
//     errorHandler: (data) => traitementErreur(data)
// };


const Moi = () => {

    // const dispatch = useDispatch();
    // const navigation = useNavigation();
    // rh2ConfigService.initializeParameters({
    //   axiosConfig: [{
    //     key: 'Test1', axiosConfig: { baseURL: 'https://www.sdfgoogle.com/' }, defaultInterceptor: false,
    //     headerUrl: [{ key: 'CleDeTest', value: 'value to test' }]
    //   },
    //   {
    //     key: 'Test2', axiosConfig: { baseURL: 'http://pompoarre.fr' },
    //     headerUrl: [{ key: 'YoJack', value: 'Ça farte ?' }]
    //   }],
    //   errorHandler: (param) => dispatch(pourTestAction('Test Par la conf générale')),
    //   modeDebug: true
    // });

    // Object.values(getAxiosInstances())[0].interceptors.request.use(
    //   async (config) => {
    //     console.log(config);
    //     const headers = await mapAllHeaders([{ key: 'PAMPERS', value: 'BABY DRY' }]);;
    //     console.log('headers', headers);
    //     if (headers) {
    //       if (config.method !== 'OPTIONS') {
    //         config = { ...config, headers };
    //       }
    //     }
    //     return config;
    //   },
    //   error => {
    //     return Promise.reject(error);
    //   });


    const axiosConfig: AxiosRequestConfig = {
        url: '/search?q=champ&sxsrf=ALeKk01edO6fnR6BHj7seeqbsHbnoh5SPQ%3A1627152933260&source=hp&ei=JWL8YJ7FDZKWaPG7t8gF&iflsig=AINFCbYAAAAAYPxwNZtvdEb2dgqGiMoAxLgYpStrexPb&oq=champ&gs_lcp=Cgdnd3Mtd2l6EAMyCgguELEDEEMQkwIyBwguELEDEEMyCAgAELEDEIMBMggIABCxAxCDATIICAAQsQMQgwEyAgguMgIILjIFCC4QsQMyCAguELEDEIMBMgUILhCxAzoHCCMQ6gIQJzoECCMQJzoECAAQQzoFCAAQsQM6DgguELEDEIMBEMcBEKMCOgIIADoECC4QQzoLCC4QsQMQxwEQowI6BggAEAoQQzoLCAAQsQMQgwEQyQM6BQgAEJIDOgcILhBDEJMCOgoILhCxAxCDARBDUIwSWN4XYNYZaAFwAHgAgAGgAYgBkASSAQM0LjGYAQCgAQGqAQdnd3Mtd2l6sAEK&sclient=gws-wiz&ved=0ahUKEwje69GEsfzxAhUSCxoKHfHdDVkQ4dUDCAg&uact=5',
        method: 'GET'
    };
    const configACharger: Rh2AxiosConfig = {
        keyOfInstance: 'Test1',
        axiosRequestConfig: axiosConfig,
        label: GOOGLE,
        addToDirectory: true,
        dataFromRoute: {
            params: [
                'itemId'
            ],
            typeQueryParameter: 'REQUEST_PARAM'
        }
    };

    const configACharger2: Rh2AxiosConfig = {
        axiosRequestConfig: axiosConfig,
        label: MICROSOFT,
        addToDirectory: true
    };


    // // const axiosConfig2: AxiosRequestConfig = { url: 'https://www.microsoft.com', method: 'GET' };
    // const axiosConfig2: AxiosRequestConfig = { url: 'https://jsonplaceholder.typicode.com/todos/1', method: 'GET' };
    // const configACharger2: Rh2AxiosConfig = {
    //   axiosRequestConfig: axiosConfig2, label: MICROSOFT, addToDirectory: false,
    //   successHandler: () => dispatch(pourTestAction('Voici ma première offre')),
    // };

    // const axiosConfigSansDispatch: AxiosRequestConfig = { url: 'https://www.amazon.com', method: 'GET' };
    // const configAChargerSansDispatch: Rh2AxiosConfig = { axiosRequestConfig: axiosConfigSansDispatch, label: AMAZON, justeReponse: true };

    // // const dispatch = useDispatch();

    rh2AxiosConfigService.addConfigAxios(configACharger);
    rh2AxiosConfigService.addConfigAxios(configACharger2);


    // rh2AxiosConfigService.addConfigAxios(configACharger2);


    // const erreurs = rh2Errors();
    // console.log(erreurs);

    // const erreursGoogle = rh2Error(MICROSOFT);
    // console.log(erreursGoogle);

    // const erreursMicrosoft = rh2Error(MICROSOFT);
    // console.log(erreursMicrosoft);

    // rh2AxiosConfigService.addConfigAxios(configACharger2);
    // rh2AxiosConfigService.addConfigAxios(configAChargerSansDispatch);
    // console.log(rh2AxiosConfigService.getAllConfigAxios());

    // console.log('ici');
    //useRequestFromParameter(pourTestAction, axiosConfig2, true, true);

    const test3 = useRh2WithParameters(configuration3, {
        params: {
            une: 'valeur',
            chatte: 'chienne'
        }
    });
    console.log(test3);
    
    // const test = useRh2WithName(GOOGLE, true);
    // console.log(test);


    // // rh2ConfigService.setErrorHandler(traitementErreur);

    // const test2 = useRh2WithName(GOOGLE, true);
    // console.log(test2);

    // const [TITI, setTITI] = useState(false);

    // setTimeout( () => {  const initSettings: Rh2InitializationParameter = {
    //     axiosConfig: [
    //         {
    //             key: 'Test1',
    //             axiosConfig: { baseURL: 'https://www.test.com/' },
    //             defaultInterceptor: false,
    //             headerUrl: [
    //                 { key: 'KeyToTest',
    //                     value: 'value to test' }
    //             ]
    //         }
    //     ],
    //     modeDebug: true,
    //     errorHandler: (data) => traitementErreur(data)
    // };
    //     rh2ConfigService.initializeParameters(initSettings);
    // }, 10000);

    
    // setTimeout( () => {

    //     setTITI(true);

    // }, 10000);
    
    // const test2 = useRh2WithName(MICROSOFT, TITI);
    // console.log(test2);
    // source.cancel('test cancellation');

    // const toto3 = useRequestPreloadedWithName(MICROSOFT, true, (resultat) => {
    //   console.log('JE SUIS EN TRAIN DESSAYER QUELQUES CHOSE ...');
    //   dispatch(pourTestAction(resultat));
    //   Alert.alert('Gros con', 'On les aime les cons :)')
    // });
    // console.log(toto3);

    // useRequestFromName(MICROSOFT, true);

    // const resultat = useRh2WithParameters({...configurationBis}, true, {toto: 'Il part en guerre'});
    // console.log(resultat);

    // const resultat2 = useRequestPreloadedWithName(MICROSOFT, true);
    // console.log(resultat2);

    const [
        state,
        setstate
    ] = useState<number>(0);

    const onMe = () => {
        
        if (source != null) {
            source.cancel('test cancellation');
        }
        setstate(state + 1);

        console.log('Onme');
        source = axios.CancelToken.source();
        configurationBis = {
            ...configurationBis,
            config: {
                ...configurationBis.config,
                params: state,
                cancelToken: source.token 
            } 
        };
        console.log('configuration dans navigation ', configurationBis);

    //navigation.navigate({name: 'Details', params: [{jack: '5'}]});
    // navigation.navigate('Details', {
    //   itemId: 86,
    //   otherParam: 'anything you want here',
    // });
    }

    return <View><Text>Moi</Text><Button title="Click me" onPress={() => onMe()} /></View>
}

const Moi2 = () => {

    const [
        state,
        setstate
    ] = useState<number>(0);

    //useRequest2('GOOGLE');
    //const axiosConfigSansDispatch: AxiosRequestConfig = { url: 'https://www.amazon.com', method: 'GET' };
    // const toto = useRequestNotPreloadedWithParameter(axiosConfigSansDispatch, true);
    // console.log(toto);

    // const toto2 = useRequestNotPreloadedWithParameter(axiosConfigSansDispatch, state === 2, true, (toto) => console.log('C\'est qui le meilleur', toto));
    // console.log(toto2);

    // const toto3 = useRequestPreloadedWithName(GOOGLE, state === 5);
    // console.log(toto3);
    // const toto = useRequestPreloadedWithName((state % 2) == 0 ? 'GOOGLE' : 'MICROSOFT');
    //console.log(toto.data);

    //useRequest2((state % 2) != 0 ? 'GOOGLE' : 'MICROSOFT');

    // useRh2WithNameTakeParamsInRoute(GOOGLE, true);
    // const conf: Rh2EffectTakeParamsInRoute = {
    //     ...configuration3,
    //     params: [
    //         'itemId'
    //     ],
    //     typeQueryParameter: 'REQUEST_PARAM' 
    // };
    // const resultat2 = useRh2WithParametersTakeParamsInRoute(conf, true);
    // console.log(resultat2)
    // useRequestFromName(MICROSOFT, state === 4);

    // const resultat3 = useRh2WithNameTakeParamsInRoute(GOOGLE, true);
    // console.log(resultat3)

    const onCall = () => {
        console.log('onCall');
        setstate(state + 1);
    // useRequest2('GOOGLE');
    }



    // const axiosConfig: AxiosRequestConfig = { url: 'https://www.google.com', method: 'GET' };
    // useRequestNotPreloadedWithParameter(['itemId', 'otherParam'], 'REQUEST_PARAM', pourTestAction, axiosConfig);

    // return <Text>Moi2</Text>
    return <View><Text>Moi2</Text><Text>{state}</Text><Button title="Call" onPress={() => onCall()} /></View>
}


const Stack = createStackNavigator();

function Navigation() {
    
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="Home" component={Moi} />
                <Stack.Screen name="Details" component={Moi2} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default Navigation;