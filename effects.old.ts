// import React from 'react';
// import * as Actions from '../src/redux/hook-action';
// import { ConfigQueryParameter, MethodRnhrh } from '../src/models/QueryDirectory';
// import { AxiosRequestConfig } from "axios";
// import * as effects from "../src/effects";
// import queryDirectoryService from '../src/services/QueryDirectoryService';
// import * as ApiServiceFetch from '../src/services/ApiServiceFetch';
// import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';
// import * as redux from 'react-redux';

// // Erreur :
// // ReferenceError: You are trying to `import` a file after the Jest environment has been torn down.
// //
// // Résolue par :
// // https://github.com/facebook/jest/issues/6434

// //jest.useFakeTimers();

// describe('Remove Configuration', () => {
  
//   jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);
  
//   let useEffectSpy;
//   let fetchApiSpy;
//   let useDispatchSpy;

//   const mockUseEffect = () => {
//     useEffectSpy.mockImplementationOnce(f => f());
//   };

//   const mockFetchApi = () => {
//     return fetchApiSpy.mockReturnValue({ status: 200, data: 'Un ensemble de données' });
//   };


//   // const mockDispatchFn = jest.fn();

//   // const mockDispatch = () => {
//   //   useDispatchSpy.mockReturnValue(mockDispatchFn);
//   // };

//   it('Supprime les éléments configurés', async () => {
//     //expect.assertions(5);

//     const axiosConfig: AxiosRequestConfig = { url: 'https://www.google.com', method: 'GET' };

//     useEffectSpy = jest.spyOn(React, 'useEffect');

//     const mockDispatchFn = jest.fn();
//     useDispatchSpy = jest.spyOn(redux, 'useDispatch');//useDispatchSpy.mockResolvedValue
//     useDispatchSpy.mockReturnValue(mockDispatchFn);
//     //const dispatchActionPourTestAction = jest.spyOn(Actions, 'pourTestAction');//useDispatchSpy.mockResolvedValue
//     // mockDispatch();
//     // mockDispatch();
//     // mockDispatch();
//     mockUseEffect();

//     fetchApiSpy = jest.spyOn(ApiServiceFetch, 'fetchApi');
//     mockFetchApi();

//     const mockQueryDirectoryService = jest.spyOn(queryDirectoryService, 'hasConfigQueryParameterByConfigQueryParameter');
//     //mockQueryDirectoryService.mock.instances
//     mockQueryDirectoryService.mockReturnValue(false);

//     effects.useRequest(Actions.pourTestAction, axiosConfig);

//     expect(fetchApiSpy).toHaveBeenCalledTimes(1);
//     expect(fetchApiSpy).toHaveBeenCalledWith(axiosConfig);
//     // expect(useDispatchSpy).toHaveBeenCalledTimes(1);
//     // expect(mockDispatchFn).toHaveBeenCalledWith(chargementStartedAction());
//     expect(useDispatchSpy.mock.calls.length).toBe(1);

//     expect(useDispatchSpy).toHaveBeenCalled();

//   //  expect(mockDispatchFn).toHaveBeenLastCalledWith(chargementFinishedAction());
//    // expect(useDispatchSpy).toHaveBeenNthCalledWith(2, pourTestAction('Un ensemble de données'));

//     //teardown
//     //useDispatchSpy.mockClear();

//     expect(mockQueryDirectoryService).toHaveBeenCalled();
//     expect(mockQueryDirectoryService).toReturnWith(false);

//     // expect(queryDirectoryService.getConfigQueryParameters()).toHaveLength(0);
//   });

//   // it('Supprime un élément sans paramètre', () => {

//   //     const config: ConfigQueryParameter = { url: 'uneUrl', method: 'GET'};
//   //     const axiosConfig: AxiosRequestConfig = { url: config.url, method: config.method };

//   //     queryDirectoryService.addConfigQueryParameter(config);

//   //     expect(queryDirectoryService.hasConfigQueryParameter(config.url, config.method)).toBe(true);
//   //     queryDirectoryService.removeQueryDirectory(axiosConfig);
//   //     expect(queryDirectoryService.getConfigQueryParameters()).toHaveLength(0);
//   // });

//   // afterAll(() => queryDirectoryService.removeAllQueryDirectory());
// });
