import { action } from '@storybook/addon-actions';
import React from 'react';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import personstatusType from '@fpsak-frontend/kodeverk/src/personstatusType';
import CheckPersonStatusIndex from '@fpsak-frontend/prosess-saksopplysninger';

import withReduxProvider from '../../decorators/withRedux';

import alleKodeverk from '../mocks/alleKodeverk.json';

const personstatusKodeverk = 'PERSONSTATUS_TYPE';

const behandling = {
  id: 1,
  versjon: 1,
  behandlingHenlagt: false,
};

const medlemskap = {
  fom: '2019-01-01',
};

const personopplysninger = {
  personstatus: {
    kode: personstatusType.DOD,
    kodeverk: personstatusKodeverk,
  },
  avklartPersonstatus: {
    orginalPersonstatus: {
      kode: personstatusType.BOSATT,
      kodeverk: personstatusKodeverk,
    },
    overstyrtPersonstatus: {
      kode: personstatusType.DOD,
      kodeverk: personstatusKodeverk,
    },
  },
};

export default {
  title: 'prosess/prosess-saksopplysninger',
  component: CheckPersonStatusIndex,
  decorators: [withReduxProvider],
};

export const visÅpentAksjonspunkt = args => (
  <CheckPersonStatusIndex
    aksjonspunkter={[
      {
        definisjon: {
          kode: aksjonspunktCodes.AVKLAR_PERSONSTATUS,
        },
        status: {
          kode: aksjonspunktStatus.OPPRETTET,
        },
        begrunnelse: undefined,
      },
    ]}
    alleKodeverk={alleKodeverk}
    submitCallback={action('button-click')}
    {...args}
  />
);

visÅpentAksjonspunkt.args = {
  behandling,
  medlemskap,
  personopplysninger,
  isReadOnly: false,
  readOnlySubmitButton: false,
};

export const visUtførtAksjonspunkt = args => (
  <CheckPersonStatusIndex
    aksjonspunkter={[
      {
        definisjon: {
          kode: aksjonspunktCodes.AVKLAR_PERSONSTATUS,
        },
        status: {
          kode: aksjonspunktStatus.UTFORT,
        },
        begrunnelse: 'Dette er en begrunnelse',
      },
    ]}
    alleKodeverk={alleKodeverk}
    submitCallback={action('button-click')}
    isReadOnly
    readOnlySubmitButton
    {...args}
  />
);

visUtførtAksjonspunkt.args = {
  behandling,
  medlemskap,
  personopplysninger,
};
