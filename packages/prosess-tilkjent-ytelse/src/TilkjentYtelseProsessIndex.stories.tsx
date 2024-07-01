import { action } from '@storybook/addon-actions';
import React from 'react';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import { fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import { fagsakStatus } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/FagsakStatus.js';
import { Aksjonspunkt, Behandling, BeregningsresultatUtbetalt, Fagsak } from '@k9-sak-web/types';
import alleKodeverk from '@k9-sak-web/gui/storybook/mocks/alleKodeverk.json';
import TilkjentYtelseProsessIndex from './TilkjentYtelseProsessIndex';

const fagsak = {
  saksnummer: '123456',
  sakstype: fagsakYtelsesType.FP, // FAGSAK_YTELSE
  status: fagsakStatus.UNDER_BEHANDLING, // FAGSAK_STATUS
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
          aktivitetStatus: 'AT', // AKTIVITET_STATUS
          inntektskategori: 'ARBEIDSTAKER', // INNTEKTSKATEGORI
          aktørId: null,
          arbeidsforholdId: null,
          arbeidsforholdType: '-', // OPPTJENING_AKTIVITET_TYPE
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
          aktivitetStatus: 'AT', // AKTIVITET_STATUS
          inntektskategori: 'ARBEIDSTAKER', // INNTEKTSKATEGORI
          aktørId: null,
          arbeidsforholdId: null,
          arbeidsforholdType: '-', // OPPTJENING_AKTIVITET_TYPE
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
          aktivitetStatus: 'AT', // AKTIVITET_STATUS
          inntektskategori: 'ARBEIDSTAKER', // INNTEKTSKATEGORI
          aktørId: null,
          arbeidsforholdId: null,
          arbeidsforholdType: '-', // OPPTJENING_AKTIVITET_TYPE
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
};

export const visUtenAksjonspunkt = args => (
  <TilkjentYtelseProsessIndex
    beregningsresultat={beregningsresultat}
    fagsak={fagsak}
    aksjonspunkter={[]}
    alleKodeverk={alleKodeverk as any}
    submitCallback={action('button-click')}
    arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
    {...args}
  />
);

visUtenAksjonspunkt.args = {
  behandling,
  isReadOnly: false,
  readOnlySubmitButton: true,
};

export const visÅpentAksjonspunkt = args => (
  <TilkjentYtelseProsessIndex
    beregningsresultat={beregningsresultat}
    fagsak={fagsak}
    aksjonspunkter={
      [
        {
          definisjon: aksjonspunktCodes.VURDER_TILBAKETREKK,
          status: aksjonspunktStatus.OPPRETTET,
        },
      ] as Aksjonspunkt[]
    }
    alleKodeverk={alleKodeverk as any}
    submitCallback={action('button-click')}
    arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
    {...args}
  />
);

visÅpentAksjonspunkt.args = {
  behandling,
  isReadOnly: false,
  readOnlySubmitButton: true,
};
