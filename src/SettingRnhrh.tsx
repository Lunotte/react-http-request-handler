import React from 'react'
import { useDispatch } from 'react-redux';
import { SettingsInitializerRnhrh } from './models/AxiosConfig';
import { initSettingsAction } from './redux/hook-action';

const SettingRnhrh: React.FC<{ settingsInitializer: SettingsInitializerRnhrh }> = ({ settingsInitializer, children }) => {

    function initSettings() {
        const dispatch = useDispatch();
        dispatch(initSettingsAction(settingsInitializer));
    }

    initSettings();

    return (
        <>{children}</>
    );
}

export default SettingRnhrh;
