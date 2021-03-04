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
      jsSrc="/k9/microfrontend/omsorgsdager/1.5.19/app.js"
      jsIntegrity="sha384-hxxqB3imhH23iM7JUhnlItkMSIDb1ArUYJLznzgFCd3zDR/0CalwMZR2O3gW75RO"
      stylesheetSrc="/k9/microfrontend/omsorgsdager/1.5.19/styles.css"
      stylesheetIntegrity="sha384-tiIFqqTAYStHMNAiUIA+DhMmSORk+iE0XQji2SaJNXyg8OwRyHWhWbt1pqxNy3w8"
      onReady={() => initializeUtvidetRettVilkar(utvidetRettVilkårAppID, props)}
    />
  );
};
