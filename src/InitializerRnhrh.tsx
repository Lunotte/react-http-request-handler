import React from 'react';
import { Provider } from 'react-redux';
import { default as Store } from './redux/hook-store';
import SettingRnhrh from './SettingRnhrh';
import { SettingsInitializerRnhrh } from './models/AxiosConfig';

const InitializerRnhrh: React.FC<{ settingsInitializer: SettingsInitializerRnhrh }> = ({ settingsInitializer, children }) => {

  console.log(settingsInitializer, children);

  // function SettingRnhrhComponent() {
  //   return (
  //     <SettingRnhrh settingsInitializer={settingsInitializer}>
  //       {children}
  //     </SettingRnhrh>
  //   )
  // }

  // /**
  //  * Si l'utilisateur n'utilise pas redux dans son appli on fourni le store
  //  */
  // function AvecOuSansStore() {
  //   if (settingsInitializer.reduxIsActif) {
  //     return <SettingRnhrhComponent />
  //   } else {
  //     return (<Provider store={Store}>
  //       <SettingRnhrhComponent />
  //     </Provider>)
  //   }
  // }


  return (
    <Provider store={Store}>
      <SettingRnhrh settingsInitializer={settingsInitializer}>
        {children}
      </SettingRnhrh>
    </Provider>
  );
}

export default InitializerRnhrh;