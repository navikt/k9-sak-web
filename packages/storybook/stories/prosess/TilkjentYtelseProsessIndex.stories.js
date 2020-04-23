import React from 'react';
import { action } from '@storybook/addon-actions';
import { withKnobs, boolean, object } from '@storybook/addon-knobs';

import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import TilkjentYtelseProsessIndex from '@fpsak-frontend/prosess-tilkjent-ytelse';

import withReduxProvider from '../../decorators/withRedux';

import alleKodeverk from '../mocks/alleKodeverk.json';

const fagsak = {
  fagsakYtelseType: {
    kode: fagsakYtelseType.FORELDREPENGER,
  },
};

const behandling = {
  id: 1,
  versjon: 1,
};

const beregningsresultat = {
  opphoersdato: '2021-03-27',
  perioder: [
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
              utfall: {
                kode: 'INNVILGET',
                kodeverk: 'UTTAK_UTFALL_TYPE',
              },
            },
            {
              periode: {
                fom: '2021-03-15',
                tom: '2021-03-15',
              },
              utbetalingsgrad: 100,
              utfall: {
                kode: 'INNVILGET',
                kodeverk: 'UTTAK_UTFALL_TYPE',
              },
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
              utfall: {
                kode: 'INNVILGET',
                kodeverk: 'UTTAK_UTFALL_TYPE',
              },
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
              utfall: {
                kode: 'INNVILGET',
                kodeverk: 'UTTAK_UTFALL_TYPE',
              },
            },
            {
              periode: {
                fom: '2021-03-26',
                tom: '2021-03-26',
              },
              utbetalingsgrad: 100,
              utfall: {
                kode: 'INNVILGET',
                kodeverk: 'UTTAK_UTFALL_TYPE',
              },
            },
            {
              periode: {
                fom: '2021-03-27',
                tom: '2021-03-27',
              },
              utbetalingsgrad: 100,
              utfall: {
                kode: 'AVSLÅTT',
                kodeverk: 'UTTAK_UTFALL_TYPE',
              },
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
};

export default {
  title: 'prosess/prosess-tilkjent-ytelse',
  component: TilkjentYtelseProsessIndex,
  decorators: [withKnobs, withReduxProvider],
};

export const visUtenAksjonspunkt = () => (
  <TilkjentYtelseProsessIndex
    behandling={object('behandling', behandling)}
    beregningresultat={beregningsresultat}
    fagsak={fagsak}
    aksjonspunkter={[]}
    alleKodeverk={alleKodeverk}
    isReadOnly={boolean('isReadOnly', false)}
    submitCallback={action('button-click')}
    readOnlySubmitButton={boolean('readOnly', true)}
  />
);

export const visÅpentAksjonspunkt = () => (
  <TilkjentYtelseProsessIndex
    behandling={object('behandling', behandling)}
    beregningresultat={beregningsresultat}
    fagsak={fagsak}
    aksjonspunkter={[
      {
        definisjon: {
          kode: aksjonspunktCodes.VURDER_TILBAKETREKK,
        },
        status: {
          kode: aksjonspunktStatus.OPPRETTET,
        },
      },
    ]}
    alleKodeverk={alleKodeverk}
    isReadOnly={boolean('isReadOnly', false)}
    submitCallback={action('button-click')}
    readOnlySubmitButton={boolean('readOnly', true)}
  />
);
