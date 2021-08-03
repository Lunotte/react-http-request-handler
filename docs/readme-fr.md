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
import { InitializerRnhrh, Rh2InitializationParameter } from 'react-http-request-handler';

const initSettings: Rh2InitializationParameter = {
  modeDebug: true
};
 
<InitializerRnhrh rh2Settings={initSettings}>
  <App />
</InitializerRnhrh>
```

Soit vous la passez plus tard via un service :

```jsx
import { Rh2InitializationParameter, rh2ConfigService } from 'react-http-request-handler';

const initSettings: Rh2InitializationParameter = {
  modeDebug: true
};
rh2ConfigService.initializeParameters(initSettings);
```















## Roadmap

Gérer l'annulation des requêtes http via la librarie si nécessaire
Ajouter la possibilité à la librairie de gérer les intercepteurs (Gestion du bearerQ, ?)