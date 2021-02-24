import * as React from 'react';
import { MicroFrontend } from '@fpsak-frontend/utils';
import kartleggePropertyTilMikrofrontendKomponent from './UtvidetRettMikrofrontendHjelpFunksjoner';

const initializeUtvidetRettVilkar = (
  elementId,
  { isReadOnly, behandling, aksjonspunkter, vilkar, submitCallback, isAksjonspunktOpen },
) => {
  console.log('Ny render med props', aksjonspunkter);
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
  return (
    <MicroFrontend
      id={utvidetRettVilkårAppID}
      jsSrc="/k9/microfrontend/omsorgsdager/build/1.5.17/app.js"
      jsIntegrity="sha256-eMm6syZ6S/oIwwRMVWDIfp4RgnozhIfUA0AT8faAOeQ="
      stylesheetSrc="/k9/microfrontend/omsorgsdager/build/1.5.17/styles.css"
      stylesheetIntegrity="sha256-XSoWL7x4IE2gltvaPblopfNsxJkAw8yjBYVxKXQSB2o="
      onReady={() => initializeUtvidetRettVilkar(utvidetRettVilkårAppID, props)}
      onError={() => {}}
    />
  );
};
