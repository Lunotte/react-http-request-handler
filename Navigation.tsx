import React, { useCallback } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { Button, StyleSheet, Text, View } from 'react-native';
import { useFetchAvecOuSansParametre, useRequest2, useRequestWithoutDispatch, useRequestWithoutDispatch2 } from './src/effects';
import { chargerConfigAction, pourTestAction } from './src/redux/hook-action';
import { AxiosRequestConfig } from 'axios';
import { ConfigAxios, ConfigAxiosEtat } from './src';
import { useDispatch, useSelector } from 'react-redux';
import { default as queryStorageService } from './src/services/QueryStorageService';
import { useState } from 'react';
import { useEffect } from 'react';

const Moi = () => {

  const axiosConfig: AxiosRequestConfig = { url: 'https://www.google.com', method: 'GET' };
  const configAxiosEtat: ConfigAxiosEtat = { axiosRequestConfig: axiosConfig, label: 'GOOGLE', addToDirectory: true }
  const configACharger: ConfigAxios = { configAxiosEtat, actionToDispatch: pourTestAction };

  const axiosConfig2: AxiosRequestConfig = { url: 'https://www.microsoft.com', method: 'GET' };
  const configAxiosEtat2: ConfigAxiosEtat = { axiosRequestConfig: axiosConfig2, label: 'MICROSOFT', addToDirectory: false }
  const configACharger2: ConfigAxios = { configAxiosEtat: configAxiosEtat2, actionToDispatch: pourTestAction };
  
  const axiosConfigSansDispatch: AxiosRequestConfig = { url: 'https://www.amazon.com', method: 'GET' };
  const configAxiosEtatSansDispatch: ConfigAxiosEtat = { axiosRequestConfig: axiosConfigSansDispatch, label: 'AMAZON' }
  const configAChargerSansDispatch: ConfigAxios = { configAxiosEtat: configAxiosEtatSansDispatch, justeReponse: true };
  
  console.log('ici');
  
  // const dispatch = useDispatch();
  // dispatch(chargerConfigAction([configACharger]));

  queryStorageService.addConfigAxios(configACharger);
  queryStorageService.addConfigAxios(configACharger2);
  queryStorageService.addConfigAxios(configAChargerSansDispatch);
  console.log(queryStorageService.getAllConfigAxios());
  

  const navigation = useNavigation();

  const onMe = () => {
    console.log('Onme');
    navigation.navigate({name: 'Details', params: [{jack: '5'}]});
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
  // const axiosConfigSansDispatch: AxiosRequestConfig = { url: 'https://www.amazon.com', method: 'GET' };
  // const toto = useRequestWithoutDispatch(axiosConfigSansDispatch, true);

  const toto = useRequestWithoutDispatch2((state % 2) == 0 ? 'GOOGLE' : 'MICROSOFT');
  //console.log(toto.data);

  //useRequest2((state % 2) != 0 ? 'GOOGLE' : 'MICROSOFT');
  
  const onCall = () => {
    console.log('onCall');
    setstate(state + 1);

   // useRequest2('GOOGLE');
  }



  // const axiosConfig: AxiosRequestConfig = { url: 'https://www.google.com', method: 'GET' };
  // useFetchAvecOuSansParametre(['itemId', 'otherParam'], 'REQUEST_PARAM', pourTestAction, axiosConfig);
  
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