/*
 * File: Rh2Initializer.ts                                                     *
 * Project: react-http-request-handler                                         *
 * Created Date: 2021 06 30                                                    *
 * Author: Charly Beaugrand                                                    *
 * -----                                                                       *
 * Last Modified: 2022 03 30 - 07:28 pm
 * Modified By: Charly Beaugrand
 * -----                                                                       *
 * Copyright (c) 2021 Lunotte                                                  *
 * ----------	---	---------------------------------------------------------  *
 */

import PropTypes from 'prop-types';
import React from 'react';
import { rh2ConfigService, Rh2InitializationParameter } from '.';

const Rh2Initializer: React.FC<{ rh2Settings?: Rh2InitializationParameter, children?: React.ReactNode }> = ({ rh2Settings, children }) => {

    rh2ConfigService.initializeParameters(rh2Settings);

    return (
        <>
            {children}
        </>
    );
}

Rh2Initializer.propTypes = {
    rh2Settings: PropTypes.any,
    children: PropTypes.element
}

export default Rh2Initializer;