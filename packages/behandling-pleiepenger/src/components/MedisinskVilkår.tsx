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
      jsSrc="/k9/microfrontend/medisinsk-vilkar/1.2.7/app.js"
      jsIntegrity="sha384-+fPzNRJWt649DQ2zeJ+o6BWAVcm3U8gc2Jh3sJPJmj/2oRPneGpT391x1fq7lOT1"
      stylesheetSrc="/k9/microfrontend/medisinsk-vilkar/1.2.7/styles.css"
      stylesheetIntegrity="sha384-gG2QA/rYN+9l6GpiVzIZVspHGHD4c2vTW5ITdIUVBznVIGJqliuZfizW+Vk6Ltgq"
      onReady={() => initializeMedisinskVilkår(medisinskVilkårAppID)}
      onError={() => {}}
    />
  );
};
