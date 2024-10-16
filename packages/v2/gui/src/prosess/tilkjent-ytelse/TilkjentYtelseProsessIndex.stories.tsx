import { aksjonspunktkodeDefinisjonType } from '@k9-sak-web/backend/k9sak/kodeverk/AksjonspunktkodeDefinisjon.js';
import { aksjonspunktStatus } from '@k9-sak-web/backend/k9sak/kodeverk/AksjonspunktStatus.js';
import { aktivitetStatusType } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/AktivitetStatus.js';
import { behandlingType } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/BehandlingType.js';
import { inntektskategorier } from '@k9-sak-web/backend/k9sak/kodeverk/Inntektskategori.js';
import { KodeverkProvider } from '@k9-sak-web/gui/kodeverk/index.js';
import alleKodeverkV2 from '@k9-sak-web/lib/kodeverk/mocks/alleKodeverkV2.json';
import { action } from '@storybook/addon-actions';
import TilkjentYtelseProsessIndex from './TilkjentYtelseProsessIndex';
import type { BeregningsresultatMedUtbetaltePeriodeDto } from './types/BeregningsresultatMedUtbetaltePeriode';

const beregningsresultat: BeregningsresultatMedUtbetaltePeriodeDto = {
  opphoersdato: '2021-03-27',
  perioder: [
    {
      andeler: [
        {
          aktivitetStatus: aktivitetStatusType.AT, // kodeverk: 'AKTIVITET_STATUS'
          inntektskategori: inntektskategorier.ARBEIDSTAKER, // kodeverk: 'INNTEKTSKATEGORI'
          arbeidsgiverOrgnr: '123456789',
          eksternArbeidsforholdId: '',
          refusjon: 990,
          tilSoker: 549,
          utbetalingsgrad: 100,
        },
        {
          aktivitetStatus: aktivitetStatusType.AT, // kodeverk: 'AKTIVITET_STATUS'
          eksternArbeidsforholdId: '',
          inntektskategori: inntektskategorier.ARBEIDSTAKER, // kodeverk: 'INNTEKTSKATEGORI'
          arbeidsgiverOrgnr: '234567890',
          refusjon: 1090,
          tilSoker: 0,
          utbetalingsgrad: 100,
        },
      ],
      dagsats: 1142,
      fom: '2021-03-12',
      tom: '2021-03-19',
    },
    {
      andeler: [
        {
          aktivitetStatus: aktivitetStatusType.AT, // kodeverk: 'AKTIVITET_STATUS'
          inntektskategori: inntektskategorier.ARBEIDSTAKER, // kodeverk: 'INNTEKTSKATEGORI'
          arbeidsgiverOrgnr: '123456789',
          eksternArbeidsforholdId: '',
          refusjon: 45,
          tilSoker: 990,
          utbetalingsgrad: 100,
        },
      ],
      dagsats: 1192,
      fom: '2021-03-22',
      tom: '2021-03-27',
    },
  ],
  skalHindreTilbaketrekk: false,
};

const arbeidsgiverOpplysningerPerId = {
  12345678: {
    navn: 'BEDRIFT1 AS',
    erPrivatPerson: false,
    identifikator: '12345678',
  },
};

export default {
  title: 'prosess/prosess-tilkjent-ytelse-v2',
  component: TilkjentYtelseProsessIndex,
};

export const visUtenAksjonspunkt = () => (
  <TilkjentYtelseProsessIndex
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
    aksjonspunkter={[
      {
        definisjon: aksjonspunktkodeDefinisjonType.VURDER_TILBAKETREKK, // kodeverk: ''
        status: aksjonspunktStatus.OPPRETTET, // kodeverk: ''
      },
    ]}
    submitCallback={action('button-click') as (data: any) => Promise<any>}
    arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
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
      aksjonspunkter={[
        {
          definisjon: aksjonspunktkodeDefinisjonType.MANUELL_TILKJENT_YTELSE, // kodeverk: ''
          status: aksjonspunktStatus.OPPRETTET, // kodeverk: ''
        },
      ]}
      submitCallback={action('button-click') as (data: any) => Promise<any>}
      arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
      isReadOnly={false}
      readOnlySubmitButton
      personopplysninger={{ aktoerId: '1', fnr: '12345678901' }}
    />
  </KodeverkProvider>
);
