import { FormState } from '@fpsak-frontend/form';
import { Omsorgsdager } from '@navikt/k9-fe-omsorgsdager';
import React from 'react';
import KartleggePropertyTilOmsorgenForMikrofrontendKomponent from './KartleggePropertyTilOmsorgenForMikrofrontendKomponent';

export default props => (
  <Omsorgsdager
    containerData={KartleggePropertyTilOmsorgenForMikrofrontendKomponent({
      ...props,
      FormState,
    })}
  />
);
