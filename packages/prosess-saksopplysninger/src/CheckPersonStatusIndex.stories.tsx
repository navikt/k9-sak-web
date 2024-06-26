import { action } from '@storybook/addon-actions';
import React from 'react';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import personstatusType from '@fpsak-frontend/kodeverk/src/personstatusType';
import alleKodeverk from '@k9-sak-web/gui/storybook/mocks/alleKodeverk.json';
import { BehandlingType } from '@k9-sak-web/lib/types/BehandlingType.js';
import { KodeverkProvider } from '@k9-sak-web/gui/kodeverk/index.js';
import alleKodeverkV2 from '@k9-sak-web/lib/kodeverk/mocks/alleKodeverkV2.json';
import CheckPersonStatusIndex from './CheckPersonStatusIndex';

const behandling = {
  id: 1,
  versjon: 1,
  behandlingHenlagt: false,
};

const medlemskap = {
  fom: '2019-01-01',
};

const personopplysninger = {
  personstatus: personstatusType.DOD, // personstatusKodeverk
  avklartPersonstatus: {
    orginalPersonstatus: personstatusType.BOSATT, // personstatusKodeverk
    overstyrtPersonstatus: personstatusType.DOD, // personstatusKodeverk
  },
};

export default {
  title: 'prosess/prosess-saksopplysninger',
  component: CheckPersonStatusIndex,
};

export const visÅpentAksjonspunkt = args => (
  <KodeverkProvider
    behandlingType={BehandlingType.FORSTEGANGSSOKNAD}
    kodeverk={alleKodeverkV2}
    klageKodeverk={{}}
    tilbakeKodeverk={{}}
  >
    <CheckPersonStatusIndex
      aksjonspunkter={[
        {
          definisjon: aksjonspunktCodes.AVKLAR_PERSONSTATUS,
          status: aksjonspunktStatus.OPPRETTET,
          begrunnelse: undefined,
        },
      ]}
      alleKodeverk={alleKodeverk}
      submitCallback={action('button-click')}
      {...args}
    />
  </KodeverkProvider>
);

visÅpentAksjonspunkt.args = {
  behandling,
  medlemskap,
  personopplysninger,
  isReadOnly: false,
  readOnlySubmitButton: false,
};

export const visUtførtAksjonspunkt = args => (
  <KodeverkProvider
    behandlingType={BehandlingType.FORSTEGANGSSOKNAD}
    kodeverk={alleKodeverkV2}
    klageKodeverk={{}}
    tilbakeKodeverk={{}}
  >
    <CheckPersonStatusIndex
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
      {...args}
    />
  </KodeverkProvider>
);

visUtførtAksjonspunkt.args = {
  behandling,
  medlemskap,
  personopplysninger,
};
