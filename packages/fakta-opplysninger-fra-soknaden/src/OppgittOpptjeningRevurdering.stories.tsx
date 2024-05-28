import { Behandling, OpplysningerFraSøknaden } from '@k9-sak-web/types';
import { action } from '@storybook/addon-actions';
import React from 'react';
import OppgittOpptjeningRevurdering from './OppgittOpptjeningRevurdering';

const behandling = {
  id: 1,
  versjon: 1,
} as Behandling;

const aksjonspunkter = [
  {
    definisjon: {
      kode: '8004',
      kodeverk: 'AKSJONSPUNKT_DEFINISJON',
    },
    begrunnelse: 'Dette akjsonspunktet har blitt løst tidligere',
    status: {
      kode: 'OPPR',
      kodeverk: 'AKSJONSPUNKT_STATUS',
    },
    kanLoses: true,
    erAktivt: true,
  },
];

const opplysningerFraSøknaden = {
  førSøkerPerioden: {
    oppgittEgenNæring: [
      {
        periode: {
          fom: '2019-01-01',
          tom: '2019-12-31',
        },
        bruttoInntekt: {
          verdi: 540000,
        },
      },
    ],
    oppgittFrilans: null,
  },
  måneder: [
    {
      måned: {
        fom: '2020-04-01',
        tom: '2020-04-30',
      },
      oppgittIMåned: {
        oppgittEgenNæring: [
          {
            periode: {
              fom: '2020-04-01',
              tom: '2020-04-30',
            },
            bruttoInntekt: {
              verdi: 20000,
            },
          },
        ],
        oppgittFrilans: null,
      },
      søkerFL: false,
      søkerSN: true,
    },
    {
      måned: {
        fom: '2020-05-01',
        tom: '2020-05-31',
      },
      oppgittIMåned: {
        oppgittEgenNæring: [
          {
            periode: {
              fom: '2020-05-01',
              tom: '2020-05-31',
            },
            bruttoInntekt: {
              verdi: 20000,
            },
          },
        ],
        oppgittFrilans: null,
        oppgittArbeidsforhold: [
          {
            periode: {
              fom: '2020-05-01',
              tom: '2020-05-31',
            },
            inntekt: {
              verdi: 2000,
            },
          },
        ],
      },
      søkerFL: false,
      søkerSN: true,
    },
  ],
} as OpplysningerFraSøknaden;

export default {
  title: 'fakta/fakta-opplysninger-fra-søknaden',
  component: OppgittOpptjeningRevurdering,
};

export const visOpplysningerFraSøknaden = () => (
  <OppgittOpptjeningRevurdering
    behandling={behandling}
    readOnly={false}
    submitCallback={action('button-click')}
    harApneAksjonspunkter
    submittable
    kanEndrePåSøknadsopplysninger
    oppgittOpptjening={opplysningerFraSøknaden}
    aksjonspunkter={aksjonspunkter}
  />
);
