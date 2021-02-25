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
      jsSrc="/k9/microfrontend/omsorgsdager/1.5.18/app.js"
      jsIntegrity="sha384-cJdFwt78KR5o77lkU9vj8zk4ltEb8eIE+IBewaCbz+rllMxYxfZfkEaUuBEbydoN"
      stylesheetSrc="/k9/microfrontend/omsorgsdager/1.5.18/styles.css"
      stylesheetIntegrity="sha384-QXxPpC6LOzUrjKWnX6aEaoD0969YYqQjYy5LSoyRA6GSQmlac+d/3qUNrn0U+z5d"
      onReady={() => initializeOmsorgenForVilkar(omsorgenForVilkårAppID, props)}
      onError={() => {}}
    />
  );
};
