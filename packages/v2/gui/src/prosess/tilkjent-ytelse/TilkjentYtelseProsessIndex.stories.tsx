import { aksjonspunktkodeDefinisjonType } from '@k9-sak-web/backend/k9sak/kodeverk/AksjonspunktkodeDefinisjon.js';
import { aksjonspunktStatus } from '@k9-sak-web/backend/k9sak/kodeverk/AksjonspunktStatus.js';
import { aktivitetStatusType } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/AktivitetStatus.js';
import { behandlingType } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/BehandlingType.js';
import { inntektskategorier } from '@k9-sak-web/backend/k9sak/kodeverk/Inntektskategori.js';
import { KodeverkProvider } from '@k9-sak-web/gui/kodeverk/index.js';
import alleKodeverkV2 from '@k9-sak-web/lib/kodeverk/mocks/alleKodeverkV2.json';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent } from '@storybook/test';
import { asyncAction } from '../../storybook/asyncAction';
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

const meta = {
  title: 'prosess/prosess-tilkjent-ytelse-v2',
  component: TilkjentYtelseProsessIndex,
} satisfies Meta<typeof TilkjentYtelseProsessIndex>;

type Story = StoryObj<typeof meta>;

export const VisUtenAksjonspunkt: Story = {
  args: {
    isReadOnly: false,
    readOnlySubmitButton: true,
    beregningsresultat,
    aksjonspunkter: [],
    submitCallback: asyncAction('button-click'),
    arbeidsgiverOpplysningerPerId,
    personopplysninger: { aktoerId: '1', fnr: '12345678901' },
  },
  play: async ({ canvas }) => {
    expect(canvas.queryByRole('button', { name: 'Bekreft og fortsett' })).not.toBeInTheDocument();
  },
  render: props => <TilkjentYtelseProsessIndex {...props} />,
};

export const VisÅpentAksjonspunktTilbaketrekk: Story = {
  args: {
    isReadOnly: false,
    readOnlySubmitButton: true,
    beregningsresultat,
    aksjonspunkter: [
      {
        definisjon: aksjonspunktkodeDefinisjonType.VURDER_TILBAKETREKK, // kodeverk: ''
        status: aksjonspunktStatus.OPPRETTET, // kodeverk: ''
      },
    ],
    submitCallback: asyncAction('button-click'),
    arbeidsgiverOpplysningerPerId,
    personopplysninger: { aktoerId: '1', fnr: '12345678901' },
  },
  play: async ({ canvas }) => {
    it('Skal vise skjemaelementer for tilbaketrekk', async () => {
      expect(canvas.getByRole('heading', { name: 'Tilkjent ytelse' })).toBeInTheDocument();
      expect(
        canvas.getByText(
          'Pleiepengene er utbetalt til søker, arbeidsgiver krever nå refusjon fra startdato av pleiepengene. Vurder om beløpet som er feilutbetalt skal tilbakekreves fra søker eller om dette er en sak mellom arbeidstaker og arbeidsgiver.',
        ),
      ).toBeInTheDocument();
      expect(canvas.getByRole('button', { name: 'Bekreft og fortsett' })).toBeInTheDocument();
      expect(canvas.getByRole('radio', { name: 'Tilbakekrev fra søker' })).toBeInTheDocument();
      expect(canvas.getByRole('radio', { name: 'Ikke tilbakekrev fra søker' })).toBeInTheDocument();
      expect(canvas.getByRole('textbox', { name: 'Vurdering' })).toBeInTheDocument();
    });
  },
  render: props => <TilkjentYtelseProsessIndex {...props} />,
};

export const VisÅpentAksjonspunktManuellTilkjentYtelse: Story = {
  args: {
    isReadOnly: false,
    readOnlySubmitButton: true,
    beregningsresultat,
    aksjonspunkter: [
      {
        definisjon: aksjonspunktkodeDefinisjonType.MANUELL_TILKJENT_YTELSE, // kodeverk: ''
        status: aksjonspunktStatus.OPPRETTET, // kodeverk: ''
      },
    ],
    submitCallback: asyncAction('button-click'),
    arbeidsgiverOpplysningerPerId,
    personopplysninger: { aktoerId: '1', fnr: '12345678901' },
  },
  play: async ({ canvas }) => {
    expect(canvas.getByRole('button', { name: 'Bekreft og fortsett' })).toBeInTheDocument();
    expect(canvas.getByRole('button', { name: 'Legg til ny periode' })).toBeInTheDocument();
    expect(canvas.queryByText('Ny periode')).not.toBeInTheDocument();
    await userEvent.click(canvas.getByRole('button', { name: 'Legg til ny periode' }));
    expect(canvas.getByText('Ny periode')).toBeInTheDocument();
    expect(canvas.getByRole('button', { name: 'Avbryt' })).toBeInTheDocument();
  },
  render: props => (
    <KodeverkProvider
      behandlingType={behandlingType.FØRSTEGANGSSØKNAD}
      kodeverk={alleKodeverkV2}
      klageKodeverk={{}}
      tilbakeKodeverk={{}}
    >
      <TilkjentYtelseProsessIndex {...props} />
    </KodeverkProvider>
  ),
};

export default meta;
