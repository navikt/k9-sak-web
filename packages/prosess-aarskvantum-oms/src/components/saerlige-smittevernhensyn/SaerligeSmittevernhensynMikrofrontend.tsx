import React from 'react';
import { MicroFrontend } from '@fpsak-frontend/utils';
import { FormState } from '@fpsak-frontend/form/index';
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

  // Kode til mikrofrontenden -> https://github.com/navikt/omsorgsdager-frontend/blob/main/src/ui/components/korrigere-perioder/KorrigerePerioder.tsx
  return (
    <MicroFrontend
      id={saerligSmittvernhensynVilkårAppID}
      jsSrc="/k9/microfrontend/omsorgsdager/1/app.js"
      stylesheetSrc="/k9/microfrontend/omsorgsdager/1/styles.css"
      onReady={() => initializeOmsorgsdagerFrontend(saerligSmittvernhensynVilkårAppID, {
        submitCallback,
        behandling,
        saerligSmittevernAp,
        aktiviteter
      })}
    />
  );
};
