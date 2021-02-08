import * as React from 'react';
// import { MicroFrontend } from '@fpsak-frontend/utils';

/* const initializeUtvidetRettVilkar = elementId => {
  (window as any).renderMedisinskVilkarApp(elementId, {
    onVurderingValgt: vurdering => {
      if (vurdering !== null) {
        window.history.pushState('', '', `#vurdering=${vurdering}`);
      } else {
        window.location.hash = '';
      }
    },
  });
};

const medisinskVilkårAppID = 'medisinskVilkårApp';
export default () => {
  return (
    <MicroFrontend
      id={medisinskVilkårAppID}
      jsSrc="/k9/microfrontend/medisinsk-vilkar/1.4.2/app.js"
      jsIntegrity="sha384-iNIBcJsYevOG/6mMde96Zy76+n0IarHJehHRWuBmVxn6fGK5sHlm4fRVIeLyXp3S"
      stylesheetSrc="/k9/microfrontend/medisinsk-vilkar/1.4.2/styles.css"
      stylesheetIntegrity="sha384-Ns3um5ypN0Dx4jWK7OT/rD9piP7up1qj4/bP3AYwhQtLHhc2SOMBTStumAyR0IXu"
      onReady={() => initializeUtvidetRettVilkar(medisinskVilkårAppID)}
      onError={() => {}}
    />
  );
}; */

const TestComponent = props => {
  console.log(props);
  return <>Hi</>;
};

export default TestComponent;
