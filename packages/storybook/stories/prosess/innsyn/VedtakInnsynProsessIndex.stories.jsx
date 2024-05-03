import { action } from '@storybook/addon-actions';
import { boolean, object, withKnobs } from '@storybook/addon-knobs';
import React from 'react';

import aksjonspunktCodes from '@k9-sak-web/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@k9-sak-web/kodeverk/src/aksjonspunktStatus';
import behandlingType from '@k9-sak-web/kodeverk/src/behandlingType';
import innsynResultatType from '@k9-sak-web/kodeverk/src/innsynResultatType';
import kommunikasjonsretning from '@k9-sak-web/kodeverk/src/kommunikasjonsretning';
import VedtakInnsynProsessIndex from '@k9-sak-web/prosess-vedtak-innsyn';

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
  decorators: [withKnobs, withReduxProvider],
};

export const visPanelForInnvilgetVedtak = () => (
  <VedtakInnsynProsessIndex
    behandling={behandling}
    innsyn={object('innsyn', {
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
    submitCallback={action('button-click')}
    previewCallback={action('button-click')}
    readOnly={boolean('readOnly', false)}
  />
);

export const visPanelForAvvistVedtak = () => (
  <VedtakInnsynProsessIndex
    behandling={behandling}
    innsyn={object('innsyn', {
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
    submitCallback={action('button-click')}
    previewCallback={action('button-click')}
    readOnly={boolean('readOnly', false)}
  />
);
