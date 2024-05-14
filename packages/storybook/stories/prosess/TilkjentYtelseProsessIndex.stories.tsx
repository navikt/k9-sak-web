import React from 'react';
import { action } from '@storybook/addon-actions';
import { boolean, object, withKnobs } from '@storybook/addon-knobs';

import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import TilkjentYtelseProsessIndex from '@fpsak-frontend/prosess-tilkjent-ytelse';
import { Aksjonspunkt, Behandling, BeregningsresultatUtbetalt, Fagsak } from '@k9-sak-web/types';

import { fagsakStatus } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/FagsakStatus.js';
import { fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import withReduxProvider from '../../decorators/withRedux';

import alleKodeverk from '../mocks/alleKodeverk.json';

const fagsak = {
  saksnummer: '123456',
  sakstype: { kode: fagsakYtelsesType.FP, kodeverk: 'FAGSAK_YTELSE' },
  status: { kode: fagsakStatus.UNDER_BEHANDLING, kodeverk: 'FAGSAK_STATUS' },
} as Fagsak;

const behandling = {
  id: 1,
  versjon: 1,
} as Behandling;

const beregningsresultat = {
  opphoersdato: '2021-03-27',
  perioder: [
    {
      andeler: [
        {
          // @ts-ignore Fiks
          aktivitetStatus: {
            kode: 'AT',
            kodeverk: 'AKTIVITET_STATUS',
          },
          inntektskategori: {
            kode: 'ARBEIDSTAKER',
            kodeverk: 'INNTEKTSKATEGORI',
          },
          aktørId: null,
          arbeidsforholdId: null,
          arbeidsforholdType: {
            kode: '-',
            kodeverk: 'OPPTJENING_AKTIVITET_TYPE',
          },
          arbeidsgiverNavn: 'BEDRIFT1 AS',
          arbeidsgiverOrgnr: '123456789',
          eksternArbeidsforholdId: null,
          refusjon: 990,
          sisteUtbetalingsdato: null,
          stillingsprosent: 0,
          tilSoker: 549,
          utbetalingsgrad: 100,
          uttak: [
            {
              periode: {
                fom: '2021-03-12',
                tom: '2021-03-14',
              },
              utbetalingsgrad: 100,
              utfall: 'INNVILGET',
            },
            {
              periode: {
                fom: '2021-03-15',
                tom: '2021-03-15',
              },
              utbetalingsgrad: 100,
              utfall: 'INNVILGET',
            },
          ],
        },
        {
          aktivitetStatus: {
            kode: 'AT',
            kodeverk: 'AKTIVITET_STATUS',
          },
          inntektskategori: {
            kode: 'ARBEIDSTAKER',
            kodeverk: 'INNTEKTSKATEGORI',
          },
          aktørId: null,
          arbeidsforholdId: null,
          arbeidsforholdType: {
            kode: '-',
            kodeverk: 'OPPTJENING_AKTIVITET_TYPE',
          },
          arbeidsgiverNavn: 'BEDRIFT2 AS',
          arbeidsgiverOrgnr: '234567890',
          eksternArbeidsforholdId: null,
          refusjon: 1090,
          sisteUtbetalingsdato: null,
          stillingsprosent: 0,
          tilSoker: 0,
          utbetalingsgrad: 100,
          uttak: [
            {
              periode: {
                fom: '2021-03-16',
                tom: '2021-03-19',
              },
              utbetalingsgrad: 100,
              utfall: 'INNVILGET',
            },
          ],
        },
      ],
      dagsats: 1142,
      fom: '2021-03-12',
      tom: '2021-03-19',
    },
    {
      andeler: [
        {
          aktivitetStatus: {
            kode: 'AT',
            kodeverk: 'AKTIVITET_STATUS',
          },
          inntektskategori: {
            kode: 'ARBEIDSTAKER',
            kodeverk: 'INNTEKTSKATEGORI',
          },
          aktørId: null,
          arbeidsforholdId: null,
          arbeidsforholdType: {
            kode: '-',
            kodeverk: 'OPPTJENING_AKTIVITET_TYPE',
          },
          arbeidsgiverNavn: 'BEDRIFT1 AS',
          arbeidsgiverOrgnr: '123456789',
          eksternArbeidsforholdId: null,
          refusjon: 45,
          sisteUtbetalingsdato: null,
          stillingsprosent: 0,
          tilSoker: 990,
          utbetalingsgrad: 100,
          uttak: [
            {
              periode: {
                fom: '2021-03-22',
                tom: '2021-03-24',
              },
              utbetalingsgrad: 100,
              utfall: 'INNVILGET',
            },
            {
              periode: {
                fom: '2021-03-26',
                tom: '2021-03-26',
              },
              utbetalingsgrad: 100,
              utfall: 'INNVILGET',
            },
            {
              periode: {
                fom: '2021-03-27',
                tom: '2021-03-27',
              },
              utbetalingsgrad: 100,
              utfall: 'AVSLÅTT',
            },
          ],
        },
      ],
      dagsats: 1192,
      fom: '2021-03-22',
      tom: '2021-03-27',
    },
  ],
  skalHindreTilbaketrekk: false,
  utbetaltePerioder: [],
} as BeregningsresultatUtbetalt;

const arbeidsgiverOpplysningerPerId = {
  12345678: {
    navn: 'BEDRIFT1 AS',
    erPrivatPerson: false,
    identifikator: '12345678',
    arbeidsforholdreferanser: [
      {
        internArbeidsforholdId: 'esh3223',
        eksternArbeidsforholdId: 'roijj23r',
      },
    ],
  },
};

export default {
  title: 'prosess/prosess-tilkjent-ytelse',
  component: TilkjentYtelseProsessIndex,
  decorators: [withKnobs, withReduxProvider],
};

export const visUtenAksjonspunkt = () => (
  <TilkjentYtelseProsessIndex
    behandling={object('behandling', behandling)}
    beregningsresultat={beregningsresultat}
    fagsak={fagsak}
    aksjonspunkter={[]}
    alleKodeverk={alleKodeverk as any}
    isReadOnly={boolean('isReadOnly', false)}
    submitCallback={action('button-click')}
    readOnlySubmitButton={boolean('readOnly', true)}
    arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
  />
);

export const visÅpentAksjonspunkt = () => (
  <TilkjentYtelseProsessIndex
    behandling={object('behandling', behandling)}
    beregningsresultat={beregningsresultat}
    fagsak={fagsak}
    aksjonspunkter={
      [
        {
          definisjon: {
            kode: aksjonspunktCodes.VURDER_TILBAKETREKK,
            kodeverk: '',
          },
          status: {
            kode: aksjonspunktStatus.OPPRETTET,
            kodeverk: '',
          },
        },
      ] as Aksjonspunkt[]
    }
    alleKodeverk={alleKodeverk as any}
    isReadOnly={boolean('isReadOnly', false)}
    submitCallback={action('button-click')}
    readOnlySubmitButton={boolean('readOnly', true)}
    arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
  />
);
