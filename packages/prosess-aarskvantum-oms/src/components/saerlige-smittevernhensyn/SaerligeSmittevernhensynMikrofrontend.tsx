import * as React from 'react';
import { MicroFrontend } from '@fpsak-frontend/utils';
import sjekkHvisErIProduksjon from '@fpsak-frontend/utils/src/micro-frontends/sjekkHvisErIProduksjon';
import KartleggePropertyTilSaerligeSmittevernhensynMikrofrontend from './KartleggePropertyTilSaerligeSmittevernhensynMikrofrontend';

const initializeOmsorgenForVilkar = (
  elementId,
  { submitCallback, behandling, aksjonspunkterForSteg, isAksjonspunktOpen },
) => {
  (window as any).renderMicrofrontendOmsorgsdagerApp(
    elementId,
    KartleggePropertyTilSaerligeSmittevernhensynMikrofrontend(
      submitCallback,
      behandling,
      aksjonspunkterForSteg,
      isAksjonspunktOpen,
    ),
  );
};

const hentVersjonInformasjon = () => {
  const produksjonsVersjon = {
    versjon: '1.5.29',
    jsIntegrity: 'sha384-hHFYOcum1J9U/5dNOouYiTlcPhv4bF/SBVvlyri9YHsSWNFD2HrK9NxUkqUPjorm',
    stylesheetIntegrity: 'sha384-s7zKNrhjA1tpqnkyej5k6S6jybA6XM3bdjEMmWg9iMy7Mnj2pVupmHEmWn9LX1pY',
  };
  const preprodVersjon = {
    versjon: '1.5.30',
    jsIntegrity: 'sha256-Km83UIztXyVgojh1WWLHDJ5EcwQ1pZTNyomY79cqTC8=',
    stylesheetIntegrity: 'sha256-uEln+PYm//Fs5v6wRPj4zRXNwfbkHajm9UkwevaxsDo=',
  };
  return sjekkHvisErIProduksjon ? produksjonsVersjon : preprodVersjon;
};

export default props => {
  const saerligSmittvernhensynVilkårAppID = 'saerligSmittvernhensyn';
  const { versjon, jsIntegrity, stylesheetIntegrity } = hentVersjonInformasjon();
  return (
    <MicroFrontend
      id={saerligSmittvernhensynVilkårAppID}
      jsSrc={`/k9/microfrontend/omsorgsdager/build/${versjon}/app.js`}
      jsIntegrity={jsIntegrity}
      stylesheetSrc={`/k9/microfrontend/omsorgsdager/build/${versjon}/styles.css`}
      stylesheetIntegrity={stylesheetIntegrity}
      onReady={() => initializeOmsorgenForVilkar(saerligSmittvernhensynVilkårAppID, props)}
    />
  );
};
