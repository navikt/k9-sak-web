import { FormState } from '@fpsak-frontend/form/index';
import { Omsorgsdager } from '@navikt/k9-fe-omsorgsdager';
import { Omsorgsdager as LokalOmsorgsdager } from '@k9-sak-web/prosess-omsorgsdager';
import React from 'react';
import KartleggePropertyTilSaerligeSmittevernhensynMikrofrontend from './KartleggePropertyTilSaerligeSmittevernhensynMikrofrontend';

export default ({ submitCallback, behandling, saerligSmittevernAp, aktiviteter, featureToggles }) => {
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
  if (featureToggles?.LOKALE_PAKKER) {
    return <LokalOmsorgsdager containerData={data} />;
  }
  return <Omsorgsdager containerData={data} />;
};
