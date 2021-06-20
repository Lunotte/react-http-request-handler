import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { Button, StyleSheet, Text, View } from 'react-native';
import { useFetchAvecOuSansParametre } from './src/effects';
import { pourTestAction } from './src/redux/hook-action';
import { AxiosRequestConfig } from 'axios';

const Moi = () => {

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

  console.log(route);
  console.log(navigation);


  const axiosConfig: AxiosRequestConfig = { url: 'https://www.google.com/', method: 'GET' };
  useFetchAvecOuSansParametre(['itemId', 'otherParam'], pourTestAction, axiosConfig);
  
  return <Text>Moi2</Text>
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