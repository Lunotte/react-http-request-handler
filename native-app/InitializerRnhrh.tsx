import React from 'react';
import { Provider } from 'react-redux';
import { rh2ConfigService, Rh2InitializationParameter } from '../src';
import { default as Store } from '../src/redux/rh2-store';

const InitializerRnhrh: React.FC<{ rh2Settings?: Rh2InitializationParameter }> = ({ rh2Settings, children }) => {

  if (rh2Settings != null) {
    rh2ConfigService.initializeParameters(rh2Settings);
  }

  return (
    <Provider store={Store}>
      {children}
    </Provider>
  );
}

export default InitializerRnhrh;