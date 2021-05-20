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
    versjon: '1.5.41',
    jsIntegrity: 'sha384-0bEAYWfSLpvwz2RRwqwV8e32mlxrq/c/EVyPv+M5HbtXrNlTDrSQOvAS9FuoJKaX',
    stylesheetIntegrity: 'sha384-okK9YI0I8wq3WER2z/MKqHGClJZTSnKRtir+HmywlWvVwBZZxs5aQ0GaGSwdil6F',
  };
  const preprodVersjon = {
    versjon: '1.5.41',
    jsIntegrity: 'sha384-0bEAYWfSLpvwz2RRwqwV8e32mlxrq/c/EVyPv+M5HbtXrNlTDrSQOvAS9FuoJKaX',
    stylesheetIntegrity: 'sha384-okK9YI0I8wq3WER2z/MKqHGClJZTSnKRtir+HmywlWvVwBZZxs5aQ0GaGSwdil6F',
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
