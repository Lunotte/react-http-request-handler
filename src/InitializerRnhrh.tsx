import React from 'react';
import { Provider } from 'react-redux';
import { default as Store } from './redux/hook-store';
import { SettingsInitializerRnhrh } from './models/AxiosConfig';

const InitializerRnhrh = (props: any) => {

  console.log(props.children);

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
        {props.children}
    </Provider>
  );
}

export default InitializerRnhrh;