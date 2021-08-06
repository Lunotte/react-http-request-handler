
import { AxiosRequestConfig } from 'axios';
import { AxiosRequestConfigExtended } from '../../src/models/Rh2Config';
import { getAxiosInstances, initAxiosInstance } from '../../src/services/Rh2AxiosInstanceService';

// const defaultInstance = { ['default']: axios.create() };

const KEY_DEFAULT = 'default';



describe('Init Axios instance', () => {

    it('List Axios request is null', () => {
        initAxiosInstance(null);
        expect(Object.keys(getAxiosInstances())).toEqual([KEY_DEFAULT]);
    });

    it('List Axios request is empty', () => {
        initAxiosInstance([]);
        expect(Object.keys(getAxiosInstances())).toEqual([KEY_DEFAULT]);
    });

    it('List Axios request axios request not defined', () => {
        
        const key = 'TEST_VALUE';
        const axiosRequestConfigExtended: any = {key};
       
        initAxiosInstance([axiosRequestConfigExtended]);
        expect(Object.keys(getAxiosInstances())).toEqual([KEY_DEFAULT]);
    });

    it('List Axios request axios request not defined', () => {
        
        const axiosRequestConfig: AxiosRequestConfig = {baseURL: 'http://test.fr'};
        const axiosRequestConfigExtended: any = {axiosConfig: axiosRequestConfig};
       
        initAxiosInstance([axiosRequestConfigExtended]);
        expect(Object.keys(getAxiosInstances())).toEqual([KEY_DEFAULT]);
    });

    it('List Axios request with key and request', () => {
        
        const key = 'TEST_VALUE';
        const axiosRequestConfig: AxiosRequestConfig = {baseURL: 'http://test.fr'};
        const axiosRequestConfigExtended: AxiosRequestConfigExtended = {key, axiosConfig: axiosRequestConfig};
       
        initAxiosInstance([axiosRequestConfigExtended]);
        expect(Object.keys(getAxiosInstances())).toEqual([key]);
    });

    it('List Axios request with key and request', () => {
        
        const key = 'TEST_VALUE';
        const axiosRequestConfig: AxiosRequestConfig = {baseURL: 'http://test.fr'};
        const axiosRequestConfigExtended: AxiosRequestConfigExtended = {key, axiosConfig: axiosRequestConfig, defaultInterceptor: false};
       
        initAxiosInstance([axiosRequestConfigExtended]);
        expect(Object.keys(getAxiosInstances())).toEqual([key]);

        console.log(getAxiosInstances());
    });

    it('List Axios request with key and request - 2 elements', () => {
        
        const key = 'TEST_VALUE';
        const axiosRequestConfig: AxiosRequestConfig = {baseURL: 'http://test.fr'};
        const axiosRequestConfigExtended: AxiosRequestConfigExtended = { key, axiosConfig: axiosRequestConfig };
        
        const key2 = 'TEST_VALUE_2';
        const axiosRequestConfig2: AxiosRequestConfig = {baseURL: 'http://test2.fr'};
        const axiosRequestConfigExtended2: AxiosRequestConfigExtended = {key: key2, axiosConfig: axiosRequestConfig2};
       
        initAxiosInstance([axiosRequestConfigExtended, axiosRequestConfigExtended2]);
        expect(Object.keys(getAxiosInstances())).toEqual([key, key2]);
        const axiosInstance1 = Object.values(getAxiosInstances())[0];
        const axiosInstance2 = Object.values(getAxiosInstances())[1];
        expect(axiosInstance1.defaults.baseURL).toEqual(axiosRequestConfig.baseURL);
        expect(axiosInstance2.defaults.baseURL).toEqual(axiosRequestConfig2.baseURL);
               
       console.log(getAxiosInstances());
    });


    // describe('Init Axios instance', () => {
    
    //     jest.mock('axios', () => {
    //         return {
    //             create: jest.fn(),
    //             interceptors: {
    //                 request: {
    //                     use: jest.fn(),
    //                     eject: jest.fn(),
    //                 },
    //                 response: {
    //                     use: jest.fn(),
    //                     eject: jest.fn(),
    //                 },
    //             }
    //         };
    //     });

    // jest.mock('axios', () => {
    //     return {
    //         interceptors: {
    //             request: { use: jest.fn(), eject: jest.fn() },
    //             response: { use: jest.fn(), eject: jest.fn() },
    //         },
    //     };
    // });

    //     describe('Init Axios instance', () => {

    //     //     beforeEach(() => {
    //     //         (axios.create as jest.Mock).mockReset();
    //     //         (axios.interceptors.request.use as jest.Mock).mockReset();
    //     //         (axios.interceptors.request.eject as jest.Mock).mockReset();
    //     //         (axios.interceptors.response.use as jest.Mock).mockReset();
    //     //         (axios.interceptors.response.eject as jest.Mock).mockReset();
    //     //     });

    //         it('List Axios request with key and request', () => {
                
                                
    //             const key = 'TEST_VALUE';
    //             const axiosRequestConfig: AxiosRequestConfig = {baseURL: 'http://test.fr'};
    //             const axiosRequestConfigExtended: AxiosRequestConfigExtended = {key, axiosConfig: axiosRequestConfig, defaultInterceptor: true};
            
    //             initAxiosInstance([axiosRequestConfigExtended]);
    //             const axiosInstance1 = Object.values(getAxiosInstances())[0];

    //             expect(axios.interceptors.request).toHaveBeenCalled();


    //         //  expect(axiosInstance1.interceptors.request.use()).toBeCalled();
                
    //             console.log(getAxiosInstances());
                
    //             // initAxiosInstance([axiosRequestConfigExtended]);
    //             // expect(Object.keys(getAxiosInstances())).toEqual([key]);
    //         });
    //     });
    // });
});
