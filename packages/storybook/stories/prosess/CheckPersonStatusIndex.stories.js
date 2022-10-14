import React from 'react';
import { action } from '@storybook/addon-actions';
import { withKnobs, boolean, object } from '@storybook/addon-knobs';

import personstatusType from '@fpsak-frontend/kodeverk/src/personstatusType';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import CheckPersonStatusIndex from '@fpsak-frontend/prosess-saksopplysninger';

import withReduxProvider from '../../decorators/withRedux';

import alleKodeverk from '../mocks/alleKodeverk.json';

const behandling = {
  id: 1,
  versjon: 1,
  behandlingHenlagt: false,
};

const medlemskap = {
  fom: '2019-01-01',
};

const personopplysninger = {
  personstatus: personstatusType.DOD,
  avklartPersonstatus: {
    orginalPersonstatus: personstatusType.BOSATT,
    overstyrtPersonstatus: personstatusType.DOD,
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
        definisjon: aksjonspunktCodes.AVKLAR_PERSONSTATUS,
        status: aksjonspunktStatus.OPPRETTET,
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
        definisjon: aksjonspunktCodes.AVKLAR_PERSONSTATUS,
        status: aksjonspunktStatus.UTFORT,
        begrunnelse: 'Dette er en begrunnelse',
      },
    ]}
    alleKodeverk={alleKodeverk}
    submitCallback={action('button-click')}
    isReadOnly
    readOnlySubmitButton
  />
);
