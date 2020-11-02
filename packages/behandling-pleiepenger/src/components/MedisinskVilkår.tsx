import * as React from 'react';
import { MicroFrontend } from '@fpsak-frontend/utils';

const initializeMedisinskVilkår = elementId => {
  (window as any).renderMedisinskVilkarApp(elementId);
};

const medisinskVilkårAppID = 'medisinskVilkårApp';
export default () => {
  return (
    <MicroFrontend
      id={medisinskVilkårAppID}
      jsSrc="/k9/microfrontend/medisinsk-vilkar/1.2.2/app.js"
      jsIntegrity="sha384-/mDWzSirevS9qh5vbCgaSWoc8/YhVLC2smUvA87VJS6WRzc5NlurMbA9+3gWqJ6K"
      stylesheetSrc="/k9/microfrontend/medisinsk-vilkar/1.2.2/styles.css"
      stylesheetIntegrity="sha384-PqowIWBkYacYWk4MUZvx/VVm9Q1CT6cWIUyrFBdPspaTH+DQIEHfo0XyLWx0bvwr"
      onReady={() => initializeMedisinskVilkår(medisinskVilkårAppID)}
      onError={() => {}}
    />
  );
};
