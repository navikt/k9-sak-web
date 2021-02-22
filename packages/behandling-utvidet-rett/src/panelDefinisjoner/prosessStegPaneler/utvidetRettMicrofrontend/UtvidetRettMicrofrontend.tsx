import * as React from 'react';
import { MicroFrontend } from '@fpsak-frontend/utils';
import kartleggePropertyTilMikrofrontendKomponent from './UtvidetRettMikrofrontendHjelpFunksjoner';

const initializeUtvidetRettVilkar = (elementId, { isReadOnly, behandling, aksjonspunkter, submitCallback }) => {
  (window as any).renderMicrofrontendOmsorgsdagerApp(
    elementId,
    kartleggePropertyTilMikrofrontendKomponent(behandling, isReadOnly, aksjonspunkter, submitCallback),
  );
};

const utvidetRettVilkårAppID = 'utvidetRettApp';
export default props => (
  <MicroFrontend
    id={utvidetRettVilkårAppID}
    jsSrc="/k9/microfrontend/omsorgsdager/build/1.5.18/app.js"
    jsIntegrity="sha256-ybxx9Uz8yeh9WxGHrYcyDSGqidkmm3O0AJSpAjjDpj8="
    stylesheetSrc="/k9/microfrontend/omsorgsdager/build/1.5.18/styles.css"
    stylesheetIntegrity="sha256-Xt0xaNi4+UtfJgw6wH36xXZJym4mgHCWL9pxk66vifo="
    onReady={() => initializeUtvidetRettVilkar(utvidetRettVilkårAppID, props)}
    onError={() => {}}
  />
);
