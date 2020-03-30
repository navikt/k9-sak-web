import * as React from 'react';

import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import CheckPersonStatusIndex from '@fpsak-frontend/prosess-saksopplysninger';
import AvregningProsessIndex from '@fpsak-frontend/prosess-avregning';
import TilkjentYtelseProsessIndex from '@fpsak-frontend/prosess-tilkjent-ytelse';
import OpptjeningVilkarProsessIndex from '@fpsak-frontend/prosess-vilkar-opptjening';
import VarselOmRevurderingProsessIndex from '@fpsak-frontend/prosess-varsel-om-revurdering';
import VilkarresultatMedOverstyringProsessIndex from '@fpsak-frontend/prosess-vilkar-overstyring';
import VedtakProsessIndex from '@fpsak-frontend/prosess-vedtak';
import SokersOpplysningspliktVilkarProsessIndex from '@fpsak-frontend/prosess-vilkar-sokers-opplysningsplikt';
import BeregningsgrunnlagProsessIndex from '@fpsak-frontend/prosess-beregningsgrunnlag';
import UttakProsessIndex from '@fpsak-frontend/prosess-uttak';
import { uttaksplaner, behandlingPersonMap } from '@fpsak-frontend/prosess-uttak/src/components/dto/testdata';
import ac from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import { behandlingspunktCodes as bpc } from '@fpsak-frontend/fp-felles';
import vt from '@fpsak-frontend/kodeverk/src/vilkarType';
import bt from '@fpsak-frontend/kodeverk/src/behandlingType';
import vut from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import prt from '@fpsak-frontend/kodeverk/src/periodeResultatType';

import findStatusForVedtak from './vedtakStatusUtlederOmsorgspenger';
import api from '../data/omsorgspengerBehandlingApi';

const harPeriodeMedUtbetaling = perioder => {
  const periode = perioder.find(p => p.dagsats > 0);
  return !!periode;
};

const getStatusFromResultatstruktur = (resultatstruktur, uttaksresultat) => {
  if (resultatstruktur && resultatstruktur.perioder.length > 0) {
    if (!harPeriodeMedUtbetaling(resultatstruktur.perioder)) {
      return vut.IKKE_VURDERT;
    }
    if (uttaksresultat && uttaksresultat.perioderSøker.length > 0) {
      const oppfylt = uttaksresultat.perioderSøker.some(p => p.periodeResultatType.kode !== prt.AVSLATT);
      if (oppfylt) {
        return vut.OPPFYLT;
      }
    }
  }
  return vut.IKKE_VURDERT;
};

const harVilkarresultatMedOverstyring = (aksjonspunkterForSteg, aksjonspunktDefKoderForSteg) => {
  const apKoder = aksjonspunkterForSteg.map(ap => ap.definisjon.kode);
  const harIngenApOgMulighetTilOverstyring = apKoder.length === 0 && aksjonspunktDefKoderForSteg.length > 0;
  const harApSomErOverstyringAp = apKoder.some(apCode => aksjonspunktDefKoderForSteg.includes(apCode));
  return harIngenApOgMulighetTilOverstyring || harApSomErOverstyringAp;
};

const avslagsarsakerES = ['1002', '1003', '1032'];
const filtrerAvslagsarsaker = (avslagsarsaker, vilkarTypeKode) =>
  vilkarTypeKode === vt.FODSELSVILKARET_MOR
    ? avslagsarsaker[vilkarTypeKode].filter(arsak => !avslagsarsakerES.includes(arsak.kode))
    : avslagsarsaker[vilkarTypeKode];

const DEFAULT_PROPS_FOR_OVERSTYRINGPANEL = {
  showComponent: ({ vilkarForSteg, aksjonspunkterForSteg, aksjonspunktDefKoderForSteg }) =>
    vilkarForSteg.length > 0 && harVilkarresultatMedOverstyring(aksjonspunkterForSteg, aksjonspunktDefKoderForSteg),
  renderComponent: props => <VilkarresultatMedOverstyringProsessIndex {...props} />,
  getData: ({ vilkarForSteg, alleKodeverk }) => ({
    avslagsarsaker: filtrerAvslagsarsaker(alleKodeverk[kodeverkTyper.AVSLAGSARSAK], vilkarForSteg[0].vilkarType.kode),
  }),
  isOverridable: true,
  aksjonspunkterTextCodes: [],
};

const PANEL_ATTRIBUTTER = {
  vilkarCodes: [],
  endpoints: [],
  getData: () => ({}),
  aksjonspunkterTextCodes: [],
  showComponent: undefined,
  overrideStatus: undefined,
  isOverridable: false,
  overridePanel: undefined,
};

