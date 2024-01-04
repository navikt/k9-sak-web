import renderers from '../util/renderers';
import ContainerContract from '../types/ContainerContract';
import '@navikt/ds-css';
import '@navikt/ft-plattform-komponenter/dist/style.css';

interface ExtendedWindow extends Window {
  renderUttakApp: (id: string, contract: ContainerContract) => void;
}

const data = {
  aktivBehandlingUuid: '123456',
  uttaksperioder: {
    '2021-03-01/2021-03-08': {
      utfall: 'OPPFYLT',
      uttaksgrad: 50.0,
      utbetalingsgrader: [
        {
          arbeidsforhold: {
            type: 'AT',
            organisasjonsnummer: '123456',
            aktørId: null,
            arbeidsforholdId: null,
          },
          normalArbeidstid: 'PT7H30M',
          faktiskArbeidstid: 'PT2H37M',
          utbetalingsgrad: 50.0,
        },
      ],
      søkersTapteArbeidstid: 65.11,
      årsaker: ['GRADERT_MOT_TILSYN'],
      inngangsvilkår: {
        FP_VK_2: 'OPPFYLT',
        FP_VK_3: 'OPPFYLT',
        K9_VK_1: 'OPPFYLT',
        K9_VK_3: 'OPPFYLT',
        FP_VK_21: 'OPPFYLT',
        FP_VK_23: 'OPPFYLT',
        FP_VK_34: 'OPPFYLT',
        K9_VK_2_a: 'OPPFYLT',
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
      annenPart: 'MED_ANDRE',
      endringsstatus: 'NY',
    },
    '2021-03-09/2021-03-22': {
      utfall: 'OPPFYLT',
      uttaksgrad: 65.0,
      utbetalingsgrader: [
        {
          arbeidsforhold: {
            type: 'AT',
            organisasjonsnummer: '123456',
            aktørId: null,
            arbeidsforholdId: null,
          },
          normalArbeidstid: 'PT7H30M',
          faktiskArbeidstid: 'PT9H37M',
          utbetalingsgrad: 65.0,
        },
      ],
      søkersTapteArbeidstid: 65.11,
      årsaker: ['AVKORTET_MOT_INNTEKT'],
      inngangsvilkår: {
        FP_VK_2: 'OPPFYLT',
        FP_VK_3: 'OPPFYLT',
        K9_VK_1: 'OPPFYLT',
        K9_VK_3: 'OPPFYLT',
        FP_VK_21: 'OPPFYLT',
        FP_VK_23: 'OPPFYLT',
        FP_VK_34: 'OPPFYLT',
        K9_VK_2_a: 'OPPFYLT',
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
      annenPart: 'ALENE',
      endringsstatus: 'ENDRET',
      utenlandsoppholdÅrsak: 'INGEN',
    },
    '2021-03-23/2021-03-31': {
      utfall: 'IKKE_OPPFYLT',
      uttaksgrad: 0.0,
      utbetalingsgrader: [
        {
          arbeidsforhold: {
            type: 'AT',
            organisasjonsnummer: '123456',
            aktørId: null,
            arbeidsforholdId: null,
          },
          normalArbeidstid: 'PT7H30M',
          faktiskArbeidstid: 'PT2H37M',
          utbetalingsgrad: 0.0,
        },
      ],
      søkersTapteArbeidstid: 65.11,
      årsaker: ['FOR_LAV_ØNSKET_UTTAKSGRAD', 'INNGANGSVILKÅR_IKKE_OPPFYLT'],
      inngangsvilkår: {
        FP_VK_2: 'OPPFYLT',
        FP_VK_3: 'OPPFYLT',
        K9_VK_1: 'OPPFYLT',
        K9_VK_3: 'OPPFYLT',
        FP_VK_34: 'OPPFYLT',
        K9_VK_2_a: 'IKKE_OPPFYLT',
      },
      pleiebehov: 0.0,
      graderingMotTilsyn: null,
      knekkpunktTyper: [],
      kildeBehandlingUUID: '123456',
      annenPart: 'ALENE',
      endringsstatus: 'UENDRET',
    },
    '2021-04-01/2021-04-14': {
      utfall: 'IKKE_OPPFYLLT',
      uttaksgrad: 0.0,
      utbetalingsgrader: [
        {
          arbeidsforhold: {
            type: 'AT',
            organisasjonsnummer: '123456',
            aktørId: null,
            arbeidsforholdId: null,
          },
          normalArbeidstid: 'PT7H30M',
          faktiskArbeidstid: 'PT2H37M',
          utbetalingsgrad: 0.0,
        },
      ],
      søkersTapteArbeidstid: 65.11,
      årsaker: ['FOR_MANGE_DAGER_UTENLANDSOPPHOLD'],
      inngangsvilkår: {
        FP_VK_2: 'OPPFYLT',
        FP_VK_3: 'OPPFYLT',
        K9_VK_1: 'OPPFYLT',
        K9_VK_3: 'OPPFYLT',
        FP_VK_34: 'OPPFYLT',
        K9_VK_2_a: 'OPPFYLT',
      },
      pleiebehov: 0.0,
      graderingMotTilsyn: null,
      knekkpunktTyper: [],
      kildeBehandlingUUID: '123456',
      annenPart: 'ALENE',
      endringsstatus: 'UENDRET',
      utenlandsoppholdÅrsak: { landkode: 'BGD', årsak: 'INGEN' },
      utenlandsoppholdUtenÅrsak: true,
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
};

(window as Partial<ExtendedWindow>).renderUttakApp = async appId => {
  const { renderAppInSuccessfulState } = renderers;
  renderAppInSuccessfulState(appId, data);
};
