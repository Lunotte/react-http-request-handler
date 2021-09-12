# React Http Request Handler (RH2)

[![Coverage Status](https://coveralls.io/repos/github/Lunotte/react-http-request-handler/badge.svg?branch=master)](https://coveralls.io/github/Lunotte/react-http-request-handler?branch=master)
[![Renovate](https://img.shields.io/badge/renovate-enabled-brightgreen.svg)](https://renovatebot.com)
[![Build Status](https://travis-ci.com/Lunotte/react-http-request-handler.svg?branch=master)](https://travis-ci.com/Lunotte/react-http-request-handler)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://GitHub.com/Naereen/StrapDown.js/graphs/commit-activity)
[![GitHub license](https://img.shields.io/github/license/Naereen/StrapDown.js.svg)](https://github.com/Naereen/StrapDown.js/blob/master/LICENSE)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![React Native](https://img.shields.io/badge/react_native-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)

## Contexte

Cette librairie React utilisant les hooks customisés a pour but de faciliter l'utilisateur dans sa manipulation des requêtes HTTP. Il doit simplement configurer la requête qui sera exécutée par Axios, ainsi que le moment du déclenchement.Il est possible d’ajouter des paramètres supplémentaires pour des besoins de l’application cliente. Par exemple, demander qu’une requête soit exécutée seulement une fois via notre système d’historisation; la configuration des traitements à effectuer en cas d’erreurs de requête. Les utilisateurs de redux pourront trouver leur bonheur pour dispatch le résultat de la requête revenue avec succès ou non, celle-ci pourra également être précédée d’un traitement ou non.

## Fonctionnalités
- Tout ce que Axios peut faire
- Ajouter une configuration globale (gestion des instances, manipulation des erreurs HTTP, filtrage des requêtes pour une unique exécution, etc ...)
- Possibilité d’être couplé avec Redux
- Moins de code



## Installation

Utilisant npm :

```powershell
$ npm install react-http-request-handler
```

Utilisant yarn :

```powershell
$ yarn add react-http-request-handler
```

## Toutes les configurations



### Initialisation de la librairie



#### L'application peut être initialisée de 2 manières :

Soit, vous utilisez un wrapper dans lequel vous passez en paramètre la configuration initiale : 

```jsx
import { Rh2Initializer, Rh2InitializationParameter } from 'react-http-request-handler';

const initSettings: Rh2InitializationParameter = {
  debugMode: true
};
 
<Rh2Initializer rh2Settings={initSettings}>
  <App />
</Rh2Initializer>
```

Soit, vous la passez plus tard par le biais d’un service :

```jsx
import { Rh2InitializationParameter, rh2ConfigService } from 'react-http-request-handler';

const initSettings: Rh2InitializationParameter = {
  debugMode: true
};
rh2ConfigService.initializeParameters(initSettings);
```

Soit, vous ne passez rien, dans ce cas une instance par défaut sera utilisée. 

Si pour une quelconque raison, durant l'utilisation de votre application, vous décidez d'injecter une nouvelle configuration des instances, les anciennes qui possédaient des interceptors seront éjectées.

### Utilisation des deux hooks

#### Hooks sans préchargement

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



Le résultat du log sera :

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



##### Autre exemple : 

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

Dans l'initialisation du paramétrage, nous avons demandé à créer 2 instances Axios

<b>keyOfInstance: 'Test2'</b> nous permet de dire d'exécuter la requête avec l'instance nommée <b>Test2</b>. Si aucune avez été mentionnée (Par défaut c'est la première renseignée dans l'initialisation) ou bien appelé <b>Test1</b>, nous n'aurions pas eu le résultat escompté.

Pour cet exemple, le paramètre <b>successHandler</b> a été utilisé pour dispatch une action redux. Dans cette action, on demande à obtenir l'ensemble du résultat de la requête <b>onlyResult: false</b>

Ci-dessous, l’action qui a été réalisée :

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



##### Exemple de gestion d'erreur

Imaginons, pour une raison quelconque, vous n'avez pas voulu initialiser le paramètre <b>errorHandler</b> avec le wrapper <b>Rh2Initializer</b>. Vous pouvez valoriser de la façon suivante :

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

Pour faire le test, j'ai pris l'exemple précédent et j'ai demandé d'exécuté la requête avec la première instance <b>Test1</b>

Google ne s'attends pas à recevoir un requête de cette forme : <b>https://www.google.com/todos/1</b>. On obtient une erreur 404.

L'action obtenu :

```typescript
{
  type: 'POUR_TEST_ACTION',
  payload: 'C’est une erreur 404 !'
}
```

Vous pouvez faire ce que vous voulez. On peut également demander à dispatch une action  avec le contenu des données présente en paramètre de la méthode traitementErreur.



#### Hook préchargé

Ci-dessous, le code a été empilé. Dans les faits, vous pouvez avoir un fichier de configuration dans lequel vous ajouter les configurations.

Ensuite, dans votre composant, vous avez juste à appeler le hook <b>useRh2WithName</b>

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



### Hook avec paramètre

Le second paramètre des hooks <b>useRh2WithName</b> et <b>useRh2WithParameters</b> vous sera certainement utile pour compléter la configuration de votre requête. Les paramètres vont être utiles dans le cas où vous seriez en attente de les obtenir. 

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

Le résultat obtenu sera : 

https://www.google.com/search/to/test?hat=red&hair=grey

Avec en body les clés/valeurs renseignés dans la propriété data.

Selon votre cas d'utilisation ou tout simplement de votre préférence, vous pouvez également utiliser le service <b>rh2AxiosConfigService</b> pour injecter le body.

```jsx
rh2AxiosConfigService.addBodyToConfigAxios(GOOGLE, {
    color: 'yellow',
    shape: 'square'
});
```



### Instances Axios

Vous pouvez utiliser les instances Axios qui ont été générées. Le service <b>rh2ConfigService</b> vous permet de les récupérer.

| Attention : Pour l'initialisation de l'instance, il faut impérativement avoir indiqué la propriété <i>"defaultInterceptor"</i> à <i>"false"</i> |
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

Dans le scénario ci-dessus, On va utiliser l'instance que l'on avait demandé de nommer <b>TEST2</b>. Puis, on crée un intercepteur. Dans ce cas présent, on peut imaginer que l'on désir ajouter un token dans l'en-tête des requêtes.

Si vous avez besoin de configurer une url avec l'authentification de type BASIC, vous pouvez suivre l’exemple suivant :

```jsx
rh2AxiosConfigService.addAuthToConfigAxios(GOOGLE, {
	username: 'toto',
	password: 'I1€5t3nGerr€'
});
```



### Liste des services

#### Rh2ConfigService

Initialise l’application :

- Paramètre les instances Axios (si rien n’est fourni, une instance par défaut sera générée)
- Configuration du mode débug
- Ajouter une gestion générale des erreurs de requête (les erreurs peuvent être gérées par le type d’erreur retourné, le code d’erreur de la requête) 

| Méthode                                                      | type                         | Description                                                  |
| ------------------------------------------------------------ | ---------------------------- | ------------------------------------------------------------ |
| initializeParameters(parameters: Rh2InitializationParameter) | void                         | Initialise un nouveau paramétrage                            |
| setErrorHandler(treatment: (param?: any) => void)            | void                         | Ajoute un traitement à faire en cas d'erreur. Si valorisé, ce traitement est utilisé pour toutes les requêtes en échec sauf si override dans le paramétrage de la requête envoyée. |
| getParameters()                                              | Rh2InitializationParameter   | Les paramètres du service                                    |
| getParametersAxiosConfigs()                                  | AxiosRequestConfigExtended[] | Le paramètrage envoyé par le consommateur                    |
| isdebugMode()                                                | boolean                      | Si le debugMode est activé                                   |
| getAxiosInstances()                                          | Rh2AxiosInstance             | Récupère les instances Axios                                 |
| getAxiosInstance(key: string)                                | AxiosInstance                | Récupère l'instance Axios demandée en paramètre              |

#### Rh2AxiosConfigService

Initialise l’application :

- Gestion des configurations préchargées

| Méthode                                                      | type             | Description                                                  |
| ------------------------------------------------------------ | ---------------- | ------------------------------------------------------------ |
| getAllConfigAxios()                                          | Rh2AxiosConfig[] | Récupérer toutes les configurations                          |
| getConfigAxios(label: string)                                | Rh2AxiosConfig   | Récupérer la configuration                                   |
| hasConfigAxios(label: string)                                | boolean          | On vérifie si cette configuration a déjà été ajoutée         |
| addConfigAxios(configAxios: Rh2AxiosConfig)                  | void             | Ajouter une nouvelle configuration                           |
| addAuthToConfigAxios(label: string, auth: { username: string, password: string }) | void             | Ajouter des information d’authentification à une configuration existante |
| addBodyToConfigAxios<T>(label: string, body: T)              | void             | Ajouter un body à une configuration existante                |
| replaceConfig(label: string, configAxios: Rh2AxiosConfig)    | void             | Remplace une configuration			                 |
| removeConfigAxios(label: string)                             | void             | Supprimer une configuration existante                        |
| removeAllConfigAxios()                                       | void             | Supprimer toutes les configuration existante                 |

### Liste des models Rh2

#### Paramètre pour pour les requêtes non pré-chargée

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

<b>keyOfInstance</b> Si la valeur n'est pas renseignée, on prend la première instance générée. Si seulement une a été précisée à l'initialisation du paramétrage ou que rien n'a été fourni, le champ peut être ignoré.  

<b>axiosRequestConfig</b> Configuration Axios. 

<b>addToDirectory</b> S'utilise si l'on veut exécuter une seule fois la requête durant l'utilisation de l'application. Si true, la valeur pourra être mise à jour avec le service <b>QueryStorageService</b> pour être réinitialisée. 

| Attention : La condition pour filtrer les requêtes s'appuie sur l'url, le type de méthode et la propriété params. |
| ------------------------------------------------------------ |

<b>onlyResult</b> Si au retour de la requête on veut le contenu de data ou bien l'ensemble du paramétrage. Par défaut vaut true .

<b>successHandler</b> Ce champ est obligatoire pour obtenir un résultat si vous n'écoutez pas le retour du hook. Exemple: Utiliser Redux pour dispatch une action.

<b>errorHandler</b> Si défini, override la propriété de <b>Rh2ConfigService</b> et il sera utilisé en priorité. Si aucun n'est défini, en mode debug, vous aurez un message vous avertissant. Ceci peut être un cas normal, sauf si vous n'écoutez pas le retour du hook, dans ce cas il faudra valoriser un <b>errorHandler</b>.



##### Rh2EffectData

````typescript
export interface Rh2EffectData {
    readonly data?: any;
    readonly params?: any;
    readonly pathParams?: any;
}
````

<b>data</b> Body d'une requête.

<b>params</b> Query params d'une requête.

<b>pathParams</b> Path params d'une requête.

Si <b>params</b> et <b>pathParams</b> sont défini, pathParams est construit en premier.



#### AxiosConfig

Paramétrage pour les requêtes.

``````typescript
export interface Rh2AxiosConfig extends Rh2EffectAxiosConfigHandler {
    readonly label: ConfigAxiosTrigger;
}
``````

<b>label</b> Label pour retrouver une configuration pré-chargée. 



#### FetchApi

Gestion des retours de requête.

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



#### Configuration générale

Les types suivants sont utilisés avec le service <b>Rh2ConfigService</b> 

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
| axiosConfig  | AxiosRequestConfigExtended[] | Les requêtes qui seront exécutées pendant l’utilisation de l’application peuvent être préconfigurées. L’utilisation d’une clé sera nécessaire pour retrouver la configuration ajoutée | []                | Exemple 1        |
| debugMode    | boolean                      | Log des informations complémentaires à l’utilisateur. Ceci peut aider à comprendre de mauvais comportement | false             | `true, false`    |
| errorHandler | function                     | Méthode générale qui va être utilisée en cas d’échec de la requête | n/a               | Exemple 2        |



#### AxiosRequestConfigExtended

| Nom                | Type                                | Description                                                  | Valeur par défaut                                  | Valeur d’exemple                                     |
| ------------------ | ----------------------------------- | ------------------------------------------------------------ | -------------------------------------------------- | ---------------------------------------------------- |
| key                | string                              | Clé pour retrouver l'instance Axios. Elle sera utilisée pour configurer les requêtes, vous devez indiquer à quelle instance elle devra se référer. Si aucune n’est renseignée, on utilise la première ajoutée | n/a                                                | `"MY_DEFAULT_KEY"`                                   |
| axiosConfig        | AxiosRequestConfig                  | Configuration [Axios](https://github.com/axios/axios). Si vous ne connaissez pas cette librairie, par exemple, vous pouvez valoriser la propriété baseURL pour indiquer le préfixe de chaque url qui utilisera cette instance | n/a                                                | `{ baseURL: 'http://test.fr' }`                      |
| defaultInterceptor | boolean                             | Si null ou true, alors un intercepteur va être créée pour cette instance. La propriété `headerUrl` devra également être valorisée. Vous pouvez créer votre propre interceptor en récupérant l'instance via un service mis à disposition.<br/><b>Si pour cette instance un interceptor par défaut a été crée et que vous implémentez le vôtre, il ne va pas fonctionner</b> | true                                               | `true, false`                                        |
| headerUrl          | {key: string;<br/>value: string;}[] | Liste des en-têtes à utiliser par l'interceptor              | [{key: 'Content-Type', value: 'application/json'}] | `[{key: 'Content-Type', value: 'application/json'}]` |



<u>Exemple 1</u> :

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



<u>Exemple 2</u> :

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

- Modifier une instance Axios pour prendre en compte de nouveaux éléments (Ex : Mise à jour du paramètre «auth» de Axios)
- Gérer l'annulation des requêtes HTTP par le biais de la librairie si nécessaire
