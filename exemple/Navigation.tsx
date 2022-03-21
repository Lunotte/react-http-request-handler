/*
 * File: Navigation.ts                                                         *
 * Project: react-http-request-handler                                         *
 * Created Date: 07 26 2021                                                    *
 * Author: Charly Beaugrand                                                    *
 * -----                                                                       *
 * Last Modified: 2022 03 20 - 07:38 pm
 * Modified By: Charly Beaugrand
 * -----                                                                       *
 * Copyright (c) 2021 Lunotte                                                  *
 * ----------	---	---------------------------------------------------------  *
 */





import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import axios, { AxiosRequestConfig } from 'axios';
import React, { useState } from 'react';
import { Button, Text, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { ResponseFetchApi, Rh2AxiosConfig, rh2AxiosConfigService } from '../src';
import { Rh2EffectAxiosConfigHandler } from '../src/models/Rh2Effect';
import { useRh2WithName } from '../src/services/Rh2EffectsService';
import { pourTestAction } from './redux/rh2-action';



const GOOGLE = 'GOOGLE';
const MICROSOFT = 'MICROSOFT';
const AMAZON = 'AMAZON';

const CancelToken = axios.CancelToken;
let source;// = CancelToken.source();

const axiosConfigBis: AxiosRequestConfig = {
    url: 'https://www.google.com/',
    method: 'post' 
};
let configurationBis: Rh2EffectAxiosConfigHandler = {
    axiosRequestConfig: axiosConfigBis 
};

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
//     debugMode: true,
//     errorHandler: (data) => traitementErreur(data)
// };


const Moi = () => {

    
const dispatch = useDispatch();

// const axiosConfig: AxiosRequestConfig = {
//     url: `/todos/1`,
//     method: 'GET'
// };

// const configuration: Rh2EffectAxiosConfigHandler = {
//     axiosRequestConfig: axiosConfig,
//     onlyResult: false,
//     keyOfInstance: 'Test1',
//     successHandler: (value) => dispatch(pourTestAction(value))
// };

    
const traitementErreur = (data: ResponseFetchApi) => {
    let message;

    switch (data.status) {
        case 405:
            message = 'C’est une erreur 405 !';
            dispatch(pourTestAction(message));
            break;
        case 404:
            message = 'C’est une erreur 404 !';
            dispatch(pourTestAction(message));
            break;
        default:
            message = 'Facheux ce problème !';
            dispatch(pourTestAction(message));
            break;
    }
};
    
    // const dispatch = useDispatch();
    // const navigation = useNavigation();
    // rh2ConfigService.initializeParameters(initSettings);

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
        url: '/search?q=champ',
        method: 'GET'
    };
    const configACharger: Rh2AxiosConfig = {
        keyOfInstance: 'Test2',
        axiosRequestConfig: axiosConfig,
        label: GOOGLE,
        addToDirectory: false
    };

    // const configACharger2: Rh2AxiosConfig = {
    //     axiosRequestConfig: axiosConfig,
    //     label: MICROSOFT,
    //     addToDirectory: true
    // };


    // // const axiosConfig2: AxiosRequestConfig = { url: 'https://www.microsoft.com', method: 'GET' };
    // const axiosConfig2: AxiosRequestConfig = { url: 'https://jsonplaceholder.typicode.com/todos/1', method: 'GET' };
    // const configACharger2: Rh2AxiosConfig = {
    //   axiosRequestConfig: axiosConfig2, label: MICROSOFT, addToDirectory: false,
    //   successHandler: () => dispatch(pourTestAction('Voici ma première offre')),
    // };

    // const axiosConfigSansDispatch: AxiosRequestConfig = { url: 'https://www.amazon.com', method: 'GET' };
    // const configAChargerSansDispatch: Rh2AxiosConfig = { axiosRequestConfig: axiosConfigSansDispatch, label: AMAZON, onlyResult: true };

    // // const dispatch = useDispatch();

    rh2AxiosConfigService.addConfigAxios(configACharger);
    // rh2AxiosConfigService.addConfigAxios(configACharger2);


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

  //  useRh2WithParameters(configuration);
   // console.log(test);
    
    rh2AxiosConfigService.addAuthToConfigAxios(GOOGLE, {
        username: 'toto',
        password: 'I1€5t3nGerr€'
    });
    
    // const test = useRh2WithName(GOOGLE);
    // console.log(test);

    // console.log(rh2DirectoryService.getConfigQueryParameters());

    // rh2DirectoryService.removeAllQueriesDirectory();
    // console.log(rh2DirectoryService.getConfigQueryParameters());
    


   // rh2ConfigService.setErrorHandler(traitementErreur);

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
    //     debugMode: true,
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

    const test = useRh2WithName(GOOGLE, state % 2 === 0);
    console.log(test);

    const onMe = () => {
        
        // if (source != null) {
        //     source.cancel('test cancellation');
        // }
        setstate(state + 1);

        console.log('Onme');

         
        // source = axios.CancelToken.source();
        // configurationBis = {
        //     ...configurationBis,
        //     axiosRequestConfig: {
        //         ...configurationBis.axiosRequestConfig,
        //         params: state,
        //         cancelToken: source.token 
        //     } 
        // };
        // console.log('configuration dans navigation ', configurationBis);

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
    //     ]
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