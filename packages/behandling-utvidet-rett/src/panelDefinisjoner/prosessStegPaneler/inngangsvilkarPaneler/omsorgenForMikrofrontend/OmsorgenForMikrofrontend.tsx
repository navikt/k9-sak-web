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
    jsSrc="/k9/microfrontend/omsorgsdager/build/1.5.18/app.js"
    jsIntegrity="sha256-aTCejInqutCcOrMRI/YrzHXm8c7D3wDEifY89zzuiLw="
    stylesheetSrc="/k9/microfrontend/omsorgsdager/build/1.5.18/styles.css"
    stylesheetIntegrity="sh256-VRRG1yM8vZZlfQI9e7J7FHwNyaVnMRqT+Y/0JKYLc1U="
    onReady={() => initializeOmsorgenForVilkar(omsorgenForVilkårAppID, props)}
  />
);
