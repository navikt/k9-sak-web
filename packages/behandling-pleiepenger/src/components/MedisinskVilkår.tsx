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
      jsSrc="/k9/microfrontend/medisinsk-vilkar/1.2.6/app.js"
      jsIntegrity="sha384-qTnyStGj6sn1c3JxomeYPRE1qHE8LAv8ud1a7XdSGAlPlL4tI9quiLsHoN+jgnnM"
      stylesheetSrc="/k9/microfrontend/medisinsk-vilkar/1.2.6/styles.css"
      stylesheetIntegrity="sha384-Ne062nisMfvu3jnm8XVwXx66SQNgeXD+lE0faJN6lvsGUYpVfrSNSpYRTEal3Wzx"
      onReady={() => initializeMedisinskVilkår(medisinskVilkårAppID)}
      onError={() => {}}
    />
  );
};
