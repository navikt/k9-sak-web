import * as React from 'react';
import { MicroFrontend } from '@fpsak-frontend/utils';
import kartleggePropertyTilOmsorgenForMikrofrontendKomponent from './OmsorgenForMikrofrontendHjelpFunksjoner';

const initializeOmsorgenForVilkar = (
  elementId,
  { isReadOnly, behandling, aksjonspunkter, vilkar, submitCallback, angitteBarn },
) => {
  (window as any).renderMicrofrontendOmsorgsdagerApp(
    elementId,
    kartleggePropertyTilOmsorgenForMikrofrontendKomponent(
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
export default props => {
  return (
    <MicroFrontend
      id={omsorgenForVilkårAppID}
      jsSrc="/k9/microfrontend/omsorgsdager/build/1.5.17/app.js"
      jsIntegrity="sha256-WcRHIyakKzq9WUg9ecXSd95zmQ6s0Nq8abH23dy6MBM="
      stylesheetSrc="/k9/microfrontend/omsorgsdager/build/1.5.17/styles.css"
      stylesheetIntegrity="sha256-OwN7oHh3pVJdFYDdrsgwa0kLqYwGWSIBTSUOZSJgL68="
      onReady={() => initializeOmsorgenForVilkar(omsorgenForVilkårAppID, props)}
      onError={() => {}}
    />
  );
};
