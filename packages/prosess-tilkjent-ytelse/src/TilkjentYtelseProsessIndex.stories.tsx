import { action } from '@storybook/addon-actions';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import { behandlingType } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/BehandlingType.js';
import { KodeverkProvider } from '@k9-sak-web/gui/kodeverk/index.js';
import alleKodeverk from '@k9-sak-web/gui/storybook/mocks/alleKodeverk.json';
import { AksjonspunktDto, BehandlingDto } from '@navikt/k9-sak-typescript-client';
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
          aktivitetStatus: 'AT', // kodeverk: 'AKTIVITET_STATUS'
          inntektskategori: 'ARBEIDSTAKER', // kodeverk: 'INNTEKTSKATEGORI'
          aktørId: null,
          arbeidsforholdId: null,
          arbeidsforholdType: '-', // kodeverk: 'OPPTJENING_AKTIVITET_TYPE'
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
              utfall: 'INNVILGET', // kodeverk: 'UTTAK_UTFALL'
            },
            {
              periode: {
                fom: '2021-03-15',
                tom: '2021-03-15',
              },
              utbetalingsgrad: 100,
              utfall: 'INNVILGET', // kodeverk: 'UTTAK_UTFALL'
            },
          ],
        },
        {
          aktivitetStatus: 'AT', // kodeverk: 'AKTIVITET_STATUS'
          inntektskategori: 'ARBEIDSTAKER', // kodeverk: 'INNTEKTSKATEGORI'
          aktørId: null,
          arbeidsforholdId: null,
          arbeidsforholdType: '-', // kodeverk: 'OPPTJENING_AKTIVITET_TYPE'
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
          aktivitetStatus: 'AT', // kodeverk: 'AKTIVITET_STATUS'
          inntektskategori: 'ARBEIDSTAKER', // kodeverk: 'INNTEKTSKATEGORI'
          aktørId: null,
          arbeidsforholdId: null,
          arbeidsforholdType: '-', // kodeverk: 'OPPTJENING_AKTIVITET_TYPE'
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
          definisjon: aksjonspunktCodes.VURDER_TILBAKETREKK, // kodeverk: ''
          status: aksjonspunktStatus.OPPRETTET, // kodeverk: ''
        },
      ] as AksjonspunktDto[]
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
  <KodeverkProvider
    behandlingType={behandlingType.FØRSTEGANGSSØKNAD}
    kodeverk={alleKodeverk}
    klageKodeverk={{}}
    tilbakeKodeverk={{}}
  >
    <TilkjentYtelseProsessIndex
      beregningsresultat={beregningsresultat}
      aksjonspunkter={
        [
          {
            definisjon: aksjonspunktCodes.MANUELL_TILKJENT_YTELSE, // kodeverk: ''
            status: aksjonspunktStatus.OPPRETTET, // kodeverk: ''
          },
        ] as AksjonspunktDto[]
      }
      submitCallback={action('button-click')}
      arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
      {...args}
    />
  </KodeverkProvider>
);

visÅpentAksjonspunktManuellTilkjentYtelse.args = {
  behandling,
  isReadOnly: false,
  readOnlySubmitButton: true,
};
