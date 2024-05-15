import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import { action } from '@storybook/addon-actions';
import React from 'react';
// eslint-disable-next-line import/no-relative-packages
import alleKodeverk from '../../storybook/stories/mocks/alleKodeverk.json';
import VergeFaktaIndex from './VergeFaktaIndex';

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
};

export const visAksjonspunktForAvklaringAvVerge = args => (
  <VergeFaktaIndex
    behandling={behandling}
    verge={verge}
    aksjonspunkter={aksjonspunkter}
    alleKodeverk={alleKodeverk}
    submitCallback={action('button-click')}
    {...args}
  />
);

visAksjonspunktForAvklaringAvVerge.args = {
  alleMerknaderFraBeslutter: {
    [aksjonspunktCodes.AVKLAR_VERGE]: merknaderFraBeslutter,
  },
  readOnly: false,
  harApneAksjonspunkter: true,
  submittable: true,
};
