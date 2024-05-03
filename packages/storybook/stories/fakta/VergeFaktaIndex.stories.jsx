import { action } from '@storybook/addon-actions';
import { boolean, object, withKnobs } from '@storybook/addon-knobs';
import React from 'react';

import VergeFaktaIndex from '@k9-sak-web/fakta-verge';
import aksjonspunktCodes from '@k9-sak-web/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@k9-sak-web/kodeverk/src/aksjonspunktStatus';

import withReduxProvider from '../../decorators/withRedux';

import alleKodeverk from '../mocks/alleKodeverk.json';

const behandling = {
  id: 1,
  versjon: 1,
};

const aksjonspunkter = [
  {
    definisjon: {
      kode: aksjonspunktCodes.AVKLAR_VERGE,
    },
    status: {
      kode: aksjonspunktStatus.OPPRETTET,
    },
    begrunnelse: undefined,
    kanLoses: true,
    erAktivt: true,
  },
];

const verge = {};

const merknaderFraBeslutter = {
  notAccepted: false,
};

export default {
  title: 'fakta/fakta-verge',
  component: VergeFaktaIndex,
  decorators: [withKnobs, withReduxProvider],
};

export const visAksjonspunktForAvklaringAvVerge = () => (
  <VergeFaktaIndex
    behandling={behandling}
    verge={verge}
    aksjonspunkter={aksjonspunkter}
    alleKodeverk={alleKodeverk}
    alleMerknaderFraBeslutter={{
      [aksjonspunktCodes.AVKLAR_VERGE]: object('merknaderFraBeslutter', merknaderFraBeslutter),
    }}
    submitCallback={action('button-click')}
    readOnly={boolean('readOnly', false)}
    harApneAksjonspunkter={boolean('harApneAksjonspunkter', true)}
    submittable={boolean('submittable', true)}
  />
);
