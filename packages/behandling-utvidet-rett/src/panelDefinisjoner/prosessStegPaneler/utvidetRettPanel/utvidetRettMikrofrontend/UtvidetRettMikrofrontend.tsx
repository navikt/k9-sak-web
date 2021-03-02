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
      jsSrc="/k9/microfrontend/omsorgsdager/build/1.5.18/app.js"
      jsIntegrity="sha256-aTCejInqutCcOrMRI/YrzHXm8c7D3wDEifY89zzuiLw="
      stylesheetSrc="/k9/microfrontend/omsorgsdager/build/1.5.18/styles.css"
      stylesheetIntegrity="sha256-VRRG1yM8vZZlfQI9e7J7FHwNyaVnMRqT+Y/0JKYLc1U="
      onReady={() => initializeUtvidetRettVilkar(utvidetRettVilkårAppID, props)}
    />
  );
};
