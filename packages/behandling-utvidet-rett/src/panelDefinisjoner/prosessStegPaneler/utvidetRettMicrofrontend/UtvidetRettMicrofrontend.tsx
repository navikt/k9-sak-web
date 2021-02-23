import * as React from 'react';
import { MicroFrontend } from '@fpsak-frontend/utils';
import kartleggePropertyTilMikrofrontendKomponent from './UtvidetRettMikrofrontendHjelpFunksjoner';

const initializeUtvidetRettVilkar = (
  elementId,
  { isReadOnly, behandling, aksjonspunkter, vilkar, submitCallback, isAksjonspunktOpen },
) => {
  console.log(vilkar);
  (window as any).renderMicrofrontendOmsorgsdagerApp(
    elementId,
    kartleggePropertyTilMikrofrontendKomponent(
      behandling,
      isReadOnly,
      aksjonspunkter,
      vilkar,
      submitCallback,
      isAksjonspunktOpen,
    ),
  );
};

const utvidetRettVilkårAppID = 'utvidetRettApp';
export default props => {
  console.log(props);
  return (
    <MicroFrontend
      id={utvidetRettVilkårAppID}
      jsSrc="/k9/microfrontend/omsorgsdager/build/1.5.17/app.js"
      jsIntegrity="sha256-1DQVmrHiYe35OdubCUN7EzKKM8Vtqd+5gHZNHn8JtIs="
      stylesheetSrc="/k9/microfrontend/omsorgsdager/build/1.5.17/styles.css"
      stylesheetIntegrity="sha256-54RvrudhMms3vIXes24QxKreYv5UU8OhlomUjzaGrsY="
      onReady={() => initializeUtvidetRettVilkar(utvidetRettVilkårAppID, props)}
      onError={() => {}}
    />
  );
};
