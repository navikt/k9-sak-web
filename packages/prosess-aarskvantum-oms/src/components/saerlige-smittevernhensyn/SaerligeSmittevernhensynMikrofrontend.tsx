import { FormState } from '@fpsak-frontend/form/index';
import { Omsorgsdager } from '@navikt/k9-fe-omsorgsdager';
import React from 'react';
import KartleggePropertyTilSaerligeSmittevernhensynMikrofrontend from './KartleggePropertyTilSaerligeSmittevernhensynMikrofrontend';

export default ({ submitCallback, behandling, saerligSmittevernAp, aktiviteter }) => {
  const data = KartleggePropertyTilSaerligeSmittevernhensynMikrofrontend(
    submitCallback,
    behandling,
    saerligSmittevernAp,
    aktiviteter,
    FormState,
  );
  if (!data) {
    return null;
  }
  return <Omsorgsdager containerData={data} />;
};
