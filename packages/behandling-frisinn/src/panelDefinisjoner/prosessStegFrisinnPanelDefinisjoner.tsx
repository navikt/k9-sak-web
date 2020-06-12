import { prosessStegCodes as bpc } from '@k9-sak-web/konstanter';
import ac from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import vt from '@fpsak-frontend/kodeverk/src/vilkarType';
import vut from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import BeregningsgrunnlagProsessIndex from '@fpsak-frontend/prosess-beregningsgrunnlag';
import TilkjentYtelseProsessIndex from '@fpsak-frontend/prosess-tilkjent-ytelse';
import AvregningProsessIndex from '@fpsak-frontend/prosess-avregning';
import VedtakProsessIndex from '@fpsak-frontend/prosess-vedtak';
import * as React from 'react';
import api from '../data/frisinnBehandlingApi';
import findStatusForVedtak from './vedtakStatusUtlederFrisinn';

const harKunAvslåtteUttak = beregningsresultatUtbetaling => {
  const { perioder } = beregningsresultatUtbetaling;
  const alleUtfall = perioder.flatMap(({ andeler }) => {
    return [
      ...andeler.flatMap(({ uttak }) => {
        return [...uttak.flatMap(({ utfall }) => utfall)];
      }),
    ];
  });
  return !alleUtfall.some(utfall => utfall === 'INNVILGET');
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
    urlCode: bpc.TILKJENT_YTELSE,
    textCode: 'Behandlingspunkt.TilkjentYtelse',
    panels: [
      {
        aksjonspunkterCodes: [ac.VURDER_TILBAKETREKK],
        endpoints: [],
        renderComponent: props => {
          return <TilkjentYtelseProsessIndex {...props} />;
        },
        getData: ({ fagsak, beregningsresultatUtbetalt, personopplysninger }) => {
          return {
            fagsak,
            personopplysninger,
            beregningsresultat: beregningsresultatUtbetalt,
          };
        },
        showComponent: () => true,
        overrideStatus: ({ beregningsresultatUtbetalt }) => {
          if (
            !beregningsresultatUtbetalt ||
            !beregningsresultatUtbetalt.perioder ||
            beregningsresultatUtbetalt.perioder.length === 0
          ) {
            return vut.IKKE_VURDERT;
          }
          if (harKunAvslåtteUttak(beregningsresultatUtbetalt)) {
            return vut.IKKE_OPPFYLT;
          }
          return vut.OPPFYLT;
        },
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
        renderComponent: props => {
          return <VedtakProsessIndex {...props} />;
        },
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
          ytelseTypeKode: fagsakYtelseType.FRISINN,
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
