import * as React from 'react';
import { MicroFrontend } from '@fpsak-frontend/utils';
import KartleggePropertyTilOmsorgenForMikrofrontendKomponent from './KartleggePropertyTilOmsorgenForMikrofrontendKomponent';

const initializeOmsorgenForVilkar = (
  elementId,
  { isReadOnly, behandling, aksjonspunkter, vilkar, submitCallback, angitteBarn },
) => {
  (window as any).renderMicrofrontendOmsorgsdagerApp(
    elementId,
    KartleggePropertyTilOmsorgenForMikrofrontendKomponent(
      behandling,
      isReadOnly,
      aksjonspunkter,
      vilkar,
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
    jsIntegrity="sha256-osgy4VaFHD5Ax1DdsVnxJOzOUltlcTP5XqvoTpfspss="
    stylesheetSrc="/k9/microfrontend/omsorgsdager/build/1.5.18/styles.css"
    stylesheetIntegrity="sh256-yc0EK0bC65cmcBr73huhKwCZi2KX+H+XOH3rvQtE640="
    onReady={() => initializeOmsorgenForVilkar(omsorgenForVilkårAppID, props)}
  />
);
