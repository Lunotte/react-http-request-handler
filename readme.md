# React Http Request Handler (RH2)

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=Lunotte_react-http-request-handler&metric=alert_status)](https://sonarcloud.io/dashboard?id=Lunotte_react-http-request-handler)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=Lunotte_react-http-request-handler&metric=coverage)](https://sonarcloud.io/dashboard?id=Lunotte_react-http-request-handler)
[![Renovate](https://img.shields.io/badge/renovate-enabled-brightgreen.svg)](https://renovatebot.com)
[![Build Status](https://travis-ci.com/Lunotte/react-http-request-handler.svg?branch=master)](https://travis-ci.com/Lunotte/react-http-request-handler)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://GitHub.com/Naereen/StrapDown.js/graphs/commit-activity)
[![GitHub license](https://img.shields.io/github/license/Naereen/StrapDown.js.svg)](https://github.com/Naereen/StrapDown.js/blob/master/LICENSE)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![React Native](https://img.shields.io/badge/react_native-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)

[French documentation](https://github.com/Lunotte/react-http-request-handler/blob/Documentation/docs/readme-fr.md)

## Contexte

This React library using customized hooks is aimed to help users handling HTTP requests. The request and its trigger are simply configured, then executed by Axios. Optional parameters can also be configured depending on the web client needs.
For example :
- Configuring the request to be executed once through our historization module
- Configuring methods to be called in case of error
Redux users will find means to dispatch the request’s result, whether it was successfully handled or not. The response can be processed before being dispatched.


## Functionalities
- Everything Axios can already do
- Adding a global configuration (instance management, HTTP error handling, request filtering, .. etc)
- Coupling with redux
- Allowing less code production



## Installation

Utilisant npm :

```powershell
$ npm install react-http-request-handler
```

Utilisant yarn :

```powershell
$ yarn add react-http-request-handler
```

## Configurations



### Library usage



#### You can initialize your application by :

Using a wrapper wherein the initial configuration is parametrized : 

```jsx
import { Rh2Initializer, Rh2InitializationParameter } from 'react-http-request-handler';

const initSettings: Rh2InitializationParameter = {
  debugMode: true
};
 
<Rh2Initializer rh2Settings={initSettings}>
  <App />
</Rh2Initializer>
```

Or by using a service later on :

```jsx
import { Rh2InitializationParameter, rh2ConfigService } from 'react-http-request-handler';

const initSettings: Rh2InitializationParameter = {
  debugMode: true
};
rh2ConfigService.initializeParameters(initSettings);
```

Finally, if you do not initialize the app, a default instance is used.

If a new instance configuration is injected during runtime, the old one and its injectors are deactivated.

### Using two hooks

#### Hooks without preloading

```typescript
const axiosConfig: AxiosRequestConfig = {
    url: `https://jsonplaceholder.typicode.com/todos/1`,
    method: 'GET' 
};
const configuration: Rh2EffectAxiosConfigHandler = {
    axiosRequestConfig: axiosConfig
};

const test = useRh2WithParameters(configuration);
console.log(test);
```



Log result will be :

```typescript
{
    loading: false,
    data: {
        userId: 1,
        id: 1,
        title: "delectus aut autem",
        completed: false
    }
}
```



##### Other example : 

```jsx
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
                defaultInterceptor: false,
                headerUrl: []
            }
        ],
        debugMode: true
    };

    return (
    <Provider store={Store}>
        <Rh2Initializer rh2Settings={initSettings} >
            <Navigation />
        </Rh2Initializer>
        </Provider>
    );
};
```

```jsx
const dispatch = useDispatch();

const axiosConfig: AxiosRequestConfig = {
    url: `/todos/1`,
    method: 'GET'
};

const configuration: Rh2EffectAxiosConfigHandler = {
    axiosRequestConfig: axiosConfig,
    onlyResult: false,
    keyOfInstance: 'Test2',
    successHandler: (value) => dispatch(pourTestAction(value))
};

useRh2WithParameters(configuration);
```

In configuration initialization, 2 Axios instances were created

<b>keyOfInstance: 'Test2'</b> process the request from instance named <b>Test2</b>. If <b>Test1</b> or nothing is specified, the result will be different. By default, the first instance specified during initialization is used .

For this example, the parameter <b>successHandler</b> is used to dispatch a redux action, which get the response from the request <b>onlyResult: false</b>.

Following is the action processed :

```typescript
{
  type: 'POUR_TEST_ACTION',
  payload: {
    data: {
      userId: 1,
      id: 1,
      title: 'delectus aut autem',
      completed: false
    },
    status: 200,
    statusText: '',
    headers: {
      ...
    },
    config: {
      url: '/todos/1',
      method: 'get',
      headers: {},
      baseURL: 'https://jsonplaceholder.typicode.com',
      ...
    },
    request: {}
  }
}
```



##### Handling error example

If the <b>errorHandler</b> parameter from <b>Rh2Initializer</b> wrapper is ignored during initialization, you can still define an handler later on, like the following :

```jsx
 const traitementErreur = (data: ResponseFetchApi) => {
     let message;

     switch (data.status) {
         case 405:
             message = 'C’est une erreur 405 !';
             dispatch(pourTestAction(message));
             break;
         case 404:
             message = 'C’est une erreur 404 !';
             dispatch(pourTestAction(message));
             break;
         default:
             message = 'Facheux ce problème !';
             dispatch(pourTestAction(message));
             break;
     }
 };

rh2ConfigService.setErrorHandler(traitementErreur);
```

This test was done using our previous example, while executing the request with instance <b>Test1</b>.

Google is not expecting requests like <b>https://www.google.com/todos/1</b> : a 404 error is raised.

Action processed :

```typescript
{
  type: 'POUR_TEST_ACTION',
  payload: 'C’est une erreur 404 !'
}
```

You can do anything you want to do. We can also dispatch an action with the data contained within the arguments of traitementErreur method.

#### Preloaded Hook

In the next example the code is compiled, but you can write a configuration file where all configurations are defined.

Then you can call the hook <b>useRh2WithName</b> in your component :

```jsx
const axiosConfig: AxiosRequestConfig = {
	url: '/search?q=champ',
	method: 'GET'
};
const configACharger: Rh2AxiosConfig = {
	keyOfInstance: 'Test1',
	axiosRequestConfig: axiosConfig,
	label: GOOGLE
};

rh2AxiosConfigService.addConfigAxios(configACharger);

const test = useRh2WithName(GOOGLE);
console.log(test);
```



### Hook with parameters

Second argument of hooks <b>useRh2WithName</b> and <b>useRh2WithParameters</b> is used to specify what to expect from the request.

```jsx
useRh2WithName(GOOGLE, {
        pathParams: '/to/test',
        params: {
            hat: 'red',
            hair: 'grey'
        },
        data: {
            color: 'yellow',
            shape: 'square'
        }
    });
```

Response will be :

https://www.google.com/search/to/test?hat=red&hair=grey

With key/value pairs in data property in the response body.

Depending on your use case, you can also use <b>rh2AxiosConfigService</b> service to do the body injection.

```jsx
rh2AxiosConfigService.addBodyToConfigAxios(GOOGLE, {
    color: 'yellow',
    shape: 'square'
});
```



### Axios instance

You can use Axios generated instances, by getting it from service rh2ConfigService.

| Caution : : To initialize your instance, you have to fill in the property <i>"defaultInterceptor"</i> à <i>"false"</i> |
| ------------------------------------------------------------ |

```jsx
const axiosInstance: AxiosInstance = rh2ConfigService.getAxiosInstance('TEST2');
axiosInstance.interceptors.request.use(
    async (config) => {
        const headerImpl = await getHeader();

        if (headerImpl) {
            if (config.method !== 'OPTIONS') {
                config.headers = headerImpl;
            }
        }
        return config;
    },
    ...
);
```

In the previous use case, we get <b>TEST2</b> instance, then create an interceptor. This use case could be implemented for example to add a token in the request header.

If you need to configure the URL with BASIC authentication, you can follow the next example :


```jsx
rh2AxiosConfigService.addAuthToConfigAxios(GOOGLE, {
	username: 'toto',
	password: 'I1€5t3nGerr€'
});
```



### Services

#### Rh2ConfigService

Initialize the app :
- Configures Axios instances (if no configuration is provided, a default instance is generated)
- Configures debug mode
- Adds a handler for request errors, which can be handled by error type and error code of the request


| Method                                                       | Type                         | Description                                                  |
| ------------------------------------------------------------ | ---------------------------- | ------------------------------------------------------------ |
| initializeParameters(parameters: Rh2InitializationParameter) | void                         | Initialize a new configuration                               |
| setErrorHandler(treatment: (param?: any) => void)            | void                         | Set an error handler, which is used for all failed requests, unless it is overriden in the request parameters |
| getParameters()                                              | Rh2InitializationParameter   | Return service parameters                                    |
| getParametersAxiosConfigs()                                  | AxiosRequestConfigExtended[] | Return configuration sent by the consumer                    |
| isdebugMode()                                                | boolean                      | Return true if debug mode is activated                                   |
| getAxiosInstances()                                          | Rh2AxiosInstance             | Return all Axios instancei                                   |
| getAxiosInstance(key: string)                                | AxiosInstance                | Return the Axios instance specified in parameter             |

#### Rh2AxiosConfigService

Initialize the app :

- Handle preloaded configuration

| Méthode                                                      | type             | Description                                                  |
| ------------------------------------------------------------ | ---------------- | ------------------------------------------------------------ |
| getAllConfigAxios()                                          | Rh2AxiosConfig[] | Return all Axios configurations                              |
| getConfigAxios(label: string)                                | Rh2AxiosConfig   | Return the Axios configuration specified in parameter                                |
| hasConfigAxios(label: string)                                | boolean          | Return true if the configuration in parameter was added      |
| addConfigAxios(configAxios: Rh2AxiosConfig)                  | void             | Add a new configuration in parameter                         |
| addAuthToConfigAxios(label: string, auth: { username: string, password: string }) | void             | Add authentication information to an existing configuration in parameter |
| addBodyToConfigAxios<T>(label: string, body: T)              | void             | Add body information to an existing configuration in parameter               |
| replaceConfig(label: string, configAxios: Rh2AxiosConfig)    | void             | Replace the instance in 1st argument by the one in 2nd       |
| removeConfigAxios(label: string)                             | void             | Delete an existing configuration, specified in parameter     |
| removeAllConfigAxios()                                       | void             | Delete all existing configurations                           |

### Rh2 model list

#### Parameters for non-preloaded requests

##### Rh2EffectAxiosConfigHandler

````typescript
export interface Rh2EffectAxiosConfigHandler {
    readonly keyOfInstance?: string;
    readonly axiosRequestConfig: AxiosRequestConfig;
    readonly onlyResult?: boolean;
    readonly errorHandler?: OptionalParamVoidMethod
    readonly successHandler?: OptionalParamVoidMethod,
}
````

<b>keyOfInstance</b> keyOfInstance if the value is not provided, first generated instance is used. If only one instance was provided during configuration initialization, or if none, this field can be ignored.  

<b>axiosRequestConfig</b> Axios configuration. 

<b>addToDirectory</b> This is used if we want to execute once the request during runtime. This value can be updated with <b>QueryStorageService</b>.

| Caution : The request filter depends on URL, method type and params property. |
| ------------------------------------------------------------ |

<b>onlyResult</b> This allows to choose if the request response provides only the content of data (true), or all the configuration (false). Default is true.

<b>successHandler</b> This field is mandatory to get a response if there is no listener for the hook return. Example : using redux to dispatch an action.

<b>errorHandler</b>If provided, overrides Rh2ConfigService property. During debug mode, if none is provided, a message will be displayed. It can be a nominal case, unless there is no listener for the hook : in this case, you have to define an <b>errorHandler</b>.



##### Rh2EffectData

````typescript
export interface Rh2EffectData {
    readonly data?: any;
    readonly params?: any;
    readonly pathParams?: any;
}
````

<b>data</b> Request body.

<b>params</b> Request query parameter.

<b>pathParams</b> Request path parameters.

NB : If <b>params</b> and <b>pathParams</b> are provided, pathParams is built first.


#### AxiosConfig

Request configuration.

``````typescript
export interface Rh2AxiosConfig extends Rh2EffectAxiosConfigHandler {
    readonly label: ConfigAxiosTrigger;
}
``````

<b>label</b> Used to find a preloaded configuration. 



#### FetchApi

Management of request returns.

##### ResponseFetchApi

```typescript
export interface ResponseFetchApi {
    readonly isSuccess: boolean;
    readonly isError: boolean;
    readonly responseSuccess: AxiosResponse;
    readonly responseErreur: ErreurFetchApi;
    readonly status: number;
}
```



##### ErreurFetchApi

```typescript
export interface ErreurFetchApi {
    readonly isResponseError: boolean;
    readonly isRequestError: boolean;
    readonly responseError: AxiosError;
    readonly requestError: any;
    readonly messageError: string;
    readonly config: AxiosRequestConfig;
}
```



#### General configuration

Following types are used with <b>Rh2ConfigService</b>

##### Rh2InitializationParameter

````typescript
export interface Rh2InitializationParameter {
    axiosConfig?: AxiosRequestConfigExtended[];
    errorHandler?: (param?: any) => void;
    debugMode?: boolean
}
````

##### AxiosRequestConfigExtended

````typescript
export interface AxiosRequestConfigExtended {
    key: string;
    axiosConfig: AxiosRequestConfig;
    defaultInterceptor?: boolean;
    headerUrl?: KeyValue[];
}
````



#### Rh2InitializationParameter

| Nom          | Type                         | Description                                                  | Valeur par défaut | Valeur d’exemple |
| ------------ | ---------------------------- | ------------------------------------------------------------ | ----------------- | ---------------- |
| axiosConfig  | AxiosRequestConfigExtended[] | Requests executed during runtime can be preconfigured. Using a label will be needed to find the added configuration | []                | Example 1        |
| debugMode    | boolean                      | Activates the debug mode : more information will be logged | false             | `true, false`    |
| errorHandler | function                     | Provides a method to be used during request fail | n/a               | Example 2        |



#### AxiosRequestConfigExtended

| Nom                | Type                                | Description                                                  | Valeur par défaut                                  | Valeur d’exemple                                     |
| ------------------ | ----------------------------------- | ------------------------------------------------------------ | -------------------------------------------------- | ---------------------------------------------------- |
| key                | string                              | Value to find Axios instance and to configure requests, You have to provide the instance targeted. If none is provided, the system will use the first on added | n/a                                                | `"MY_DEFAULT_KEY"`                                   |
| axiosConfig        | AxiosRequestConfig                  | [Axios](https://github.com/axios/axios) configuration. If you do not know this library, you can for example set the baseURL property to point out the prefix of each URL using this instance. | n/a                                                | `{ baseURL: 'http://test.fr' }`                      |
| defaultInterceptor | boolean                             | If null or true, then an interceptor will be automatically created for this instance. The headerUrl property must beprovided. You can create your own interceptor by retrieving the instance from the built-in service. <br><b>If for a specific instance a default interceptor was created, you cannot use yours.</b> | true                                               | `true, false`                                        |
| headerUrl          | {key: string;<br/>value: string;}[] | Header list to be used by the interceptor              | [{key: 'Content-Type', value: 'application/json'}] | `[{key: 'Content-Type', value: 'application/json'}]` |



<u>Example 1</u> :

```typescript
{
  key: 'Test1',
  axiosConfig: { 
      baseURL: 'https://www.test.com/',
      method: 'GET' 
  },
  defaultInterceptor: true,
  headerUrl: [{
      key: 'key',
      value: 'value to test'
  }]
}
```



<u>Example 2</u> :

```typescript
const traitementErreur = (data: ResponseFetchApi) => {
    let message;

    switch (data.status) {
      case 405:
        message = 'C’est une erreur 405 !';
        console.log(message);
        dispatch(pourTestAction(message));
        break;
      case 404:
        message = 'C’est une erreur 404 !';
        console.log(message);
        dispatch(pourTestAction(message));
        break;
      default:
        message = 'Facheux ce problème !';
        console.log(message);
        dispatch(pourTestAction(message));
        break;
    }
}

const initSettings: Rh2InitializationParameter = {
    debugMode: true,
    errorHandler: (data) => traitementErreur(data)
};
```



## Roadmap

- Modifying an Axios instance to handle new éléments (ex : update « auth » parameter from Axios)
- Handling HTTP request cancellation with the library
