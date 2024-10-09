import React from 'react';
import utenlandsoppholdMock from '../../mocks/mockdata/utenlandsoppholdMock';
import Utenlandsopphold from './Utenlandsopphold';

export default {
  title: 'fakta/pleiepenger/fakta-utenlandsopphold',
  component: Utenlandsopphold,
};

export const UtenlandsoppholdVisning = () => <Utenlandsopphold utenlandsopphold={utenlandsoppholdMock} />;
