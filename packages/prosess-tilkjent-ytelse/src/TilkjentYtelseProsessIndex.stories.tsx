import { action } from '@storybook/addon-actions';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import alleKodeverk from '@k9-sak-web/gui/storybook/mocks/alleKodeverk.json';
import { Aksjonspunkt, Behandling, BeregningsresultatUtbetalt } from '@k9-sak-web/types';
import TilkjentYtelseProsessIndex from './TilkjentYtelseProsessIndex';

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
};

export const visUtenAksjonspunkt = args => (
  <TilkjentYtelseProsessIndex
    beregningsresultat={beregningsresultat}
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

export const visÅpentAksjonspunktTilbaketrekk = args => (
  <TilkjentYtelseProsessIndex
    beregningsresultat={beregningsresultat}
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
    submitCallback={action('button-click')}
    arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
    {...args}
  />
);

visÅpentAksjonspunktTilbaketrekk.args = {
  behandling,
  isReadOnly: false,
  readOnlySubmitButton: true,
};

export const visÅpentAksjonspunktManuellTilkjentYtelse = args => (
  <TilkjentYtelseProsessIndex
    beregningsresultat={beregningsresultat}
    aksjonspunkter={
      [
        {
          definisjon: {
            kode: aksjonspunktCodes.MANUELL_TILKJENT_YTELSE,
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
    submitCallback={action('button-click')}
    arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
    {...args}
  />
);

visÅpentAksjonspunktManuellTilkjentYtelse.args = {
  behandling,
  isReadOnly: false,
  readOnlySubmitButton: true,
};
