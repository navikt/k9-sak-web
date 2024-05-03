import { action } from '@storybook/addon-actions';
import { boolean, object, withKnobs } from '@storybook/addon-knobs';
import React from 'react';

import aksjonspunktCodes from '@k9-sak-web/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@k9-sak-web/kodeverk/src/aksjonspunktStatus';
import behandlingType from '@k9-sak-web/kodeverk/src/behandlingType';
import kommunikasjonsretning from '@k9-sak-web/kodeverk/src/kommunikasjonsretning';
import InnsynProsessIndex from '@k9-sak-web/prosess-innsyn';

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
  decorators: [withKnobs, withReduxProvider],
};

export const visPanelForVurderingAvInnsyn = () => (
  <InnsynProsessIndex
    behandling={behandling}
    innsyn={object('innsyn', {
      dokumenter: [],
      vedtaksdokumentasjon: [
        {
          dokumentId: '1',
          tittel: behandlingType.FORSTEGANGSSOKNAD,
          opprettetDato: '2019-01-01',
        },
      ],
    })}
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
    readOnly={boolean('readOnly', false)}
    isSubmittable={boolean('isSubmittable', true)}
  />
);
