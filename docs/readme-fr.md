# React Http Request Handler (RH2)

[![Coverage Status](https://coveralls.io/repos/bitbucket/Lunotte/reactnativehttprequesthandler/badge.svg?branch=master)](https://coveralls.io/bitbucket/Lunotte/reactnativehttprequesthandler?branch=master)

## Contexte

Cette librairie React utilisant les hooks customisés a pour but de faciliter l'utilisateur dans sa manipulation des requêtes http. Il doit simplement configurer la requête qui sera exécutée par Axios, ainsi que le moment du déclenchement.Il est possible d’ajouter des paramêtres supplémentaires pour des besoins de l’application cliente. Par exemple, demander qu’une requête soit exécutée seulement une fois via notre système d’historisation; la configuration des traitements à effectuer en cas d’erreurs de requête. Les utilisateurs de rédux pourront trouver leur bonheur pour dispatch le résultat de la requête revenue avec succès ou non, celle-ci pourra également être précédée d’un traitement ou non.

## Fonctionnalités
- Tout ce que Axios peut faire
- Ajouter une config global (gestion des instances, manipulation des erreurs http, filtrage des requête pour une unique execution, etc ...)
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



## Initialisation de la librairie



### L'application peut être initialisée de 2 manières :

Soit vous utiliser un wrapper dans lequel vous passez en paramètre la configuration initiale : 

```jsx
import { Rh2Initializer, Rh2InitializationParameter } from 'react-http-request-handler';

const initSettings: Rh2InitializationParameter = {
  modeDebug: true
};
 
<Rh2Initializer rh2Settings={initSettings}>
  <App />
</Rh2Initializer>
```

Soit vous la passez plus tard via un service :

```jsx
import { Rh2InitializationParameter, rh2ConfigService } from 'react-http-request-handler';

const initSettings: Rh2InitializationParameter = {
  modeDebug: true
};
rh2ConfigService.initializeParameters(initSettings);
```

Soit vous ne passez rien, dans ce cas une instance par défaut sera utilisée. 

Si pour une quelconque raison, durant l'utilisation de votre application, vous décidez d'injecter une nouvelle configuration des instances, les anciennes qui possédaient des intercepteurs seront éjectées.



### Rh2ConfigService



| Méthode                                                      | type                         | Description                                                  |
| ------------------------------------------------------------ | ---------------------------- | ------------------------------------------------------------ |
| initializeParameters(parameters: Rh2InitializationParameter) | void                         | Initialise un nouveau paramétrage                            |
| setErrorHandler(treatment: (param?: any) => void)            | void                         | Ajoute un traitement à faire en cas d'erreur. Si valorisé, ce traitement est utilisé pour toutes les requêtes en échec sauf si override dans le paramétrage de la requête envoyée. |
| getParameters()                                              | Rh2InitializationParameter   | Les paramètres du service                                    |
| getParametersAxiosConfigs()                                  | AxiosRequestConfigExtended[] | Le paramètrage envoyé par le consommateur                    |
| isModeDebug()                                                | boolean                      | Si le modeDebug est activé                                   |
| getAxiosInstances()                                          | Rh2AxiosInstance             | Récupère les instances Axios                                 |
| getAxiosInstance(key: string)                                | AxiosInstance                | Récupère l'instance Axios demandée en paramètre              |



### Liste des models Rh2

#### Paramètre pour pour les requêtes non pré-chargée

##### Rh2EffectAxiosConfigHandler

````typescript
export interface Rh2EffectAxiosConfigHandler {
    readonly keyOfInstance?: string;
    readonly axiosRequestConfig: AxiosRequestConfig;
    readonly justeReponse?: boolean;
    readonly errorHandler?: OptionalParamVoidMethod
    readonly successHandler?: OptionalParamVoidMethod,
}
````

<b>keyOfInstance</b> Si la valeur n'est pas renseignée, on prend la première instance générée. Si seulement une a été précisée à l'initialisation du paramétrage ou que rien n'a été fourni, le champ peut être ignoré.  

<b>axiosRequestConfig</b> Configuration Axios. 

<b>addToDirectory</b> S'utilise si l'on veut exécuter une seule fois la requête durant l'utilisation de l'application. Si true, la valeur pourra être mise à jour avec le service <b>QueryStorageService</b> pour être réinitialisée. 

| Attention : La condition pour filtrer les requêtes s'appuie sur l'url, le type de méthode et la propriété params. |
| ------------------------------------------------------------ |

<b>justeReponse</b> Si au retour de la requête on veut le contenu de data ou bien l'ensemble du paramétrage. Par défaut vaut true .

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



#### AxiosConfig

Paramétrage pour les requêtes.

``````typescript
export interface Rh2AxiosConfig extends Rh2EffectAxiosConfigHandler {
    readonly label: ConfigAxiosTrigger;
}
``````

<b>label</b> Label pour retrouver une configuration pré-chargée. 



#### FetchApi

Gestion des retour de requête.

Pour chaque requête, il y aura a minima le type <b>ResponseFetchApi</b>, en cas d'erreur  <b>ErreurFetchApi</b>

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
    modeDebug?: boolean
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
| axiosConfig  | AxiosRequestConfigExtended[] | Les requêtes qui seront exécutées pendant l’utilisation de l’application peuvent être pré-configurées. L’utilisation d’une clé sera nécessaire pour retrouver la configuration ajoutée | []                | Exemple 1        |
| modeDebug    | boolean                      | Log des informations complémentaires à l’utilisateur. Ceci peut aider à comprendre de mauvais comportement | false             | `true, false`    |
| errorHandler | function                     | Méthode générale qui va être utilisée en cas d’échec de la requête | n/a               | Exemple 2        |



#### AxiosRequestConfigExtended

| Nom                | Type                                | Description                                                  | Valeur par défaut                                  | Valeur d’exemple                                     |
| ------------------ | ----------------------------------- | ------------------------------------------------------------ | -------------------------------------------------- | ---------------------------------------------------- |
| key                | string                              | Clé pour retrouver l'instance Axios. Elle sera utilisée pour configurer les requêtes, vous devez indiquer à quelle instance elle devra se référer. Si aucune est renseignée, on utilise la première ajoutée | n/a                                                | `"MY_DEFAULT_KEY"`                                   |
| axiosConfig        | AxiosRequestConfig                  | Configuration [Axios](https://github.com/axios/axios). Si vous ne connaissez pas cette librairie, par exemple, vous pouvez valoriser la propriété baseURL pour indiquer le préfixe de chaque url qui utilisera cette instance | n/a                                                | `{ baseURL: 'http://test.fr' }`                      |
| defaultInterceptor | boolean                             | Si null ou true, alors un intercepteur va être crée pour cette instance. La propriété `headerUrl` devra également être valorisée. Vous pouvez créer votre propre interceptor en récupérant l'instance via un service mis à disposition.<br/><b>Si pour cette instance un interceptor par défaut a été crée et que vous implémenté le votre, le votre ne va pas fonctionner</b> | true                                               | `true, false`                                        |
| headerUrl          | {key: string;<br/>value: string;}[] | Liste des en-tête à utiliser par l'interceptor               | [{key: 'Content-Type', value: 'application/json'}] | `[{key: 'Content-Type', value: 'application/json'}]` |



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
    modeDebug: true,
    errorHandler: (data) => traitementErreur(data)
};
```



## Roadmap

Gérer l'annulation des requêtes http via la librairie si nécessaire