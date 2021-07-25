/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  StyleSheet,
  useColorScheme
} from 'react-native';
import {
  Colors
} from 'react-native/Libraries/NewAppScreen';
import { Rh2InitializationParameter } from '../src';
import InitializerRnhrh from './InitializerRnhrh';
import Navigation from './Navigation';


const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  // const initSettings: Rh2InitializationParameter = { modeDebug: false };
  const initSettings: Rh2InitializationParameter = {
    axiosConfig: [{
      key: 'Test1', axiosConfig: { baseURL: 'https://www.google.com/' }, defaultInterceptor: false,
      headerUrl: [{ key: 'CleDeTest', value: 'value to test' }]
    },
    {
      key: 'Test2', axiosConfig: { baseURL: 'http://pompoarre.fr' },
      headerUrl: [{ key: 'YoJack', value: 'Ça farte ?' }]
    }],
    modeDebug: true
  };

  return (
    <InitializerRnhrh rh2Settings={initSettings}>
      <Navigation />
    </InitializerRnhrh>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
