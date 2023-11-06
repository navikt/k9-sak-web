import { FormState } from '@fpsak-frontend/form/index';
import { Omsorgsdager } from '@navikt/k9-fe-omsorgsdager';
import React from 'react';
import KartleggePropertyTilSaerligeSmittevernhensynMikrofrontend from './KartleggePropertyTilSaerligeSmittevernhensynMikrofrontend';

export default ({ submitCallback, behandling, saerligSmittevernAp, aktiviteter }) => (
  <Omsorgsdager
    containerData={KartleggePropertyTilSaerligeSmittevernhensynMikrofrontend(
      submitCallback,
      behandling,
      saerligSmittevernAp,
      aktiviteter,
      FormState,
    )}
  />
);
