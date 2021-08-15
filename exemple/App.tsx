/*
 * File: App.ts                                                                *
 * Project: react-http-request-handler                                         *
 * Created Date: 07 26 2021                                                    *
 * Author: Charly Beaugrand                                                    *
 * -----                                                                       *
 * Last Modified: 2021 08 15 - 09:27 pm
 * Modified By: Charly Beaugrand
 * -----                                                                       *
 * Copyright (c) 2021 Lunotte                                                  *
 * ----------	---	---------------------------------------------------------  *
 */




import React from 'react';
import { Provider } from 'react-redux';
import { Rh2InitializationParameter } from '../src';
import Rh2Initializer from '../src/Rh2Initializer';
import Navigation from './Navigation';
import Store from './redux/rh2-store';

const App = () => {

    const initSettings: Rh2InitializationParameter = {
        axiosConfig: [
            {
                key: 'Test1',
                axiosConfig: { baseURL: 'https://www.google.com/', method: 'POST' },
                defaultInterceptor: true,
                headerUrl: [
                    {
                        key: 'CleDeTest',
                        value: 'value to test'
                    }
                ]
            },
            {
                key: 'Test2',
                axiosConfig: { baseURL: 'https://jsonplaceholder.typicode.com' },
                headerUrl: []
            }
        ],
        modeDebug: true
    };

    return (
    <Provider store={Store}>
        <Rh2Initializer rh2Settings={initSettings} >
            <Navigation />
        </Rh2Initializer>
        </Provider>
    );
};

export default App;
