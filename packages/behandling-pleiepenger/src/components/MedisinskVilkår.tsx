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
      jsSrc="/k9/microfrontend/medisinsk-vilkar/1.2.9/app.js"
      jsIntegrity="sha384-zTZOHy+icP1959vJmLfNltEiJ71a8PYaJFmG+uiUfCv3SET82YxEaeE2dHzAYiX3"
      stylesheetSrc="/k9/microfrontend/medisinsk-vilkar/1.2.9/styles.css"
      stylesheetIntegrity="sha384-gG2QA/rYN+9l6GpiVzIZVspHGHD4c2vTW5ITdIUVBznVIGJqliuZfizW+Vk6Ltgq"
      onReady={() => initializeMedisinskVilkår(medisinskVilkårAppID)}
      onError={() => {}}
    />
  );
};