const prosessStegPanelDefinisjoner = [
  {
    urlCode: bpc.VARSEL,
    textCode: 'Behandlingspunkt.CheckVarselRevurdering',
    panels: [
      {
        aksjonspunkterCodes: [ac.VARSEL_REVURDERING_MANUELL, ac.VARSEL_REVURDERING_ETTERKONTROLL],
        endpoints: [api.FAMILIEHENDELSE, api.FAMILIEHENDELSE_ORIGINAL_BEHANDLING, api.SOKNAD_ORIGINAL_BEHANDLING],
        renderComponent: props => <VarselOmRevurderingProsessIndex {...props} />,
        getData: ({ previewCallback, dispatchSubmitFailed, soknad }) => ({
          previewCallback,
          dispatchSubmitFailed,
          soknad,
        }),
      },
    ],
  },
  {
    urlCode: bpc.SAKSOPPLYSNINGER,
    textCode: 'Behandlingspunkt.Saksopplysninger',
    panels: [
      {
        aksjonspunkterCodes: [ac.AVKLAR_PERSONSTATUS],
        endpoints: [api.MEDLEMSKAP],
        renderComponent: props => <CheckPersonStatusIndex {...props} />,
        getData: ({ personopplysninger }) => ({ personopplysninger }),
      },
    ],
  },
  {
    urlCode: bpc.INNGANGSVILKAR,
    textCode: 'Behandlingspunkt.Inngangsvilkar',
    panels: [
      {
        aksjonspunkterCodes: [ac.SOKERS_OPPLYSNINGSPLIKT_OVST, ac.SOKERS_OPPLYSNINGSPLIKT_MANU],
        aksjonspunkterTextCodes: [
          'SokersOpplysningspliktForm.UtfyllendeOpplysninger',
          'SokersOpplysningspliktForm.UtfyllendeOpplysninger',
        ],
        vilkarCodes: [vt.SOKERSOPPLYSNINGSPLIKT],
        showComponent: ({ behandling, aksjonspunkterForSteg }) => {
          const isRevurdering = bt.REVURDERING === behandling.type.kode;
          const hasAp = aksjonspunkterForSteg.some(ap => ap.definisjon.kode === ac.SOKERS_OPPLYSNINGSPLIKT_MANU);
          return !(isRevurdering && !hasAp);
        },
        renderComponent: props => <SokersOpplysningspliktVilkarProsessIndex {...props} />,
        getData: ({ soknad }) => ({ soknad }),
      },
      {
        code: 'MEDLEMSKAP',
        textCode: 'Inngangsvilkar.Medlemskapsvilkaret',
        aksjonspunkterCodes: [ac.OVERSTYR_MEDLEMSKAPSVILKAR],
        vilkarCodes: [vt.MEDLEMSKAPSVILKARET],
        endpoints: [api.MEDLEMSKAP],
        ...DEFAULT_PROPS_FOR_OVERSTYRINGPANEL,
      },
    ],
  },
  {
    urlCode: bpc.OPPTJENING,
    textCode: 'Behandlingspunkt.Opptjening',
    panels: [
      {
        code: 'OPPTJENINGSVILKARET',
        textCode: 'Inngangsvilkar.Opptjeningsvilkaret',
        aksjonspunkterCodes: [ac.VURDER_OPPTJENINGSVILKARET],
        aksjonspunkterTextCodes: ['OpptjeningVilkarView.VurderOmSøkerHarRett'],
        vilkarCodes: [vt.OPPTJENINGSPERIODE, vt.OPPTJENINGSVILKARET],
        endpoints: [api.OPPTJENING],
        renderComponent: props => <OpptjeningVilkarProsessIndex {...props} />,
        getData: ({ vilkarForSteg }) => ({
          lovReferanse: vilkarForSteg[0].lovReferanse,
        }),
        overridePanel: {
          aksjonspunkterCodes: [ac.OVERSTYRING_AV_OPPTJENINGSVILKARET],
          ...DEFAULT_PROPS_FOR_OVERSTYRINGPANEL,
        },
      },
    ],
  },
  {
    urlCode: bpc.BEREGNINGSGRUNNLAG,
    textCode: 'Behandlingspunkt.Beregning',
    panels: [
      {
        aksjonspunkterCodes: [
          ac.FASTSETT_BEREGNINGSGRUNNLAG_ARBEIDSTAKER_FRILANS,
          ac.VURDER_VARIG_ENDRET_ELLER_NYOPPSTARTET_NAERING_SELVSTENDIG_NAERINGSDRIVENDE,
          ac.FASTSETT_BRUTTO_BEREGNINGSGRUNNLAG_SELVSTENDIG_NAERINGSDRIVENDE,
          ac.FASTSETT_BEREGNINGSGRUNNLAG_TIDSBEGRENSET_ARBEIDSFORHOLD,
          ac.FASTSETT_BEREGNINGSGRUNNLAG_SN_NY_I_ARBEIDSLIVET,
          ac.VURDER_GRADERING_UTEN_BEREGNINGSGRUNNLAG,
          ac.VURDER_DEKNINGSGRAD,
        ],
        vilkarCodes: [vt.BEREGNINGSGRUNNLAGVILKARET],
        renderComponent: props => <BeregningsgrunnlagProsessIndex {...props} />,
        showComponent: () => true,
        getData: ({ fagsak, featureToggles, beregningsgrunnlag }) => ({ fagsak, featureToggles, beregningsgrunnlag }),
      },
    ],
  },
  {
    urlCode: bpc.FORTSATTMEDLEMSKAP,
    textCode: 'Behandlingspunkt.FortsattMedlemskap',
    panels: [
      {
        aksjonspunkterCodes: [ac.OVERSTYR_LØPENDE_MEDLEMSKAPSVILKAR],
        vilkarCodes: [vt.MEDLEMSKAPSVILKÅRET_LØPENDE],
        ...DEFAULT_PROPS_FOR_OVERSTYRINGPANEL,
      },
    ],
  },
  {
    urlCode: bpc.UTTAK,
    textCode: 'Behandlingspunkt.Uttak',
    panels: [
      {
        aksjonspunkterCodes: [],
        endpoints: [],
        renderComponent: () => (
          <UttakProsessIndex uttaksplaner={uttaksplaner} behandlingPersonMap={behandlingPersonMap} />
        ),
        showComponent: () => true,
      },
    ],
  },
  {
    urlCode: bpc.TILKJENT_YTELSE,
    textCode: 'Behandlingspunkt.TilkjentYtelse',
    panels: [
      {
        aksjonspunkterCodes: [ac.VURDER_TILBAKETREKK],
        endpoints: [api.FAMILIEHENDELSE],
        renderComponent: props => <TilkjentYtelseProsessIndex {...props} />,
        getData: ({ fagsak, beregningresultatForeldrepenger, personopplysninger, soknad }) => ({
          fagsak,
          personopplysninger,
          soknad,
          beregningresultat: beregningresultatForeldrepenger,
        }),
        showComponent: () => true,
        overrideStatus: ({ beregningresultatForeldrepenger, uttaksresultatPerioder }) =>
          getStatusFromResultatstruktur(beregningresultatForeldrepenger, uttaksresultatPerioder),
      },
    ],
  },
  {
    urlCode: bpc.AVREGNING,
    textCode: 'Behandlingspunkt.Avregning',
    panels: [
      {
        aksjonspunkterCodes: [ac.VURDER_FEILUTBETALING],
        endpoints: [api.TILBAKEKREVINGVALG],
        renderComponent: props => <AvregningProsessIndex {...props} />,
        getData: ({ fagsak, featureToggles, previewFptilbakeCallback, simuleringResultat }) => ({
          fagsak,
          featureToggles,
          previewFptilbakeCallback,
          simuleringResultat,
        }),
        showComponent: () => true,
        overrideStatus: ({ simuleringResultat }) => (simuleringResultat ? vut.OPPFYLT : vut.IKKE_VURDERT),
      },
    ],
  },
  {
    urlCode: bpc.VEDTAK,
    textCode: 'Behandlingspunkt.Vedtak',
    panels: [
      {
        aksjonspunkterCodes: [
          ac.FORESLA_VEDTAK,
          ac.FATTER_VEDTAK,
          ac.FORESLA_VEDTAK_MANUELT,
          ac.VEDTAK_UTEN_TOTRINNSKONTROLL,
          ac.VURDERE_ANNEN_YTELSE,
          ac.VURDERE_DOKUMENT,
          ac.KONTROLLER_REVURDERINGSBEHANDLING_VARSEL_VED_UGUNST,
          ac.KONTROLL_AV_MAUNELT_OPPRETTET_REVURDERINGSBEHANDLING,
        ],
        endpoints: [
          api.TILBAKEKREVINGVALG,
          api.SEND_VARSEL_OM_REVURDERING,
          api.BEREGNINGSRESULTAT_ORIGINAL_BEHANDLING,
          api.MEDLEMSKAP,
        ],
        renderComponent: props => <VedtakProsessIndex {...props} />,
        getData: ({
          previewCallback,
          rettigheter,
          aksjonspunkter,
          vilkar,
          beregningresultatForeldrepenger,
          simuleringResultat,
          beregningsgrunnlag,
          vedtakVarsel,
        }) => ({
          previewCallback,
          aksjonspunkter,
          vilkar,
          beregningresultatForeldrepenger,
          simuleringResultat,
          beregningsgrunnlag,
          ytelseTypeKode: fagsakYtelseType.FORELDREPENGER,
          employeeHasAccess: rettigheter.kanOverstyreAccess.isEnabled,
          vedtakVarsel,
        }),
        showComponent: () => true,
        overrideStatus: ({ vilkar, aksjonspunkter, behandling, aksjonspunkterForSteg }) =>
          findStatusForVedtak(vilkar, aksjonspunkter, aksjonspunkterForSteg, behandling.behandlingsresultat),
      },
    ],
  },
];

export default prosessStegPanelDefinisjoner.map(def => ({
  ...def,
  panels: def.panels.map(p => ({
    ...PANEL_ATTRIBUTTER,
    ...p,
  })),
}));
