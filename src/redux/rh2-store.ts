import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import hookReducer from './rh2-reducer';


let composeEnhancers = compose;

// if (__DEV__) {
//    composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION__ || compose;
//   /* composeEnhancers =  (window as any).__REDUX_DEVTOOLS_EXTENSION__ || (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
//         trace: true, // (action) => { return ‘trace as string’; }
//         traceLimit: 15,
//      })*/
// }

composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION__ || compose;

const rootReducers = combineReducers({ lib: hookReducer });
export default createStore(hookReducer, composeEnhancers(applyMiddleware()));

export type RootState = ReturnType<typeof rootReducers>;
