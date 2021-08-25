/*
 * File: FetchApiService.spec.ts                                               *
 * Project: react-http-request-handler                                         *
 * Created Date: 2021 08 25 - 12:38 pm                                         *
 * Author: Charly Beaugrand                                                    *
 * -----                                                                       *
 * Last Modified: 2021 08 25 - 12:38 pm                                        *
 * Modified By: Charly Beaugrand                                               *
 * -----                                                                       *
 * Copyright (c) 2021 Lunotte                                                  *
 * ----------	---	---------------------------------------------------------    *
 */



import axios from 'axios';
import { AxiosRequestConfig, ResponseFetchApi, rh2ConfigService } from '../../src';
import { fetchApi } from '../../src/services/FetchApiService';

jest.mock('axios');

const axiosRequestConfig: AxiosRequestConfig = { baseURL: 'http://google.fr' };
let mockTestValue = 'Test Value';

const mockDefaultInstance = { 'default': { axiosInstance: null, interceptor: null } };
let mockDefaultInstanceAxios = axios.create();

jest.mock('../../src/tools/Utils', () => {
  return {
    isDebugModeThenDisplayInfo: () => jest.fn(),
    isDebugModeThenDisplayWarn: () => jest.fn()
  }
})
jest.mock('../../src/services/Rh2ConfigService');

describe('Configuration', () => {


  beforeEach(() => {
    jest.mock('axios', () => {
      return {
        request: () => jest.fn()
      };
    });

    const requestSpy = jest.spyOn(rh2ConfigService, 'getAxiosInstances');
    const mockRequest = () => requestSpy.mockReturnValue(mockDefaultInstance);
    mockRequest();

    const requestSpy2 = jest.spyOn(rh2ConfigService, 'getAxiosInstance');
    const mockRequest2 = () => requestSpy2.mockReturnValue(mockDefaultInstanceAxios);
    mockRequest2();

  })

  describe('200', () => {

    it('instance is not null', async () => {

      const promise = Promise.resolve({ status: 200, data: mockTestValue });
      const requestSpy3 = jest.spyOn(mockDefaultInstanceAxios, 'request');
      const mockRequest3 = () => requestSpy3.mockReturnValue(promise);
      mockRequest3();

      const expected = {
        isSuccess: true,
        isError: false,
        responseSuccess: mockTestValue,
        responseErreur: null,
        status: 200
      }

      const resultat: ResponseFetchApi = await fetchApi('default', axiosRequestConfig, true);
      expect(resultat).toEqual(expected);
    });

    it('with param immediate', async () => {

      const promise = Promise.resolve({ status: 200, data: mockTestValue });
      const requestSpy3 = jest.spyOn(mockDefaultInstanceAxios, 'request');
      const mockRequest3 = () => requestSpy3.mockReturnValue(promise);
      mockRequest3();

      const expected = {
        isSuccess: true,
        isError: false,
        responseSuccess: mockTestValue,
        responseErreur: null,
        status: 200
      }

      const resultat: ResponseFetchApi = await fetchApi(null, axiosRequestConfig, true);
      expect(resultat).toEqual(expected);
    });

    it('with param immediate', async () => {

      const promise = Promise.resolve({ status: 200, data: mockTestValue });
      const requestSpy3 = jest.spyOn(mockDefaultInstanceAxios, 'request');
      const mockRequest3 = () => requestSpy3.mockReturnValue(promise);
      mockRequest3();

      const expected = {
        isSuccess: true,
        isError: false,
        responseSuccess: { data: mockTestValue },
        responseErreur: null,
        status: 200
      }

      const resultat: ResponseFetchApi = await fetchApi(null, axiosRequestConfig, false);
      expect(resultat.isSuccess).toBeTruthy();
      expect(resultat.responseSuccess.data).toEqual(mockTestValue);

    });

  });

  describe('Error', () => {

    it('unknown', async () => {

      const promise = Promise.reject({ status: 400 });
      const requestSpy3 = jest.spyOn(mockDefaultInstanceAxios, 'request');
      const mockRequest3 = () => requestSpy3.mockReturnValue(promise);
      mockRequest3();

      const expected = {
        isSuccess: false,
        isError: true,
        responseSuccess: null,
        responseErreur: {
          isResponseError: false,
          isRequestError: false,
          responseError: null,
          requestError: null,
          messageError: undefined,
          config: undefined
        },
        status: null
      }

      const resultat: ResponseFetchApi = await fetchApi(null, axiosRequestConfig, true);
      expect(resultat).toEqual(expected);
    });

    it('request', async () => {

      const mockRequest = { request: 'rejected request', message: 'test message error', config: axiosRequestConfig };
      const promise = Promise.reject(mockRequest);
      const requestSpy3 = jest.spyOn(mockDefaultInstanceAxios, 'request');
      const mockRequest3 = () => requestSpy3.mockReturnValue(promise);
      mockRequest3();

      const expected = {
        isSuccess: false,
        isError: true,
        responseSuccess: null,
        responseErreur: {
          isResponseError: false,
          isRequestError: true,
          responseError: null,
          requestError: mockRequest.request,
          messageError: mockRequest.message,
          config: mockRequest.config
        },
        status: null
      }

      const resultat: ResponseFetchApi = await fetchApi(null, axiosRequestConfig, true);
      expect(resultat).toEqual(expected);
    });

    it('request', async () => {

      const mockRequest = { response: { status: 401, message: 'Not authenticated' }, message: 'test message error', config: axiosRequestConfig };
      const promise = Promise.reject(mockRequest);
      const requestSpy3 = jest.spyOn(mockDefaultInstanceAxios, 'request');
      const mockRequest3 = () => requestSpy3.mockReturnValue(promise);
      mockRequest3();

      const expected = {
        isSuccess: false,
        isError: true,
        responseSuccess: null,
        responseErreur: {
          isResponseError: true,
          isRequestError: false,
          responseError: mockRequest.response,
          requestError: null,
          messageError: mockRequest.message,
          config: mockRequest.config
        },
        status: mockRequest.response.status
      }
      const resultat: ResponseFetchApi = await fetchApi(null, axiosRequestConfig, true);
      expect(resultat).toEqual(expected);
    });

  });
});

