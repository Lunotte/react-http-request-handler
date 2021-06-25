import { AxiosRequestConfig } from 'axios';
import React from 'react'
import { Button, StyleSheet, Text, View } from 'react-native';
import { useRequest } from '../src/effects';
import { pourTestAction } from '../src/redux/hook-action';

const Third = () => {


    const axiosConfig: AxiosRequestConfig = { url: 'https://www.google.com', method: 'GET' };
    useRequest(pourTestAction, axiosConfig);

    return (
       <>
            <Text>Third page</Text>
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

export default Third;
