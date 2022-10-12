import React from 'react';
import { action } from '@storybook/addon-actions';
import { withKnobs, boolean, object } from '@storybook/addon-knobs';
import MedisinskVilkarIndex from '@fpsak-frontend/fakta-medisinsk-vilkar';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import { Aksjonspunkt, Behandling, Sykdom } from '@k9-sak-web/types';

import withReduxProvider from '../../../decorators/withRedux';

const behandling = {
  id: 1,
  versjon: 1,
  sprakkode: 'NO',
} as Behandling;

// FIXME bytt ut med riktig akjsonpunkt når det er klart
const aksjonspunkter = [
  {
    definisjon: aksjonspunktCodes.AVKLAR_STARTDATO_FOR_FORELDREPENGERPERIODEN,
    status: aksjonspunktStatus.OPPRETTET,
    begrunnelse: undefined,
    kanLoses: true,
    erAktivt: true,
  },
] as Aksjonspunkt[];

export default {
  title: 'fakta/pleiepenger/fakta-medisinsk-vilkar',
  component: MedisinskVilkarIndex,
  decorators: [withKnobs, withReduxProvider],
};

export const visFaktaOmMedisinskVilkar = () => (
  <MedisinskVilkarIndex
    behandling={object('behandling', behandling)}
    submitCallback={action('button-click')}
    readOnly={boolean('readOnly', false)}
    aksjonspunkter={[]}
    harApneAksjonspunkter
    submittable
    sykdom={{} as Sykdom}
  />
);

export const visFaktaOmMedisinskVilkarMedAkjsonspunkt = () => (
  <MedisinskVilkarIndex
    behandling={object('behandling', behandling)}
    submitCallback={action('button-click')}
    readOnly={boolean('readOnly', false)}
    aksjonspunkter={aksjonspunkter}
    harApneAksjonspunkter
    submittable
    sykdom={{} as Sykdom}
  />
);
