import * as React from 'react';
import { MicroFrontend } from '@fpsak-frontend/utils';
import KartleggePropertyTilOmsorgenForMikrofrontendKomponent from './KartleggePropertyTilOmsorgenForMikrofrontendKomponent';

const initializeOmsorgenForVilkar = (
  elementId,
  { vedtakFattetAksjonspunkt, isReadOnly, aksjonspunkter, vilkar, isAksjonspunktOpen, submitCallback, angitteBarn },
) => {
  (window as any).renderMicrofrontendOmsorgsdagerApp(
    elementId,
    KartleggePropertyTilOmsorgenForMikrofrontendKomponent(
      vedtakFattetAksjonspunkt,
      isReadOnly,
      aksjonspunkter,
      vilkar,
      isAksjonspunktOpen,
      submitCallback,
      angitteBarn,
    ),
  );
};

const omsorgenForVilkårAppID = 'omsorgenForRettApp';
export default props => (
  <MicroFrontend
    id={omsorgenForVilkårAppID}
    jsSrc="/k9/microfrontend/omsorgsdager/1.5.23/app.js"
    jsIntegrity="sha384-dj63ZcJMh5ahToAx/PxIy/z62/XQeYOhWMyTqH2rEiNcWPtJETcO+1K4YbeYVU9q"
    stylesheetSrc="/k9/microfrontend/omsorgsdager/1.5.23/styles.css"
    stylesheetIntegrity="sha384-s7NpvoZYFA4hqjZz3fcDywhn8ToSND1O1xwyGj6g2Z0brU/DDoFHAekre+XmKrw+"
    onReady={() => initializeOmsorgenForVilkar(omsorgenForVilkårAppID, props)}
  />
);
