import React from 'react';
import { Provider } from 'react-redux';
import {default as Store} from '../src/redux/hook-store';

const StoreComponent = ({ children }) => (
    <Provider store={Store}>
      {children}
      </Provider>
);
  
export default StoreComponent;