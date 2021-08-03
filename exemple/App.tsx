/*
 * Filename: c:\Users\Lunotte\Dev\React Native\react-http-request-handler\exemple\App.tsx
 * Path: c:\Users\Lunotte\Dev\React Native\react-http-request-handler
 * Created Date: Sunday, August 1st 2021, 8:45:24 pm
 * Author: Charly Beaugrand
 * 
 * Copyright (c) 2021 Lunotte
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
import Navigation from './Navigation';

const App = () => {
    const isDarkMode = useColorScheme() === 'dark';

    const backgroundStyle = {
        backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    };

    // const initSettings: Rh2InitializationParameter = { modeDebug: false };
    const initSettings: Rh2InitializationParameter = {
        axiosConfig: [
            {
                key: 'Test1',
                axiosConfig: { baseURL: 'https://www.google.com/' },
                defaultInterceptor: false,
                headerUrl: [
                    { key: 'CleDeTest',
                        value: 'value to test' }
                ]
            },
            {
                key: 'Test2',
                axiosConfig: { baseURL: 'http://pompoarre.fr' },
                headerUrl: []
            }
        ],
        modeDebug: true
    };

    return (
        <Navigation />
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
