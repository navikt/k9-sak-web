import { action } from '@storybook/addon-actions';
import { boolean, object, withKnobs } from '@storybook/addon-knobs';
import React from 'react';

import aksjonspunktCodes from '@k9-sak-web/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@k9-sak-web/kodeverk/src/aksjonspunktStatus';
import personstatusType from '@k9-sak-web/kodeverk/src/personstatusType';
import CheckPersonStatusIndex from '@k9-sak-web/prosess-saksopplysninger';

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
  decorators: [withKnobs, withReduxProvider],
};

export const visÅpentAksjonspunkt = () => (
  <CheckPersonStatusIndex
    behandling={object('behandling', behandling)}
    medlemskap={object('medlemskap', medlemskap)}
    personopplysninger={object('personopplysninger', personopplysninger)}
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
    isReadOnly={boolean('isReadOnly', false)}
    readOnlySubmitButton={boolean('readOnlySubmitButton', false)}
  />
);

export const visUtførtAksjonspunkt = () => (
  <CheckPersonStatusIndex
    behandling={object('behandling', behandling)}
    medlemskap={object('medlemskap', medlemskap)}
    personopplysninger={object('personopplysninger', personopplysninger)}
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
  />
);
