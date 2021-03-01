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
      jsIntegrity="sha256-I01HVoIKCqAcX/p/gkIkrR/O3TwgR+0iS/ll4TjfWyc="
      stylesheetSrc="/k9/microfrontend/omsorgsdager/build/1.5.18/styles.css"
      stylesheetIntegrity="sha256-VRRG1yM8vZZlfQI9e7J7FHwNyaVnMRqT+Y/0JKYLc1U="
      onReady={() => initializeUtvidetRettVilkar(utvidetRettVilkårAppID, props)}
    />
  );
};
