/* eslint-disable no-console */
import '@navikt/ds-css';
import Komponenter from '../types/Komponenter';
import renderers from '../util/renderers';

const state = {};

const getState = key => {
  try {
    return JSON.parse(state[key]);
  } catch {
    return null;
  }
};
const deleteState = key => {
  delete state[key];
};
const setState = (key, data) => {
  state[key] = JSON.stringify(data);
};

const formState = {
  getState,
  deleteState,
  setState,
};

const inputMocks = {
  korrigerePerioder: {
    visKomponent: 'KorrigerePerioder' as Komponenter.KORRIGERE_PERIODER,
    props: {
      behandlingsID: '123',
      aksjonspunktLost: false,
      lesemodus: false,
      informasjonTilLesemodus: {
        begrunnelse: 'Begrunnelse til lesemodus',
        vilkarOppfylt: true,
        antallDagerDelvisInnvilget: 10,
      },
      losAksjonspunkt: (fravaerGrunnetSmittevernhensynEllerStengt, begrunnelse, antallDagerDelvisInnvilget) =>
        console.log(fravaerGrunnetSmittevernhensynEllerStengt, begrunnelse, antallDagerDelvisInnvilget),
      konfliktMedArbeidsgiver: true,
      formState,
    },
  },
  vilkarKroniskSyktBarn: {
    visKomponent: 'VilkarKroniskSyktBarn' as Komponenter.VILKAR_KRONISK_SYKT_BARN,
    props: {
      behandlingsID: '123',
      aksjonspunktLost: true,
      lesemodus: true,
      soknadsdato: '2021-04-06',
      informasjonTilLesemodus: {
        begrunnelse: 'Begrunnelse til lesemodus',
        vilkarOppfylt: true,
        avslagsArsakErIkkeRiskioFraFravaer: true,
        fraDato: '2019-06-25',
      },
      losAksjonspunkt: (endreHarDokumentasjonOgFravaerRisiko, begrunnelse, avslagsKode, fraDato) =>
        console.log(endreHarDokumentasjonOgFravaerRisiko, begrunnelse, avslagsKode, fraDato),
      vedtakFattetVilkarOppfylt: true,
      informasjonOmVilkar: {
        begrunnelse: 'begrunnelse',
        navnPåAksjonspunkt: 'Utvidet rett',
        vilkarOppfylt: true,
        vilkar: '§ 9-3 vilkar',
      },
      formState,
    },
  },
  vilkarMidlertidigAlene: {
    visKomponent: 'VilkarMidlertidigAlene' as Komponenter.VILKAR_MIDLERTIDIG_ALENE,
    props: {
      behandlingsID: '123',
      aksjonspunktLost: false,
      lesemodus: false,
      soknadsopplysninger: {
        årsak: 'Årsak',
        beskrivelse: 'Beskrivelse',
        periode: 'DD.MM.ÅÅÅÅ - DD.MM.ÅÅÅÅ',
        soknadsdato: '2021-04-06',
      },
      vedtakFattetVilkarOppfylt: false,
      informasjonOmVilkar: {
        begrunnelse: 'begrunnelse',
        navnPåAksjonspunkt: 'Utvidet rett',
        vilkarOppfylt: false,
        vilkar: '§ 9-3 vilkar',
      },
      informasjonTilLesemodus: {
        begrunnelse: 'Begrunnelse',
        vilkarOppfylt: true,
        dato: {
          fra: '2021-06-06',
          til: '2021-10-03',
        },
        avslagsårsakKode: '1093',
      },
      losAksjonspunkt: ({
        begrunnelse,
        erSokerenMidlertidigAleneOmOmsorgen,
        fra,
        til,
        avslagsårsakKode,
      }) =>
        console.log(begrunnelse, erSokerenMidlertidigAleneOmOmsorgen, fra, til, avslagsårsakKode),
      formState,
    },
  },
  omsorg: {
    visKomponent: 'Omsorg' as Komponenter.OMSORG,
    props: {
      behandlingsID: '123',
      fagytelseType: 'OMP_KS',
      aksjonspunktLost: false,
      lesemodus: false,
      informasjonTilLesemodus: {
        begrunnelse: 'Begrunnelse til lesemodus',
        vilkarOppfylt: false,
      },
      barn: ['01010050053', '34324'],
      harBarnSoktForRammevedtakOmKroniskSyk: true,
      vedtakFattetVilkarOppfylt: true,
      informasjonOmVilkar: {
        begrunnelse: 'begrunnelse',
        navnPåAksjonspunkt: 'Utvidet rett',
        vilkarOppfylt: true,
        vilkar: '§ 9-3 vilkar',
      },
      losAksjonspunkt: (harOmsorgen, begrunnelse) => console.log(harOmsorgen, begrunnelse),
      formState,
    },
  },
  aleneOmOmsorgen: {
    visKomponent: 'AleneOmOmsorgen' as Komponenter.ALENE_OM_OMSORGEN,
    props: {
      behandlingsID: '123',
      aksjonspunktLost: false,
      lesemodus: false,
      fraDatoFraSoknad: '2021-04-06',
      fraDatoFraVilkar: '2021-04-06',
      vedtakFattetVilkarOppfylt: false,
      informasjonOmVilkar: {
        begrunnelse: 'begrunnelse',
        navnPåAksjonspunkt: 'Utvidet rett',
        vilkarOppfylt: true,
        vilkar: '§ 9-3 vilkar',
      },
      erBehandlingstypeRevurdering: false,
      informasjonTilLesemodus: {
        begrunnelse: 'Begrunnelse',
        vilkarOppfylt: true,
        fraDato: '2021-06-06',
        tilDato: '2021-09-10',
      },
      losAksjonspunkt: ({ begrunnelse, vilkarOppfylt, fraDato, tilDato }) =>
        console.log(begrunnelse, vilkarOppfylt, fraDato, tilDato),
      formState,
    },
  },
};

// test
(window as any).renderMicrofrontendOmsorgsdagerApp = async appId => {
  const { renderAppInSuccessfulState } = renderers;
  renderAppInSuccessfulState(appId, inputMocks.vilkarMidlertidigAlene);
};
