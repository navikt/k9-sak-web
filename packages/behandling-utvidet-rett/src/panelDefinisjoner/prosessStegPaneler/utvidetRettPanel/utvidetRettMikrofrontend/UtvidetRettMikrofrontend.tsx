import * as React from 'react';
import { MicroFrontend } from '@fpsak-frontend/utils';
import KartleggePropertyTilMikrofrontendKomponent from './KartleggePropertyTilMikrofrontendKomponent';

const initializeUtvidetRettVilkar = (
  elementId,
  { isReadOnly, behandling, aksjonspunkter, vilkar, submitCallback, isAksjonspunktOpen, soknad, fagsaksType },
) => {
  (window as any).renderMicrofrontendOmsorgsdagerApp(
    elementId,
    KartleggePropertyTilMikrofrontendKomponent(
      behandling,
      isReadOnly,
      aksjonspunkter,
      vilkar,
      submitCallback,
      isAksjonspunktOpen,
      soknad,
      fagsaksType,
    ),
  );
};

export default props => {
  const utvidetRettVilkårAppID = 'utvidetRettApp';
  return (
    <MicroFrontend
      id={utvidetRettVilkårAppID}
      jsSrc="/k9/microfrontend/omsorgsdager/build/1.5.18/app.js"
      jsIntegrity="sha256-osgy4VaFHD5Ax1DdsVnxJOzOUltlcTP5XqvoTpfspss="
      stylesheetSrc="/k9/microfrontend/omsorgsdager/build/1.5.18/styles.css"
      stylesheetIntegrity="sha256-yc0EK0bC65cmcBr73huhKwCZi2KX+H+XOH3rvQtE640="
      onReady={() => initializeUtvidetRettVilkar(utvidetRettVilkårAppID, props)}
    />
  );
};
