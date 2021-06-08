import { AxiosRequestConfig } from 'axios';
import React from 'react'
import { Button, StyleSheet, Text, View } from 'react-native';
import { useRequest } from './src/effects';

const Child = () => {


    // const apiUserYou = {
    //     method: 'GET',
    //     url: 'https://jsonplaceholder.typicode.com/todos/1'
    // };

    // const AXIOS_CONFIG_AUTHENTICATION = 'AXIOS_CONFIG_AUTHENTICATION';
    // const axiosConfigAuthentication = { configAxiosEtat: { axiosRequestConfig: apiUserYou, label: AXIOS_CONFIG_AUTHENTICATION, actif: false } };



    // useToLoadConfig([axiosConfigAuthentication]);
    // const reponse = useRequestWithoutDispatch2(AXIOS_CONFIG_AUTHENTICATION, false, (data) => console.log('me voici', data));
    // console.log(reponse);
    const axiosConfig: AxiosRequestConfig = { url: 'https://www.google.com/', method: 'GET' };
    useRequest(() => console.log('je suis le meilleur'), axiosConfig);

    return (
       <>
            <Text>Call me Jack</Text>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default Child;
