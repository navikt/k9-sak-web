import { action } from '@storybook/addon-actions';
import React from 'react';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import kommunikasjonsretning from '@fpsak-frontend/kodeverk/src/kommunikasjonsretning';
import InnsynProsessIndex from '@fpsak-frontend/prosess-innsyn';

import withReduxProvider from '../../../decorators/withRedux';

import alleKodeverk from '../../mocks/alleKodeverk.json';

const behandling = {
  id: 1,
  versjon: 1,
  behandlingPaaVent: false,
};

const aksjonspunkter = [
  {
    definisjon: {
      kode: aksjonspunktCodes.VURDER_INNSYN,
    },
    status: {
      kode: aksjonspunktStatus.OPPRETTET,
    },
    begrunnelse: undefined,
  },
];

export default {
  title: 'prosess/innsyn/prosess-innsyn',
  component: InnsynProsessIndex,
  decorators: [withReduxProvider],
};

export const visPanelForVurderingAvInnsyn = args => (
  <InnsynProsessIndex
    behandling={behandling}
    saksnummer={123434}
    aksjonspunkter={aksjonspunkter}
    alleDokumenter={[
      {
        journalpostId: '2',
        dokumentId: '3',
        tittel: 'Dette er et dokument',
        tidspunkt: '2017-08-02T00:54:25.455',
        kommunikasjonsretning: kommunikasjonsretning.INN,
      },
    ]}
    alleKodeverk={alleKodeverk}
    submitCallback={action('button-click')}
    {...args}
  />
);

visPanelForVurderingAvInnsyn.args = {
  innsyn: {
    dokumenter: [],
    vedtaksdokumentasjon: [
      {
        dokumentId: '1',
        tittel: behandlingType.FORSTEGANGSSOKNAD,
        opprettetDato: '2019-01-01',
      },
    ],
  },
  readOnly: false,
  isSubmittable: true,
};
