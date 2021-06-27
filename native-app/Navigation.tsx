import React, { useCallback } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { Button, StyleSheet, Text, View } from 'react-native';
import { useFetchWithParamInRouteFromParameter, useRequestFromParameter, useRequestFromName, useRequestWithoutDispatchFromParameter, useRequestWithoutDispatchFromName, useFetchWithParamInRouteFromName } from '../src/effects';
import { pourTestAction } from '../src/redux/hook-action';
import { AxiosRequestConfig } from 'axios';
import { ConfigAxios, ConfigAxiosEtat } from '../src';
import { default as queryAxiosService } from '../src/services/QueryAxiosService';
import { useState } from 'react';

const GOOGLE = 'GOOGLE';
const MICROSOFT = 'MICROSOFT';
const AMAZON = 'AMAZON';

const Moi = () => {

  const axiosConfig: AxiosRequestConfig = { url: 'https://www.google.com', method: 'GET' };
  const configAxiosEtat: ConfigAxiosEtat = { axiosRequestConfig: axiosConfig, label: GOOGLE, addToDirectory: true }
  const configACharger: ConfigAxios = { configAxiosEtat, actionToDispatch: pourTestAction, dataFromRoute: {params: ['itemId'], typeQueryParameter: 'REQUEST_PARAM'} };

  const axiosConfig2: AxiosRequestConfig = { url: 'https://www.microsoft.com', method: 'GET' };
  const configAxiosEtat2: ConfigAxiosEtat = { axiosRequestConfig: axiosConfig2, label: MICROSOFT, addToDirectory: false }
  const configACharger2: ConfigAxios = { configAxiosEtat: configAxiosEtat2, actionToDispatch: pourTestAction };
  
  const axiosConfigSansDispatch: AxiosRequestConfig = { url: 'https://www.amazon.com', method: 'GET' };
  const configAxiosEtatSansDispatch: ConfigAxiosEtat = { axiosRequestConfig: axiosConfigSansDispatch, label: AMAZON }
  const configAChargerSansDispatch: ConfigAxios = { configAxiosEtat: configAxiosEtatSansDispatch, justeReponse: true };
  
  // const dispatch = useDispatch();
  // dispatch(chargerConfigAction([configACharger]));

  queryAxiosService.addConfigAxios(configACharger);
  queryAxiosService.addConfigAxios(configACharger2);

  // queryAxiosService.addConfigAxios(configACharger2);
  // queryAxiosService.addConfigAxios(configAChargerSansDispatch);
  // console.log(queryAxiosService.getAllConfigAxios());

  // console.log('ici');
  // useRequestFromParameter(pourTestAction, axiosConfig2, true, true);
  useRequestFromName(GOOGLE, true);
  useRequestFromName(MICROSOFT, true);

  const navigation = useNavigation();

  const onMe = () => {
    console.log('Onme');
    //navigation.navigate({name: 'Details', params: [{jack: '5'}]});
    navigation.navigate('Details', {
      itemId: 86,
      otherParam: 'anything you want here',
    });
  }

  return <View><Text>Moi</Text><Button title="Click me" onPress={() => onMe()}/></View>
}

const Moi2 = ({ route, navigation }) => {

  const [state, setstate] = useState<number>(0);

  //useRequest2('GOOGLE');
  //const axiosConfigSansDispatch: AxiosRequestConfig = { url: 'https://www.amazon.com', method: 'GET' };
  // const toto = useRequestWithoutDispatchFromParameter(axiosConfigSansDispatch, true);
  // console.log(toto);

  // const toto2 = useRequestWithoutDispatchFromParameter(axiosConfigSansDispatch, state === 2, true, (toto) => console.log('C\'est qui le meilleur', toto));
  // console.log(toto2);

  // const toto3 = useRequestWithoutDispatchFromName(GOOGLE, state === 5);
  // console.log(toto3);
  // const toto = useRequestWithoutDispatchFromName((state % 2) == 0 ? 'GOOGLE' : 'MICROSOFT');
  //console.log(toto.data);

  //useRequest2((state % 2) != 0 ? 'GOOGLE' : 'MICROSOFT');

  // useFetchWithParamInRouteFromName(GOOGLE, true);
  // useFetchWithParamInRouteFromParameter(['itemId'], 'REQUEST_PARAM', pourTestAction, { url: 'https://www.google.com', method: 'GET' });


  const onCall = () => {
    console.log('onCall');
    setstate(state + 1);

   // useRequest2('GOOGLE');
  }



  // const axiosConfig: AxiosRequestConfig = { url: 'https://www.google.com', method: 'GET' };
  // useRequestWithoutDispatchFromParameter(['itemId', 'otherParam'], 'REQUEST_PARAM', pourTestAction, axiosConfig);
  
 // return <Text>Moi2</Text>
  return <View><Text>Moi2</Text><Text>{state}</Text><Button title="Call" onPress={() => onCall()}/></View>
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