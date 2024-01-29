import { FormState } from '@fpsak-frontend/form/index';
import { Omsorgsdager } from '@k9-sak-web/prosess-omsorgsdager';
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
