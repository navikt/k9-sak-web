import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { AnnenPart, Arbeidstype, Utfall, Årsaker } from '../constants';
import { Endringsstatus } from '../types';
import UttakContainer from './UttakContainer';

const meta: Meta<typeof UttakContainer> = {
  title: 'prosess/prosess-uttak',
  component: UttakContainer,
};

export default meta;
type Story = StoryObj<typeof UttakContainer>;

export const Uttak: Story = {
  args: {
    containerData: {
      aktivBehandlingUuid: '123456',
      uttaksperioder: {
        '2021-03-01/2021-03-08': {
          utfall: Utfall.OPPFYLT,
          uttaksgrad: 50.0,
          utbetalingsgrader: [
            {
              arbeidsforhold: {
                type: Arbeidstype.ARBEIDSTAKER,
                organisasjonsnummer: '123456',
                aktørId: null,
                arbeidsforholdId: null,
              },
              normalArbeidstid: 'PT7H30M',
              faktiskArbeidstid: 'PT2H37M',
              utbetalingsgrad: 50.0,
              tilkommet: false,
            },
          ],
          søkersTapteArbeidstid: 65.11,
          årsaker: [Årsaker.GRADERT_MOT_TILSYN],
          inngangsvilkår: {
            FP_VK_2: Utfall.OPPFYLT,
            FP_VK_3: Utfall.OPPFYLT,
            K9_VK_1: Utfall.OPPFYLT,
            K9_VK_3: Utfall.OPPFYLT,
            FP_VK_21: Utfall.OPPFYLT,
            FP_VK_23: Utfall.OPPFYLT,
            FP_VK_34: Utfall.OPPFYLT,
            K9_VK_2_a: Utfall.OPPFYLT,
          },
          pleiebehov: 100.0,
          graderingMotTilsyn: {
            etablertTilsyn: 0.0,
            overseEtablertTilsynÅrsak: null,
            andreSøkeresTilsyn: 50.0,
            tilgjengeligForSøker: 50.0,
          },
          knekkpunktTyper: [],
          kildeBehandlingUUID: '123456',
          endringsstatus: 'NY' as Endringsstatus,
          annenPart: AnnenPart.MED_ANDRE,
          manueltOverstyrt: false,
        },
        '2021-03-10/2021-03-22': {
          utfall: Utfall.OPPFYLT,
          uttaksgrad: 65.0,
          utbetalingsgrader: [
            {
              arbeidsforhold: {
                type: Arbeidstype.ARBEIDSTAKER,
                organisasjonsnummer: '123456',
                aktørId: null,
                arbeidsforholdId: null,
              },
              normalArbeidstid: 'PT7H30M',
              faktiskArbeidstid: 'PT9H37M',
              utbetalingsgrad: 65.0,
              tilkommet: false,
            },
          ],
          søkersTapteArbeidstid: 65.11,
          årsaker: [Årsaker.AVKORTET_MOT_INNTEKT],
          inngangsvilkår: {
            FP_VK_2: Utfall.OPPFYLT,
            FP_VK_3: Utfall.OPPFYLT,
            K9_VK_1: Utfall.OPPFYLT,
            K9_VK_3: Utfall.OPPFYLT,
            FP_VK_21: Utfall.OPPFYLT,
            FP_VK_23: Utfall.OPPFYLT,
            FP_VK_34: Utfall.OPPFYLT,
            K9_VK_2_a: Utfall.OPPFYLT,
          },
          pleiebehov: 100.0,
          graderingMotTilsyn: {
            etablertTilsyn: 0.0,
            overseEtablertTilsynÅrsak: null,
            andreSøkeresTilsyn: 0.0,
            tilgjengeligForSøker: 100.0,
          },
          knekkpunktTyper: ['ANNEN_PARTS_UTTAK'],
          kildeBehandlingUUID: '123456',
          annenPart: AnnenPart.ALENE,
          endringsstatus: 'ENDRET' as Endringsstatus,
          manueltOverstyrt: false,
        },
        '2021-03-23/2021-03-31': {
          utfall: Utfall.IKKE_OPPFYLT,
          uttaksgrad: 0.0,
          utbetalingsgrader: [
            {
              arbeidsforhold: {
                type: Arbeidstype.ARBEIDSTAKER,
                organisasjonsnummer: '123456',
                aktørId: null,
                arbeidsforholdId: null,
              },
              normalArbeidstid: 'PT7H30M',
              faktiskArbeidstid: 'PT2H37M',
              utbetalingsgrad: 0.0,
              tilkommet: false,
            },
          ],
          søkersTapteArbeidstid: 65.11,
          årsaker: [Årsaker.FOR_LAV_ØNSKET_UTTAKSGRAD, Årsaker.INNGANGSVILKÅR_IKKE_OPPFYLT],
          inngangsvilkår: {
            FP_VK_2: Utfall.OPPFYLT,
            FP_VK_3: Utfall.OPPFYLT,
            K9_VK_1: Utfall.OPPFYLT,
            K9_VK_3: Utfall.OPPFYLT,
            FP_VK_34: Utfall.OPPFYLT,
            K9_VK_2_a: Utfall.IKKE_OPPFYLT,
            FP_VK_21: Utfall.OPPFYLT,
            FP_VK_23: Utfall.OPPFYLT,
          },
          pleiebehov: 0.0,
          graderingMotTilsyn: null,
          knekkpunktTyper: [],
          kildeBehandlingUUID: '123456',
          annenPart: AnnenPart.ALENE,
          endringsstatus: 'UENDRET' as Endringsstatus,
          manueltOverstyrt: false,
        },
        '2021-04-02/2021-04-14': {
          utfall: Utfall.IKKE_OPPFYLT,
          uttaksgrad: 0.0,
          utbetalingsgrader: [
            {
              arbeidsforhold: {
                type: Arbeidstype.ARBEIDSTAKER,
                organisasjonsnummer: '123456',
                aktørId: null,
                arbeidsforholdId: null,
              },
              normalArbeidstid: 'PT7H30M',
              faktiskArbeidstid: 'PT2H37M',
              utbetalingsgrad: 0.0,
              tilkommet: false,
            },
          ],
          søkersTapteArbeidstid: 65.11,
          årsaker: [Årsaker.FOR_MANGE_DAGER_UTENLANDSOPPHOLD],
          inngangsvilkår: {
            FP_VK_2: Utfall.OPPFYLT,
            FP_VK_3: Utfall.OPPFYLT,
            K9_VK_1: Utfall.OPPFYLT,
            K9_VK_3: Utfall.OPPFYLT,
            FP_VK_34: Utfall.OPPFYLT,
            K9_VK_2_a: Utfall.OPPFYLT,
            FP_VK_21: Utfall.OPPFYLT,
            FP_VK_23: Utfall.OPPFYLT,
          },
          pleiebehov: 0.0,
          graderingMotTilsyn: null,
          knekkpunktTyper: [],
          kildeBehandlingUUID: '123456',
          annenPart: AnnenPart.ALENE,
          endringsstatus: 'UENDRET' as Endringsstatus,
          utenlandsoppholdUtenÅrsak: true,
          manueltOverstyrt: false,
        },
      },
      arbeidsforhold: {
        123456: {
          identifikator: '123456',
          navn: 'BEDRIFT AS',
          fødselsdato: null,
        },
      },
      aksjonspunktkoder: [],
      kodeverkUtenlandsoppholdÅrsak: [
        {
          kode: 'INGEN',
          navn: 'Ingen årsak til utenlandsoppholdet er oppgitt, perioden telles i 8 uker',
          kodeverk: 'UTENLANDSOPPHOLD_ÅRSAK',
        },
        {
          kode: 'BARNET_INNLAGT_I_HELSEINSTITUSJON_FOR_NORSK_OFFENTLIG_REGNING',
          navn: 'Barnet/den pleietrengende er innlagt i helseinstitusjon for norsk offentlig regning (mottar ytelse som i Norge, telles ikke i 8 uker)',
          kodeverk: 'UTENLANDSOPPHOLD_ÅRSAK',
        },
        {
          kode: 'BARNET_INNLAGT_I_HELSEINSTITUSJON_DEKKET_ETTER_AVTALE_MED_ET_ANNET_LAND_OM_TRYGD',
          navn: 'Barnet/den pleietrengende er innlagt i helseinstitusjon dekket etter avtale med annet land om trygd (mottar ytelse som i Norge, telles ikke i 8 uker)',
          kodeverk: 'UTENLANDSOPPHOLD_ÅRSAK',
        },
      ],
      utsattePerioder: [],
      løsAksjonspunktVurderDatoNyRegelUttak: undefined,
      virkningsdatoUttakNyeRegler: '',
      readOnly: false,
    },
  },
};

