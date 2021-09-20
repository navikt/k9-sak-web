import React from 'react';
import { MicroFrontend } from '@fpsak-frontend/utils';
import { FormState } from '@fpsak-frontend/form/index';
import sjekkHvisErIProduksjon from "@fpsak-frontend/utils/src/micro-frontends/sjekkHvisErIProduksjon";
import KartleggePropertyTilSaerligeSmittevernhensynMikrofrontend from './KartleggePropertyTilSaerligeSmittevernhensynMikrofrontend';

const initializeOmsorgsdagerFrontend = (elementId, { submitCallback, behandling, saerligSmittevernAp, aktiviteter }) => {
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

export default ({submitCallback, behandling, saerligSmittevernAp, aktiviteter})  => {
  const saerligSmittvernhensynVilkårAppID = 'saerligSmittvernhensyn';
  const erIProduksjon = sjekkHvisErIProduksjon();
  const path = erIProduksjon ? 'prod' : 'dev';

  // Kode til mikrofrontenden -> https://github.com/navikt/omsorgsdager-frontend/blob/main/src/ui/components/korrigere-perioder/KorrigerePerioder.tsx
  return (
    <MicroFrontend
      id={saerligSmittvernhensynVilkårAppID}
      jsSrc={`/k9/microfrontend/omsorgsdager/${path}/app.js`}
      stylesheetSrc={`/k9/microfrontend/omsorgsdager/${path}/styles.css`}
      onReady={() => initializeOmsorgsdagerFrontend(saerligSmittvernhensynVilkårAppID, {
        submitCallback,
        behandling,
        saerligSmittevernAp,
        aktiviteter
      })}
    />
  );
};
