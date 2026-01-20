import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { isAvslag } from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import { finnPanelStatus, sjekkDelvisVilkårStatus } from '@k9-sak-web/gui/behandling/prosess/utils/vilkårUtils.js';
import { isAksjonspunktOpen } from '@k9-sak-web/gui/utils/aksjonspunktUtils.js';
import { Behandling } from '@k9-sak-web/types';
import { ProcessMenuStepType } from '@navikt/ft-plattform-komponenter';
import { k9_kodeverk_behandling_aksjonspunkt_AksjonspunktStatus } from '@navikt/k9-sak-typescript-client/types';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { harKunAvslåtteUttak } from '../TilkjentYtelseProsessStegInitPanel';
import { K9SakProsessApi } from './K9SakProsessApi';
import {
  aksjonspunkterQueryOptions,
  beregningsresultatUtbetalingQueryOptions,
  simuleringResultatQueryOptions,
  uttakQueryOptions,
  vilkårQueryOptions,
} from './k9SakQueryOptions';

const PROSESS_STEG_KODER = {
  INNGANGSVILKAR: 'inngangsvilkar',
  MEDISINSK_VILKAR: 'medisinsk_vilkar',
  OPPTJENING: 'opptjening',
  UTTAK: 'uttak',
  TILKJENT_YTELSE: 'tilkjent_ytelse',
  SIMULERING: 'simulering',
  BEREGNINGSGRUNNLAG: 'beregningsgrunnlag',
  VEDTAK: 'vedtak',
} as const;

// Vilkår- og aksjonspunktkonfigurasjon per panel
const PANEL_KONFIG = {
  inngangsvilkår: {
    vilkår: [vilkarType.SOKNADSFRISTVILKARET, vilkarType.ALDERSVILKARET, vilkarType.OMSORGENFORVILKARET],
    aksjonspunkter: [
      aksjonspunktCodes.OVERSTYR_SOKNADSFRISTVILKAR,
      aksjonspunktCodes.KONTROLLER_OPPLYSNINGER_OM_SØKNADSFRIST,
      aksjonspunktCodes.OVERSTYR_OMSORGEN_FOR,
    ],
  },
  sykdom: {
    vilkår: [vilkarType.MEDISINSKEVILKÅR_UNDER_18_ÅR, vilkarType.MEDISINSKEVILKÅR_18_ÅR],
    aksjonspunkter: [aksjonspunktCodes.MEDISINSK_VILKAAR],
  },
  opptjening: {
    vilkår: [vilkarType.MEDLEMSKAPSVILKARET, vilkarType.OPPTJENINGSVILKARET],
    aksjonspunkter: [aksjonspunktCodes.OVERSTYR_MEDLEMSKAPSVILKAR, aksjonspunktCodes.VURDER_OPPTJENINGSVILKARET],
  },
  beregning: {
    vilkår: [vilkarType.BEREGNINGSGRUNNLAGVILKARET],
    aksjonspunkter: [
      aksjonspunktCodes.FASTSETT_BEREGNINGSGRUNNLAG_ARBEIDSTAKER_FRILANS,
      aksjonspunktCodes.VURDER_VARIG_ENDRET_ELLER_NYOPPSTARTET_NAERING_SELVSTENDIG_NAERINGSDRIVENDE,
      aksjonspunktCodes.VURDER_VARIG_ENDRET_ARBEIDSSITUASJON,
      aksjonspunktCodes.FASTSETT_BRUTTO_BEREGNINGSGRUNNLAG_SELVSTENDIG_NAERINGSDRIVENDE,
      aksjonspunktCodes.FASTSETT_BEREGNINGSGRUNNLAG_TIDSBEGRENSET_ARBEIDSFORHOLD,
      aksjonspunktCodes.FASTSETT_BEREGNINGSGRUNNLAG_SN_NY_I_ARBEIDSLIVET,
    ],
  },
  uttak: {
    aksjonspunkter: [
      aksjonspunktCodes.VENT_ANNEN_PSB_SAK,
      aksjonspunktCodes.VURDER_DATO_NY_REGEL_UTTAK,
      aksjonspunktCodes.OVERSTYRING_AV_UTTAK_KODE,
      aksjonspunktCodes.VURDER_OVERLAPPENDE_SØSKENSAK_KODE,
    ],
  },
  simulering: {
    aksjonspunkter: [aksjonspunktCodes.VURDER_FEILUTBETALING, aksjonspunktCodes.SJEKK_HØY_ETTERBETALING],
  },
} as const;

const erPanelVurdert = (panelType: ProcessMenuStepType): boolean => {
  return panelType === ProcessMenuStepType.success || panelType === ProcessMenuStepType.danger;
};

interface ProsessmotorProps {
  api: K9SakProsessApi;
  behandling: Behandling;
}

