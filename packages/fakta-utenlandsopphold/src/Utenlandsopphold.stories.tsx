// Kompileringsfeil her betyr at BRUK_V2_UTENLANDSOPPHOLD er fjernet fra FeatureToggles.
// Slett hele packages/fakta-utenlandsopphold og fjern v1-grenen i FaktaPanelDef når migreringen er ferdig.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type _VenterPåSletting = import('@k9-sak-web/gui/featuretoggles/FeatureToggles.js').FeatureToggles['BRUK_V2_UTENLANDSOPPHOLD'];
import React from 'react';
import utenlandsoppholdMock, { utenlandsoppholdÅrsakMock } from '../../mocks/mockdata/utenlandsoppholdMock';
import Utenlandsopphold from './Utenlandsopphold';

export default {
  title: 'fakta/pleiepenger/fakta-utenlandsopphold',
  component: Utenlandsopphold,
};

export const UtenlandsoppholdVisning = () => (
  <Utenlandsopphold utenlandsopphold={utenlandsoppholdMock} kodeverk={utenlandsoppholdÅrsakMock} />
);
