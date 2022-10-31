import React from 'react';
import Utenlandsopphold from '@k9-sak-web/behandling-pleiepenger/src/components/Utenlandsopphold';
import utenlandsoppholdMock, { utenlandsoppholdÅrsakMock } from '../../../../mocks/mockdata/utenlandsoppholdMock';

export default {
  title: 'fakta/pleiepenger/fakta-utenlandsopphold',
  component: Utenlandsopphold,
};

export const UtenlandsoppholdVisning = () => (
  <Utenlandsopphold utenlandsopphold={utenlandsoppholdMock} kodeverk={utenlandsoppholdÅrsakMock} />
);
