import { action } from '@storybook/addon-actions';
import React from 'react';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import innsynResultatType from '@fpsak-frontend/kodeverk/src/innsynResultatType';
import kommunikasjonsretning from '@fpsak-frontend/kodeverk/src/kommunikasjonsretning';
import VedtakInnsynProsessIndex from '@fpsak-frontend/prosess-vedtak-innsyn';

import withReduxProvider from '../../../decorators/withRedux';

const behandling = {
  id: 1,
  versjon: 1,
  sprakkode: {
    kode: 'NO',
  },
};

const aksjonspunkter = [
  {
    definisjon: {
      kode: aksjonspunktCodes.VURDER_INNSYN,
    },
    status: {
      kode: aksjonspunktStatus.UTFORT,
    },
    begrunnelse: 'Dette er utført',
  },
  {
    definisjon: {
      kode: aksjonspunktCodes.FORESLA_VEDTAK,
    },
    status: {
      kode: aksjonspunktStatus.OPPRETTET,
    },
    begrunnelse: undefined,
  },
];

export default {
  title: 'prosess/innsyn/prosess-vedtak-innsyn',
  component: VedtakInnsynProsessIndex,
  decorators: [withReduxProvider],
};

export const visPanelForInnvilgetVedtak = args => (
  <VedtakInnsynProsessIndex
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
    submitCallback={action('button-click')}
    previewCallback={action('button-click')}
    {...args}
  />
);

visPanelForInnvilgetVedtak.args = {
  innsyn: {
    dokumenter: [
      {
        journalpostId: '2',
        dokumentId: '3',
        tittel: 'Dette er et dokument',
        tidspunkt: '2017-08-02T00:54:25.455',
        kommunikasjonsretning: kommunikasjonsretning.INN,
        fikkInnsyn: true,
      },
    ],
    vedtaksdokumentasjon: [
      {
        dokumentId: '1',
        tittel: behandlingType.FORSTEGANGSSOKNAD,
        opprettetDato: '2019-01-01',
      },
    ],
    innsynResultatType: {
      kode: innsynResultatType.INNVILGET,
    },
    innsynMottattDato: '2019-01-01',
  },
  readOnly: false,
};

export const visPanelForAvvistVedtak = args => (
  <VedtakInnsynProsessIndex
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
    submitCallback={action('button-click')}
    previewCallback={action('button-click')}
    {...args}
  />
);

visPanelForAvvistVedtak.args = {
  innsyn: {
    dokumenter: [
      {
        journalpostId: '2',
        dokumentId: '3',
        tittel: 'Dette er et dokument',
        tidspunkt: '2017-08-02T00:54:25.455',
        kommunikasjonsretning: kommunikasjonsretning.INN,
        fikkInnsyn: true,
      },
    ],
    vedtaksdokumentasjon: [
      {
        dokumentId: '1',
        tittel: behandlingType.FORSTEGANGSSOKNAD,
        opprettetDato: '2019-01-01',
      },
    ],
    innsynResultatType: {
      kode: innsynResultatType.AVVIST,
    },
    innsynMottattDato: '2019-01-01',
  },
  readOnly: false,
};
