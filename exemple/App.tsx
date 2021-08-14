/*
 * File: App.ts                                                                *
 * Project: react-http-request-handler                                         *
 * Created Date: 07 26 2021                                                    *
 * Author: Charly Beaugrand                                                    *
 * -----                                                                       *
 * Last Modified: 2021 08 14 - 01:28 pm
 * Modified By: Charly Beaugrand
 * -----                                                                       *
 * Copyright (c) 2021 Lunotte                                                  *
 * ----------	---	---------------------------------------------------------  *
 */




import React from 'react';
import {
    StyleSheet,
    useColorScheme
} from 'react-native';
import { Rh2InitializationParameter } from '../src';
import Rh2Initializer from '../src/Rh2Initializer';
import Navigation from './Navigation';

const App = () => {
    const isDarkMode = useColorScheme() === 'dark';

    // const backgroundStyle = {
    //     backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    // };

    // const initSettings: Rh2InitializationParameter = { modeDebug: false };
    const initSettings: Rh2InitializationParameter = {
        axiosConfig: [
            {
                key: 'Test1',
                axiosConfig: { baseURL: 'https://www.google.com/', method: 'POST' },
                defaultInterceptor: true,
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

    // return (
    //     <Navigation />
    // );

    return (
        // <Provider store={Store}>
        <Rh2Initializer rh2Settings={initSettings} >
            <Navigation />
        </Rh2Initializer>
        // </Provider>
    );
};

const styles = StyleSheet.create({
    sectionContainer: {
        marginTop: 32,
        paddingHorizontal: 24
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: '600'
    },
    sectionDescription: {
        marginTop: 8,
        fontSize: 18,
        fontWeight: '400'
    },
    highlight: {
        fontWeight: '700'
    }
});

export default App;