export const useProsessmotor = ({ api, behandling }: ProsessmotorProps) => {
  const { data: vilkår } = useSuspenseQuery(vilkårQueryOptions(api, behandling));
  const { data: aksjonspunkter } = useSuspenseQuery(aksjonspunkterQueryOptions(api, behandling));
  const { data: uttak } = useSuspenseQuery(uttakQueryOptions(api, behandling));
  const { data: beregningsresultatUtbetaling } = useSuspenseQuery(
    beregningsresultatUtbetalingQueryOptions(api, behandling),
  );
  const { data: simuleringResultat } = useSuspenseQuery(simuleringResultatQueryOptions(api, behandling));

  return useMemo(() => {
    // ============================================================================
    // Vilkårbaserte paneler (Inngangsvilkår, Sykdom, Opptjening, Beregning)
    // ============================================================================

    const vilkårForInngangssteg = vilkår.filter(v => PANEL_KONFIG.inngangsvilkår.vilkår.includes(v.vilkarType));
    const inngangsvilkårPanel = {
      type: finnPanelStatus(true, vilkårForInngangssteg, aksjonspunkter, [
        ...PANEL_KONFIG.inngangsvilkår.aksjonspunkter,
      ]),
      label: 'Inngangsvilkår',
      id: PROSESS_STEG_KODER.INNGANGSVILKAR,
      usePartialStatus: sjekkDelvisVilkårStatus(vilkårForInngangssteg),
    };
    const inngangsvilkårPanelVurdert = erPanelVurdert(inngangsvilkårPanel.type);

    const vilkårForSykdomsteg = vilkår.filter(v => PANEL_KONFIG.sykdom.vilkår.includes(v.vilkarType));
    const sykdomPanel = {
      type: finnPanelStatus(inngangsvilkårPanelVurdert, vilkårForSykdomsteg, aksjonspunkter, [
        ...PANEL_KONFIG.sykdom.aksjonspunkter,
      ]),
      label: 'Sykdom',
      id: PROSESS_STEG_KODER.MEDISINSK_VILKAR,
      usePartialStatus: sjekkDelvisVilkårStatus(vilkårForSykdomsteg),
    };
    const sykdomPanelVurdert = erPanelVurdert(sykdomPanel.type);

    const vilkårForOpptjeningsteg = vilkår.filter(v => PANEL_KONFIG.opptjening.vilkår.includes(v.vilkarType));
    const inngangsvilkårFortsetterPanel = {
      type: finnPanelStatus(sykdomPanelVurdert, vilkårForOpptjeningsteg, aksjonspunkter, [
        ...PANEL_KONFIG.opptjening.aksjonspunkter,
      ]),
      label: 'Inngangsvilkår Fortsettelse',
      id: PROSESS_STEG_KODER.OPPTJENING,
      usePartialStatus: sjekkDelvisVilkårStatus(vilkårForOpptjeningsteg),
    };
    const inngangsvilkårFortsetterPanelVurdert = erPanelVurdert(inngangsvilkårFortsetterPanel.type);

    const vilkårForBeregningsteg = vilkår.filter(v => PANEL_KONFIG.beregning.vilkår.includes(v.vilkarType));
    const beregningPanel = {
      type: finnPanelStatus(inngangsvilkårFortsetterPanelVurdert, vilkårForBeregningsteg, aksjonspunkter, [
        ...PANEL_KONFIG.beregning.aksjonspunkter,
      ]),
      label: 'Beregning',
      id: PROSESS_STEG_KODER.BEREGNINGSGRUNNLAG,
    };
    const beregningPanelVurdert = erPanelVurdert(beregningPanel.type);

    // ============================================================================
    // Uttak (spesiell logikk basert på uttaksplan og perioder)
    // ============================================================================

    const harApenAksjonspunktUttak = aksjonspunkter?.some(
      ap =>
        ap.definisjon &&
        PANEL_KONFIG.uttak.aksjonspunkter.includes(ap.definisjon) &&
        ap.status === k9_kodeverk_behandling_aksjonspunkt_AksjonspunktStatus.OPPRETTET,
    );
    const uttaksperiodeKeys = uttak?.uttaksplan?.perioder ? Object.keys(uttak.uttaksplan.perioder) : [];
    const perioder = uttak?.uttaksplan?.perioder;

    let uttakType: ProcessMenuStepType;
    if (harApenAksjonspunktUttak) {
      uttakType = ProcessMenuStepType.warning;
    } else if (!uttak || !uttak.uttaksplan || !uttak.uttaksplan.perioder || uttaksperiodeKeys.length === 0) {
      uttakType = ProcessMenuStepType.default;
    } else if (uttaksperiodeKeys.every(key => perioder?.[key]?.utfall === vilkarUtfallType.IKKE_OPPFYLT)) {
      uttakType = ProcessMenuStepType.danger;
    } else {
      uttakType = ProcessMenuStepType.success;
    }

    const uttakPanel = {
      type: beregningPanelVurdert ? uttakType : ProcessMenuStepType.default,
      label: 'Uttak',
      id: PROSESS_STEG_KODER.UTTAK,
    };
    const uttakPanelVurdert = erPanelVurdert(uttakPanel.type);

    // ============================================================================
    // Tilkjent ytelse (basert på beregningsresultat)
    // ============================================================================

    let tilkjentYtelseType: ProcessMenuStepType;
    if (!beregningsresultatUtbetaling?.perioder) {
      tilkjentYtelseType = ProcessMenuStepType.default;
    } else if (harKunAvslåtteUttak(beregningsresultatUtbetaling)) {
      tilkjentYtelseType = ProcessMenuStepType.danger;
    } else {
      tilkjentYtelseType = ProcessMenuStepType.success;
    }

    const tilkjentYtelsePanel = {
      type: uttakPanelVurdert ? tilkjentYtelseType : ProcessMenuStepType.default,
      label: 'Tilkjent ytelse',
      id: PROSESS_STEG_KODER.TILKJENT_YTELSE,
    };
    const tilkjentYtelsePanelVurdert = erPanelVurdert(tilkjentYtelsePanel.type);

    // ============================================================================
    // Simulering (basert på simuleringdata og aksjonspunkter)
    // ============================================================================

    const harApentAksjonspunktSimulering = aksjonspunkter.some(
      ap =>
        ap.status === k9_kodeverk_behandling_aksjonspunkt_AksjonspunktStatus.OPPRETTET &&
        ap.definisjon &&
        PANEL_KONFIG.simulering.aksjonspunkter.includes(ap.definisjon),
    );

    let simuleringType: ProcessMenuStepType;
    if (harApentAksjonspunktSimulering) {
      simuleringType = ProcessMenuStepType.warning;
    } else if (simuleringResultat) {
      simuleringType = ProcessMenuStepType.success;
    } else {
      simuleringType = ProcessMenuStepType.default;
    }

    const simuleringPanel = {
      type: tilkjentYtelsePanelVurdert ? simuleringType : ProcessMenuStepType.default,
      label: 'Simulering',
      id: PROSESS_STEG_KODER.SIMULERING,
    };
    const simuleringPanelVurdert = erPanelVurdert(simuleringPanel.type);

    // ============================================================================
    // Vedtak (aggregert status basert på alle vilkår og aksjonspunkter)
    // ============================================================================

    let vedtakType: ProcessMenuStepType;
    if (!vilkår || vilkår.length === 0 || !simuleringPanelVurdert) {
      vedtakType = ProcessMenuStepType.default;
    } else {
      const harIkkeVurdertVilkar = vilkår.some(v =>
        v.perioder?.some(periode => periode.vilkarStatus === vilkarUtfallType.IKKE_VURDERT),
      );
      const harApenOverstyringBeregning = aksjonspunkter?.some(
        ap => ap.definisjon === aksjonspunktCodes.OVERSTYR_BEREGNING && ap.status && isAksjonspunktOpen(ap.status),
      );
      const harApneAksjonspunkterUtenforVedtak = aksjonspunkter?.some(
        ap =>
          aksjonspunkter.some(vap => vap.definisjon === ap.definisjon) && ap.status && isAksjonspunktOpen(ap.status),
      );

      if (harIkkeVurdertVilkar || harApenOverstyringBeregning) {
        vedtakType = ProcessMenuStepType.default;
      } else if (harApneAksjonspunkterUtenforVedtak) {
        vedtakType = ProcessMenuStepType.warning;
      } else if (behandling?.behandlingsresultat?.type) {
        vedtakType = isAvslag(behandling.behandlingsresultat.type)
          ? ProcessMenuStepType.danger
          : ProcessMenuStepType.success;
      } else {
        vedtakType = ProcessMenuStepType.default;
      }
    }

    const vedtakPanel = {
      type: vedtakType,
      label: 'Vedtak',
      id: PROSESS_STEG_KODER.VEDTAK,
      usePartialStatus:
        vilkår.some(v => v.perioder?.some(periode => periode.vilkarStatus === vilkarUtfallType.IKKE_OPPFYLT)) &&
        vilkår.some(v => v.perioder?.some(periode => periode.vilkarStatus === vilkarUtfallType.OPPFYLT)),
    };

    return [
      inngangsvilkårPanel,
      sykdomPanel,
      inngangsvilkårFortsetterPanel,
      beregningPanel,
      uttakPanel,
      tilkjentYtelsePanel,
      simuleringPanel,
      vedtakPanel,
    ];
  }, [vilkår, aksjonspunkter, uttak, beregningsresultatUtbetaling, simuleringResultat, behandling]);
};
