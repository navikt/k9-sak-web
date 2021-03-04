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
    jsSrc="/k9/microfrontend/omsorgsdager/1.5.19/app.js"
    jsIntegrity="sha384-hxxqB3imhH23iM7JUhnlItkMSIDb1ArUYJLznzgFCd3zDR/0CalwMZR2O3gW75RO"
    stylesheetSrc="/k9/microfrontend/omsorgsdager/1.5.19/styles.css"
    stylesheetIntegrity="sha384-tiIFqqTAYStHMNAiUIA+DhMmSORk+iE0XQji2SaJNXyg8OwRyHWhWbt1pqxNy3w8"
    onReady={() => initializeOmsorgenForVilkar(omsorgenForVilkårAppID, props)}
  />
);
