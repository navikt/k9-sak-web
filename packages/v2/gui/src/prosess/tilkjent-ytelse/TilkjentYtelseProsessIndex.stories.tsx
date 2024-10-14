import { aksjonspunktStatus } from '@k9-sak-web/backend/k9sak/kodeverk/AksjonspunktStatus.js';
import { behandlingType } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/BehandlingType.js';
import type { Inntektskategori } from '@k9-sak-web/backend/k9sak/kodeverk/Inntektskategori.js';
import { KodeverkProvider } from '@k9-sak-web/gui/kodeverk/index.js';
import alleKodeverkV2 from '@k9-sak-web/lib/kodeverk/mocks/alleKodeverkV2.json';
import AksjonspunktCodes from '@k9-sak-web/lib/kodeverk/types/AksjonspunktCodes.js';
import type {
  AksjonspunktDto,
  BehandlingDto,
  BeregningsresultatPeriodeAndelDto,
  UttakDto,
} from '@navikt/k9-sak-typescript-client';
import { action } from '@storybook/addon-actions';
import TilkjentYtelseProsessIndex from './TilkjentYtelseProsessIndex';

const behandling = {
  id: 1,
  versjon: 1,
} as BehandlingDto;

const beregningsresultat = {
  opphoersdato: '2021-03-27',
  perioder: [
    {
      andeler: [
        {
          aktivitetStatus: 'AT' as BeregningsresultatPeriodeAndelDto['aktivitetStatus'], // kodeverk: 'AKTIVITET_STATUS'
          inntektskategori: 'ARBEIDSTAKER' as Inntektskategori, // kodeverk: 'INNTEKTSKATEGORI'
          aktørId: null,
          arbeidsforholdId: null,
          arbeidsforholdType: '-' as BeregningsresultatPeriodeAndelDto['arbeidsforholdType'], // kodeverk: 'OPPTJENING_AKTIVITET_TYPE'
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
              utfall: 'INNVILGET' as UttakDto['utfall'], // kodeverk: 'UTTAK_UTFALL'
            },
            {
              periode: {
                fom: '2021-03-15',
                tom: '2021-03-15',
              },
              utbetalingsgrad: 100,
              utfall: 'INNVILGET' as UttakDto['utfall'], // kodeverk: 'UTTAK_UTFALL'
            },
          ],
        },
        {
          aktivitetStatus: 'AT' as BeregningsresultatPeriodeAndelDto['aktivitetStatus'], // kodeverk: 'AKTIVITET_STATUS'
          inntektskategori: 'ARBEIDSTAKER' as Inntektskategori, // kodeverk: 'INNTEKTSKATEGORI'
          aktørId: null,
          arbeidsforholdId: null,
          arbeidsforholdType: '-' as BeregningsresultatPeriodeAndelDto['arbeidsforholdType'], // kodeverk: 'OPPTJENING_AKTIVITET_TYPE'
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
              utfall: 'INNVILGET' as UttakDto['utfall'],
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
          aktivitetStatus: 'AT' as BeregningsresultatPeriodeAndelDto['aktivitetStatus'], // kodeverk: 'AKTIVITET_STATUS'
          inntektskategori: 'ARBEIDSTAKER' as Inntektskategori, // kodeverk: 'INNTEKTSKATEGORI'
          aktørId: null,
          arbeidsforholdId: null,
          arbeidsforholdType: '-' as BeregningsresultatPeriodeAndelDto['arbeidsforholdType'], // kodeverk: 'OPPTJENING_AKTIVITET_TYPE'
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
              utfall: 'INNVILGET' as UttakDto['utfall'],
            },
            {
              periode: {
                fom: '2021-03-26',
                tom: '2021-03-26',
              },
              utbetalingsgrad: 100,
              utfall: 'INNVILGET' as UttakDto['utfall'],
            },
            {
              periode: {
                fom: '2021-03-27',
                tom: '2021-03-27',
              },
              utbetalingsgrad: 100,
              utfall: 'AVSLÅTT' as UttakDto['utfall'],
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
};

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
  title: 'prosess/prosess-tilkjent-ytelse-v2',
  component: TilkjentYtelseProsessIndex,
};

export const visUtenAksjonspunkt = () => (
  <TilkjentYtelseProsessIndex
    behandling={behandling}
    isReadOnly={false}
    readOnlySubmitButton
    beregningsresultat={beregningsresultat}
    aksjonspunkter={[]}
    submitCallback={action('button-click') as (data: any) => Promise<any>}
    arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
    personopplysninger={{ aktoerId: '1', fnr: '12345678901' }}
  />
);

export const visÅpentAksjonspunktTilbaketrekk = () => (
  <TilkjentYtelseProsessIndex
    beregningsresultat={beregningsresultat}
    aksjonspunkter={
      [
        {
          definisjon: AksjonspunktCodes.VURDER_TILBAKETREKK, // kodeverk: ''
          status: aksjonspunktStatus.OPPRETTET, // kodeverk: ''
        },
      ] as AksjonspunktDto[]
    }
    submitCallback={action('button-click') as (data: any) => Promise<any>}
    arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
    behandling={behandling}
    isReadOnly={false}
    readOnlySubmitButton
    personopplysninger={{ aktoerId: '1', fnr: '12345678901' }}
  />
);

export const visÅpentAksjonspunktManuellTilkjentYtelse = () => (
  <KodeverkProvider
    behandlingType={behandlingType.FØRSTEGANGSSØKNAD}
    kodeverk={alleKodeverkV2}
    klageKodeverk={{}}
    tilbakeKodeverk={{}}
  >
    <TilkjentYtelseProsessIndex
      beregningsresultat={beregningsresultat}
      aksjonspunkter={
        [
          {
            definisjon: AksjonspunktCodes.MANUELL_TILKJENT_YTELSE, // kodeverk: ''
            status: aksjonspunktStatus.OPPRETTET, // kodeverk: ''
          },
        ] as AksjonspunktDto[]
      }
      submitCallback={action('button-click') as (data: any) => Promise<any>}
      arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
      behandling={behandling}
      isReadOnly={false}
      readOnlySubmitButton
      personopplysninger={{ aktoerId: '1', fnr: '12345678901' }}
    />
  </KodeverkProvider>
);
