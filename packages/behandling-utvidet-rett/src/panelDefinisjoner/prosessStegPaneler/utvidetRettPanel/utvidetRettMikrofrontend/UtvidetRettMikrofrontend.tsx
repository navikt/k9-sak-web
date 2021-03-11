import * as React from 'react';
import { MicroFrontend } from '@fpsak-frontend/utils';
import KartleggePropertyTilUtvidetRettMikrofrontendKomponent from './KartleggePropertyTilUtvidetRettMikrofrontendKomponent';

const initializeUtvidetRettVilkar = (
  elementId,
  { saksInformasjon, isReadOnly, aksjonspunkter, submitCallback, isAksjonspunktOpen },
) => {
  (window as any).renderMicrofrontendOmsorgsdagerApp(
    elementId,
    KartleggePropertyTilUtvidetRettMikrofrontendKomponent(
      saksInformasjon,
      isReadOnly,
      aksjonspunkter,
      submitCallback,
      isAksjonspunktOpen,
    ),
  );
};

export default props => {
  const utvidetRettVilkårAppID = 'utvidetRettApp';
  return (
    <MicroFrontend
      id={utvidetRettVilkårAppID}
      jsSrc="/k9/microfrontend/omsorgsdager/1.5.23/app.js"
      jsIntegrity="sha384-dj63ZcJMh5ahToAx/PxIy/z62/XQeYOhWMyTqH2rEiNcWPtJETcO+1K4YbeYVU9q"
      stylesheetSrc="/k9/microfrontend/omsorgsdager/1.5.23/styles.css"
      stylesheetIntegrity="sha384-s7NpvoZYFA4hqjZz3fcDywhn8ToSND1O1xwyGj6g2Z0brU/DDoFHAekre+XmKrw+"
      onReady={() => initializeUtvidetRettVilkar(utvidetRettVilkårAppID, props)}
    />
  );
};
