import * as React from 'react';
import { MicroFrontend } from '@fpsak-frontend/utils';
import sjekkHvisErIProduksjon from '@fpsak-frontend/utils/src/micro-frontends/sjekkHvisErIProduksjon';
import { FormState } from '@fpsak-frontend/form/index';
import KartleggePropertyTilSaerligeSmittevernhensynMikrofrontend from './KartleggePropertyTilSaerligeSmittevernhensynMikrofrontend';

const initializeOmsorgenForVilkar = (elementId, { submitCallback, behandling, saerligSmittevernAp, aktiviteter }) => {
  (window as any).renderMicrofrontendOmsorgsdagerApp(
    elementId,
    KartleggePropertyTilSaerligeSmittevernhensynMikrofrontend(
      submitCallback,
      behandling,
      saerligSmittevernAp,
      aktiviteter,
      FormState,
    ),
  );
};

const hentVersjonInformasjon = () => {
  const produksjonsVersjon = {
    versjon: '1.5.30',
    jsIntegrity: 'sha384-mWRKTlTCMBqfw28AKXc4HSgGc6O8CVuGXJ1oLO37jaI/QjU1sArXeArfJwGuevgA',
    stylesheetIntegrity: 'sha384-s7zKNrhjA1tpqnkyej5k6S6jybA6XM3bdjEMmWg9iMy7Mnj2pVupmHEmWn9LX1pY',
  };
  const preprodVersjon = {
    versjon: '1.5.39',
    jsIntegrity: 'sha384-f/xfINbIZNTeWEY7QCr1ns9MaKy18oF7bqDpGDhK7U/59hwPJ7co8hUDqOHxL3GG',
    stylesheetIntegrity: 'sha384-LC4FE5IBLroddA6Ew0fDNUxK+oapnpHA8pFrMSZ7Q67tIbZTe8hn8P/ktKJRojwr',
  };
  return sjekkHvisErIProduksjon() ? produksjonsVersjon : preprodVersjon;
};

export default props => {
  const saerligSmittvernhensynVilkårAppID = 'saerligSmittvernhensyn';
  const { versjon, jsIntegrity, stylesheetIntegrity } = hentVersjonInformasjon();
  return (
    <MicroFrontend
      id={saerligSmittvernhensynVilkårAppID}
      jsSrc={`/k9/microfrontend/omsorgsdager/${versjon}/app.js`}
      jsIntegrity={jsIntegrity}
      stylesheetSrc={`/k9/microfrontend/omsorgsdager/${versjon}/styles.css`}
      stylesheetIntegrity={stylesheetIntegrity}
      onReady={() => initializeOmsorgenForVilkar(saerligSmittvernhensynVilkårAppID, { ...props, FormState })}
    />
  );
};
