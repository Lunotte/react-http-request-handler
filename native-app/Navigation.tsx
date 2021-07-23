import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { Alert, Button, StyleSheet, Text, View } from 'react-native';
import { pourTestAction } from '../src/redux/rh2-action';
import { AxiosRequestConfig } from 'axios';
import { default as rh2AxiosConfigService } from '../src/services/Rh2AxiosConfigService';
import { useState } from 'react';
import { Rh2AxiosConfig, rh2ConfigService } from '../src';
import { rh2Error, rh2Errors } from '../src/redux/rh2-selector';
import { useDispatch } from 'react-redux';
import { Rh2EffectAxiosConfigHandlerSuccessHandlerNotRequired } from '../src/models/Rh2Effect';
import { useRh2WithNameTakeParamsInRoute, useRh2WithParametersTakeParamsInRoute, useRh2WithParameters, useRh2WithName } from '../src/services/Rh2EffectsService';

const GOOGLE = 'GOOGLE';
const MICROSOFT = 'MICROSOFT';
const AMAZON = 'AMAZON';

const Moi = () => {

  const dispatch = useDispatch();
  const navigation = useNavigation();

  rh2ConfigService.initializeParameters({
    errorHandler: (param) => dispatch(pourTestAction('Test Par la conf générale')),
    modeDebug: true
  });

  const axiosConfig: AxiosRequestConfig = { url: 'https://www.google.com/', method: 'GET' };
  const configACharger: Rh2AxiosConfig = { axiosRequestConfig: axiosConfig, label: GOOGLE, addToDirectory: true, dataFromRoute: { params: ['itemId'], typeQueryParameter: 'REQUEST_PARAM' } }

  // const axiosConfig2: AxiosRequestConfig = { url: 'https://www.microsoft.com', method: 'GET' };
  const axiosConfig2: AxiosRequestConfig = { url: 'https://jsonplaceholder.typicode.com/todos/1', method: 'GET' };
  const configACharger2: Rh2AxiosConfig = {
    axiosRequestConfig: axiosConfig2, label: MICROSOFT, addToDirectory: false,
    successHandler: () => dispatch(pourTestAction('Voici ma première offre')),
  };

  const axiosConfigSansDispatch: AxiosRequestConfig = { url: 'https://www.amazon.com', method: 'GET' };
  const configAChargerSansDispatch: Rh2AxiosConfig = { axiosRequestConfig: axiosConfigSansDispatch, label: AMAZON, justeReponse: true };

  // const dispatch = useDispatch();

  rh2AxiosConfigService.addConfigAxios(configACharger);
  rh2AxiosConfigService.addConfigAxios(configACharger2);


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
  //  useRequestFromName(GOOGLE, true);

  // const toto3 = useRequestPreloadedWithName(MICROSOFT, true, (resultat) => {
  //   console.log('JE SUIS EN TRAIN DESSAYER QUELQUES CHOSE ...');
  //   dispatch(pourTestAction(resultat));
  //   Alert.alert('Gros con', 'On les aime les cons :)')
  // });
  // console.log(toto3);
  
  // useRequestFromName(MICROSOFT, true);

  const axiosConfig3: AxiosRequestConfig = { url: 'https://www.google.com/', method: 'GET' };
  const configuration: Rh2EffectAxiosConfigHandlerSuccessHandlerNotRequired = { config: axiosConfig3 };

  // const resultat = useRequestNotPreloadedWithParameter(configuration, true);
  // console.log(resultat);
  
  // const resultat2 = useRequestPreloadedWithName(MICROSOFT, true);
  // console.log(resultat2);

  const onMe = () => {
    console.log('Onme');
    //navigation.navigate({name: 'Details', params: [{jack: '5'}]});
    navigation.navigate('Details', {
      itemId: 86,
      otherParam: 'anything you want here',
    });
  }

  return <View><Text>Moi</Text><Button title="Click me" onPress={() => onMe()} /></View>
}

const Moi2 = ({ route, navigation }) => {

  const [state, setstate] = useState<number>(0);

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
  // useRh2WithParametersTakeParamsInRoute(['itemId'], 'REQUEST_PARAM', pourTestAction, { url: 'https://www.google.com', method: 'GET' });

  // useRequestFromName(MICROSOFT, state === 4);

  const resultat3 = useRh2WithNameTakeParamsInRoute(GOOGLE, true);
  console.log(resultat3)

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