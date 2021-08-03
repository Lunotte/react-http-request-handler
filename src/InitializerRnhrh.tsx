import PropTypes from 'prop-types';
import React from 'react';
import { rh2ConfigService, Rh2InitializationParameter } from '.';

const InitializerRnhrh: React.FC<{ rh2Settings?: Rh2InitializationParameter, children?: React.ReactNode }> = ({ rh2Settings, children }) => {

    if (rh2Settings != null) {
        rh2ConfigService.initializeParameters(rh2Settings);
    }

    return (
        <>
            {children}
        </>
    );
}

InitializerRnhrh.propTypes = {
    rh2Settings: PropTypes.any,
    children: PropTypes.element
}

export default InitializerRnhrh;