export const UttakMedInntektsgradering: Story = {
  args: {
    containerData: {
      aktivBehandlingUuid: '123456',
      uttaksperioder: {
        '2023-01-02/2023-01-31': {
          utfall: Utfall.OPPFYLT,
          uttaksgrad: 100,
          uttaksgradMedReduksjonGrunnetInntektsgradering: null,
          uttaksgradUtenReduksjonGrunnetInntektsgradering: 100,
          utbetalingsgrader: [
            {
              arbeidsforhold: {
                type: Arbeidstype.ARBEIDSTAKER,
                organisasjonsnummer: '111111111',
                aktørId: null,
                arbeidsforholdId: null,
              },
              normalArbeidstid: 'PT4H',
              faktiskArbeidstid: 'PT0S',
              utbetalingsgrad: 100,
              tilkommet: false,
            },
            {
              arbeidsforhold: {
                type: Arbeidstype.ARBEIDSTAKER,
                organisasjonsnummer: '222222222',
                aktørId: null,
                arbeidsforholdId: null,
              },
              normalArbeidstid: 'PT4H',
              faktiskArbeidstid: 'PT0S',
              utbetalingsgrad: 100,
              tilkommet: false,
            },
          ],
          søkersTapteArbeidstid: 100,
          oppgittTilsyn: 'PT7H30M',
          årsaker: [Årsaker.FULL_DEKNING],
          inngangsvilkår: {
            FP_VK_2: Utfall.OPPFYLT,
            FP_VK_3: Utfall.OPPFYLT,
            K9_VK_1: Utfall.OPPFYLT,
            K9_VK_3: Utfall.OPPFYLT,
            FP_VK_21: Utfall.OPPFYLT,
            FP_VK_23: Utfall.OPPFYLT,
            FP_VK_41: Utfall.OPPFYLT,
            K9_VK_2_a: Utfall.OPPFYLT,
          },
          pleiebehov: 200,
          graderingMotTilsyn: {
            etablertTilsyn: 0,
            overseEtablertTilsynÅrsak: null,
            andreSøkeresTilsyn: 0,
            andreSøkeresTilsynReberegnet: false,
            tilgjengeligForSøker: 100,
          },
          knekkpunktTyper: [],
          kildeBehandlingUUID: '630c98e1-f995-4e98-8699-8932d9a2c998',
          annenPart: AnnenPart.ALENE,
          nattevåk: null,
          beredskap: null,
          endringsstatus: 'NY',
          utenlandsoppholdUtenÅrsak: false,
          utenlandsopphold: {
            ErEøsLand: false,
            landkode: null,
            årsak: 'INGEN',
          },
          manueltOverstyrt: false,
          søkersTapteTimer: 'PT8H',
        },
        '2023-02-01/2023-04-28': {
          utfall: Utfall.OPPFYLT,
          uttaksgrad: 20,
          uttaksgradMedReduksjonGrunnetInntektsgradering: 20,
          uttaksgradUtenReduksjonGrunnetInntektsgradering: 100,
          utbetalingsgrader: [
            {
              arbeidsforhold: {
                type: Arbeidstype.ARBEIDSTAKER,
                organisasjonsnummer: '111111111',
                aktørId: null,
                arbeidsforholdId: null,
              },
              normalArbeidstid: 'PT4H',
              faktiskArbeidstid: 'PT0S',
              utbetalingsgrad: 100,
              tilkommet: false,
            },
            {
              arbeidsforhold: {
                type: Arbeidstype.ARBEIDSTAKER,
                organisasjonsnummer: '222222222',
                aktørId: null,
                arbeidsforholdId: null,
              },
              normalArbeidstid: 'PT4H',
              faktiskArbeidstid: 'PT0S',
              utbetalingsgrad: 100,
              tilkommet: false,
            },
            {
              arbeidsforhold: {
                type: Arbeidstype.ARBEIDSTAKER,
                organisasjonsnummer: '333333333',
                aktørId: null,
                arbeidsforholdId: null,
              },
              normalArbeidstid: 'PT4H',
              faktiskArbeidstid: 'PT4H',
              utbetalingsgrad: 0,
              tilkommet: true,
            },
          ],
          søkersTapteArbeidstid: 100,
          oppgittTilsyn: 'PT7H30M',
          årsaker: [Årsaker.AVKORTET_MOT_INNTEKT],
          inngangsvilkår: {
            FP_VK_2: Utfall.OPPFYLT,
            FP_VK_3: Utfall.OPPFYLT,
            K9_VK_1: Utfall.OPPFYLT,
            K9_VK_3: Utfall.OPPFYLT,
            FP_VK_21: Utfall.OPPFYLT,
            FP_VK_23: Utfall.OPPFYLT,
            FP_VK_41: Utfall.OPPFYLT,
            K9_VK_2_a: Utfall.OPPFYLT,
          },
          pleiebehov: 200,
          graderingMotTilsyn: {
            etablertTilsyn: 0,
            overseEtablertTilsynÅrsak: null,
            andreSøkeresTilsyn: 0,
            andreSøkeresTilsynReberegnet: false,
            tilgjengeligForSøker: 100,
          },
          knekkpunktTyper: [],
          kildeBehandlingUUID: '630c98e1-f995-4e98-8699-8932d9a2c998',
          annenPart: AnnenPart.ALENE,
          nattevåk: null,
          beredskap: null,
          endringsstatus: 'NY',
          utenlandsoppholdUtenÅrsak: false,
          utenlandsopphold: {
            ErEøsLand: false,
            landkode: null,
            årsak: 'INGEN',
          },
          manueltOverstyrt: false,
          søkersTapteTimer: 'PT8H',
        },
      },
      inntektsgraderinger: [
        {
          periode: {
            fom: '2023-02-01',
            tom: '2023-04-28',
          },
          inntektsforhold: [
            {
              type: 'AT',
              arbeidsgiverIdentifikator: '111111111',
              arbeidstidprosent: 0,
              løpendeInntekt: 0,
              bruttoInntekt: 480000,
              erNytt: false,
            },
            {
              type: 'AT',
              arbeidsgiverIdentifikator: '333333333',
              arbeidstidprosent: 100,
              løpendeInntekt: 600000,
              bruttoInntekt: 600000,
              erNytt: true,
            },
            {
              type: 'AT',
              arbeidsgiverIdentifikator: '222222222',
              arbeidstidprosent: 0,
              løpendeInntekt: 0,
              bruttoInntekt: 240000,
              erNytt: false,
            },
          ],
          beregningsgrunnlag: 720000,
          løpendeInntekt: 600000,
          bortfaltInntekt: 120000,
          reduksjonsProsent: 80,
          graderingsProsent: 20,
        },
      ],
      arbeidsforhold: {
        '111111111': {
          identifikator: '111111111',
          personIdentifikator: null,
          navn: 'BEDRIFT 1 AS',
          fødselsdato: null,
          arbeidsforholdreferanser: [
            {
              internArbeidsforholdId: '724b3d31-c308-4ae9-9067-fd989b1881c4',
              eksternArbeidsforholdId: 'ARB001',
            },
          ],
        },
        '222222222': {
          identifikator: '222222222',
          personIdentifikator: null,
          navn: 'BEDRIFT 2 AS',
          fødselsdato: null,
          arbeidsforholdreferanser: [
            {
              internArbeidsforholdId: '4b426e33-aae0-4f04-b7a6-3fb70004b772',
              eksternArbeidsforholdId: 'ARB002',
            },
          ],
        },
        '333333333': {
          identifikator: '333333333',
          personIdentifikator: null,
          navn: 'BEDRIFT 3 AS',
          fødselsdato: null,
          arbeidsforholdreferanser: [
            {
              internArbeidsforholdId: '3f56315d-1f35-4657-b859-7c64b2ecdb23',
              eksternArbeidsforholdId: 'ARB003',
            },
          ],
        },
      },
      aksjonspunktkoder: [],
      kodeverkUtenlandsoppholdÅrsak: [
        {
          kode: 'BARNET_INNLAGT_I_HELSEINSTITUSJON_DEKKET_ETTER_AVTALE_MED_ET_ANNET_LAND_OM_TRYGD',
          kodeverk: 'UTENLANDSOPPHOLD_ÅRSAK',
          navn: 'Barnet/den pleietrengende er innlagt i helseinstitusjon dekket etter avtale med annet land om trygd (mottar ytelse som i Norge, telles ikke i 8 uker)',
        },
        {
          kode: 'BARNET_INNLAGT_I_HELSEINSTITUSJON_FOR_NORSK_OFFENTLIG_REGNING',
          kodeverk: 'UTENLANDSOPPHOLD_ÅRSAK',
          navn: 'Barnet/den pleietrengende er innlagt i helseinstitusjon for norsk offentlig regning (mottar ytelse som i Norge, telles ikke i 8 uker)',
        },
        {
          kode: 'INGEN',
          kodeverk: 'UTENLANDSOPPHOLD_ÅRSAK',
          navn: 'Ingen årsak til utenlandsoppholdet er oppgitt, perioden telles i 8 uker',
        },
      ],
      utsattePerioder: [],
      løsAksjonspunktVurderDatoNyRegelUttak: undefined,
      virkningsdatoUttakNyeRegler: null,
      readOnly: false,
    },
  },
  decorators: [],
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('skal vise gradering mot arbeidsinntekt når det gir lavest pleiepengegrad', async () => {
      const tabell = within(await canvas.getByRole('table'));
      const rader = await tabell.getAllByRole('row');
      const førstePeriode = await canvas.getByRole('row', {
        name: '5-17 01.02.2023 - 28.04.2023 200% Søker 20 % Ny denne behandlingen',
      });
      const andrePeriode = await canvas.getByRole('row', {
        name: '5-17 01.02.2023 - 28.04.2023 200% Søker 20 % Ny denne behandlingen',
      });
      const detaljer = rader[2];
      const inntekt = within(await tabell.getByTitle('Gradering mot inntekt'));

      await expect(rader.length, 'Skal ha fem rader i tabellen').toEqual(5);
      await expect(førstePeriode, 'Skal ha en rad med første periode').toBeInTheDocument();
      await expect(andrePeriode, 'skal ha en rad med andre peridoe').toBeInTheDocument();
      await expect(detaljer, 'Detaljer skal ikke være synlige').not.toBeVisible();

      await userEvent.click(førstePeriode);
      await expect(detaljer).toBeVisible();

      await expect(await inntekt.findByText('Beregningsgrunnlag: 720 000 kr')).toBeInTheDocument();
      await expect(await inntekt.findByText('Utbetalt lønn: 600 000 kr')).toBeInTheDocument();
      await expect(await inntekt.findByText('Tapt inntekt: 120 000 kr')).toBeInTheDocument();
      await expect(await inntekt.findByText('600 000 kr (utbetalt lønn) /')).toBeInTheDocument();
      await expect(
        (await inntekt.findAllByText('720 000 kr (beregningsgrunnlag)')).length,
        'Skal ha to forekomster av beregningsgrunnlag',
      ).toEqual(2);
      await expect(await inntekt.findByText('= 80 % reduksjon pga. utbetalt lønn')).toBeInTheDocument();
      await expect(await inntekt.findByText('= 20 % totalt inntektstap')).toBeInTheDocument();
    });
  },
};
