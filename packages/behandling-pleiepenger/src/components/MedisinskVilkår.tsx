import * as React from 'react';
import { MicroFrontend } from '@fpsak-frontend/utils';

const initializeMedisinskVilkår = elementId => {
  (window as any).renderMedisinskVilkarApp(elementId, {
    onVurderingValgt: vurdering => {
      if (vurdering !== null) {
        window.history.pushState('', '', `#vurdering=${vurdering}`);
      } else {
        window.location.hash = '';
      }
    },
    vurdering: new URLSearchParams(`?${window.location.hash.substr(1)}`).get('vurdering'),
  });
};

const medisinskVilkårAppID = 'medisinskVilkårApp';
export default () => {
  return (
    <MicroFrontend
      id={medisinskVilkårAppID}
      jsSrc="/k9/microfrontend/medisinsk-vilkar/1.4.1/app.js"
      jsIntegrity="sha384-yp254doNGjqqJKUErOyrK+YZY8OfzPYRK4MmrUnrU6YpOjpuUY42iZq4xDtfL2br"
      stylesheetSrc="/k9/microfrontend/medisinsk-vilkar/1.4.1/styles.css"
      stylesheetIntegrity="sha384-Ns3um5ypN0Dx4jWK7OT/rD9piP7up1qj4/bP3AYwhQtLHhc2SOMBTStumAyR0IXu"
      onReady={() => initializeMedisinskVilkår(medisinskVilkårAppID)}
      onError={() => {}}
    />
  );
};
