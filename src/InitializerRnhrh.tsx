import PropTypes from 'prop-types';
import React from 'react';
import { Provider } from 'react-redux';
import { rh2ConfigService, Rh2InitializationParameter } from '.';
import { default as Store } from './redux/rh2-store';

const InitializerRnhrh: React.FC<{ rh2Settings?: Rh2InitializationParameter, children?: React.ReactNode }> = ({ rh2Settings, children }) => {

    if (rh2Settings != null) {
        rh2ConfigService.initializeParameters(rh2Settings);
    }

    return (
        <Provider store={Store}>
            {children}
        </Provider>
    );
}

InitializerRnhrh.propTypes = {
    rh2Settings: PropTypes.any,
    children: PropTypes.element
}

export default InitializerRnhrh;