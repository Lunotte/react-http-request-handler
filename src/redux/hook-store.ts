import { createStore, compose, applyMiddleware, combineReducers } from 'redux';
import hookReducer from './hook-reducer';


let composeEnhancers = compose;

// if (__DEV__) {
//    composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION__ || compose;
//   /* composeEnhancers =  (window as any).__REDUX_DEVTOOLS_EXTENSION__ || (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
//         trace: true, // (action) => { return ‘trace as string’; }
//         traceLimit: 15,
//      })*/
// }

composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION__ || compose;


export default createStore(combineReducers({hookReducer}), composeEnhancers(applyMiddleware()));
