import { isAvslag } from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/combined/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import {
  k9_kodeverk_behandling_aksjonspunkt_AksjonspunktStatus,
  k9_oppdrag_kontrakt_simulering_v1_SimuleringDto,
  k9_sak_kontrakt_aksjonspunkt_AksjonspunktDto,
  k9_sak_kontrakt_beregningsresultat_BeregningsresultatMedUtbetaltePeriodeDto,
  k9_sak_kontrakt_vilkår_VilkårMedPerioderDto,
  k9_sak_web_app_tjenester_behandling_uttak_UttaksplanMedUtsattePerioder,
  k9_kodeverk_vilkår_Utfall as Utfall,
  k9_kodeverk_vilkår_VilkårType as VilkårType,
} from '@k9-sak-web/backend/k9sak/generated/types.js';
import { finnPanelStatus, sjekkDelvisVilkårStatus } from '@k9-sak-web/gui/behandling/prosess/utils/vilkårUtils.js';
import { isAksjonspunktOpen } from '@k9-sak-web/gui/utils/aksjonspunktUtils.js';
import { Behandling } from '@k9-sak-web/types';
import { ProcessMenuStepType } from '@navikt/ft-plattform-komponenter';
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
    vilkår: [VilkårType.SØKNADSFRIST, VilkårType.ALDERSVILKÅR, VilkårType.OMSORGEN_FOR],
    aksjonspunkter: [
      AksjonspunktDefinisjon.OVERSTYRING_AV_SØKNADSFRISTVILKÅRET,
      AksjonspunktDefinisjon.KONTROLLER_OPPLYSNINGER_OM_SØKNADSFRIST,
      AksjonspunktDefinisjon.OVERSTYRING_AV_OMSORGEN_FOR,
    ],
  },
  sykdom: {
    vilkår: [VilkårType.MEDISINSKEVILKÅR_UNDER_18_ÅR, VilkårType.MEDISINSKEVILKÅR_18_ÅR],
    aksjonspunkter: [AksjonspunktDefinisjon.KONTROLLER_LEGEERKLÆRING],
  },
  opptjening: {
    vilkår: [VilkårType.MEDLEMSKAPSVILKÅRET, VilkårType.OPPTJENINGSVILKÅRET],
    aksjonspunkter: [
      AksjonspunktDefinisjon.OVERSTYRING_AV_MEDLEMSKAPSVILKÅRET,
      AksjonspunktDefinisjon.VURDER_OPPTJENINGSVILKÅRET,
    ],
  },
  beregning: {
    vilkår: [VilkårType.BEREGNINGSGRUNNLAGVILKÅR],
    aksjonspunkter: [
      AksjonspunktDefinisjon.FASTSETT_BEREGNINGSGRUNNLAG_ARBEIDSTAKER_FRILANS,
      AksjonspunktDefinisjon.VURDER_VARIG_ENDRET_ELLER_NYOPPSTARTET_NÆRING_SELVSTENDIG_NÆRINGSDRIVENDE,
      AksjonspunktDefinisjon.VURDER_VARIG_ENDRET_ARBEIDSSITUASJON,
      AksjonspunktDefinisjon.FASTSETT_BEREGNINGSGRUNNLAG_SELVSTENDIG_NÆRINGSDRIVENDE,
      AksjonspunktDefinisjon.FASTSETT_BEREGNINGSGRUNNLAG_TIDSBEGRENSET_ARBEIDSFORHOLD,
      AksjonspunktDefinisjon.FASTSETT_BEREGNINGSGRUNNLAG_FOR_SN_NY_I_ARBEIDSLIVET,
    ],
  },
  tilkjentYtelse: {
    aksjonspunkter: [AksjonspunktDefinisjon.VURDER_TILBAKETREKK],
  },
  uttak: {
    aksjonspunkter: [
      AksjonspunktDefinisjon.VENT_ANNEN_PSB_SAK,
      AksjonspunktDefinisjon.VURDER_DATO_NY_REGEL_UTTAK,
      AksjonspunktDefinisjon.OVERSTYRING_AV_UTTAK,
      AksjonspunktDefinisjon.VURDER_OVERLAPPENDE_SØSKENSAKER,
    ],
  },
  simulering: {
    aksjonspunkter: [AksjonspunktDefinisjon.VURDER_FEILUTBETALING, AksjonspunktDefinisjon.SJEKK_HØY_ETTERBETALING],
  },
  vedtak: {
    aksjonspunkter: [
      AksjonspunktDefinisjon.FORESLÅ_VEDTAK,
      AksjonspunktDefinisjon.FATTER_VEDTAK,
      AksjonspunktDefinisjon.FORESLÅ_VEDTAK_MANUELT,
      AksjonspunktDefinisjon.VEDTAK_UTEN_TOTRINNSKONTROLL,
      AksjonspunktDefinisjon.VURDERE_ANNEN_YTELSE_FØR_VEDTAK,
      AksjonspunktDefinisjon.VURDERE_OVERLAPPENDE_YTELSER_FØR_VEDTAK,
      AksjonspunktDefinisjon.VURDERE_DOKUMENT_FØR_VEDTAK,
      AksjonspunktDefinisjon.KONTROLLER_REVURDERINGSBEHANDLING_VARSEL_VED_UGUNST,
      AksjonspunktDefinisjon.KONTROLL_AV_MANUELT_OPPRETTET_REVURDERINGSBEHANDLING,
      AksjonspunktDefinisjon.SJEKK_TILBAKEKREVING,
    ],
  },
} as const;

const erPanelVurdert = (panelType: ProcessMenuStepType): boolean => {
  return panelType === ProcessMenuStepType.success || panelType === ProcessMenuStepType.danger;
};

interface ProcessMenuStep {
  id: string;
  label: string;
  type: ProcessMenuStepType;
  usePartialStatus?: boolean;
  erVurdert?: boolean;
}

/**
 * Bygger et vilkårbasert panel for prosessmenyen.
 *
 * @param forrigeVurdert - Om forrige panel er ferdig vurdert
 * @param vilkår - Alle vilkår for behandlingen
 * @param panelKonfig - Konfigurasjon med relevante vilkår og aksjonspunkter
 * @param aksjonspunkter - Alle aksjonspunkter for behandlingen
 * @param label - Paneltittel
 * @param id - Unik ID for panelet
 * @returns Panelobjekt med status og metadata
 */
export const byggVilkårPanel = (
  forrigeVurdert: boolean | undefined,
  vilkår: k9_sak_kontrakt_vilkår_VilkårMedPerioderDto[],
  panelKonfig: { vilkår: readonly string[]; aksjonspunkter: readonly string[] },
  aksjonspunkter: k9_sak_kontrakt_aksjonspunkt_AksjonspunktDto[],
  label: string,
  id: string,
): ProcessMenuStep => {
  const relevanteVilkår = vilkår.filter(v => panelKonfig.vilkår.includes(v.vilkarType));
  const type = finnPanelStatus(!!forrigeVurdert, relevanteVilkår, aksjonspunkter, panelKonfig.aksjonspunkter);

  return {
    type,
    label,
    id,
    usePartialStatus: sjekkDelvisVilkårStatus(relevanteVilkår),
    erVurdert: erPanelVurdert(type),
  };
};

// Hjelpefunksjon for å beregne uttak-status
export const beregnUttakType = (
  aksjonspunkter: k9_sak_kontrakt_aksjonspunkt_AksjonspunktDto[],
  uttak: k9_sak_web_app_tjenester_behandling_uttak_UttaksplanMedUtsattePerioder,
  uttakAksjonspunkter: readonly string[],
): ProcessMenuStepType => {
  const harApenAksjonspunkt = aksjonspunkter?.some(
    ap =>
      ap.definisjon &&
      uttakAksjonspunkter.includes(ap.definisjon) &&
      ap.status === k9_kodeverk_behandling_aksjonspunkt_AksjonspunktStatus.OPPRETTET,
  );

  if (harApenAksjonspunkt) {
    return ProcessMenuStepType.warning;
  }

  const uttaksperiodeKeys = uttak?.uttaksplan?.perioder ? Object.keys(uttak.uttaksplan.perioder) : [];
  if (!uttak || !uttak.uttaksplan || !uttak.uttaksplan.perioder || uttaksperiodeKeys.length === 0) {
    return ProcessMenuStepType.default;
  }

  const perioder = uttak.uttaksplan.perioder;
  const alleAvslått = uttaksperiodeKeys.every(key => perioder?.[key]?.utfall === Utfall.IKKE_OPPFYLT);

  return alleAvslått ? ProcessMenuStepType.danger : ProcessMenuStepType.success;
};

// Hjelpefunksjon for å beregne tilkjent ytelse-status
export const beregnTilkjentYtelseType = (
  beregningsresultatUtbetaling: k9_sak_kontrakt_beregningsresultat_BeregningsresultatMedUtbetaltePeriodeDto,
  panelKonfig: { aksjonspunkter: readonly string[] },
  aksjonspunkter: k9_sak_kontrakt_aksjonspunkt_AksjonspunktDto[],
): ProcessMenuStepType => {
  if (!beregningsresultatUtbetaling.perioder || beregningsresultatUtbetaling.perioder.length === 0) {
    return ProcessMenuStepType.default;
  }
  const type = finnPanelStatus(true, [], aksjonspunkter, panelKonfig.aksjonspunkter);
  if (type === ProcessMenuStepType.warning) {
    return ProcessMenuStepType.warning;
  }
  return harKunAvslåtteUttak(beregningsresultatUtbetaling) ? ProcessMenuStepType.danger : ProcessMenuStepType.success;
};

// Hjelpefunksjon for å beregne simulering-status
export const beregnSimuleringType = (
  aksjonspunkter: k9_sak_kontrakt_aksjonspunkt_AksjonspunktDto[],
  simuleringResultat: k9_oppdrag_kontrakt_simulering_v1_SimuleringDto,
  simuleringAksjonspunkter: readonly string[],
): ProcessMenuStepType => {
  const harApentAksjonspunkt = aksjonspunkter.some(
    ap =>
      ap.status === k9_kodeverk_behandling_aksjonspunkt_AksjonspunktStatus.OPPRETTET &&
      ap.definisjon &&
      simuleringAksjonspunkter.includes(ap.definisjon),
  );

  if (harApentAksjonspunkt) {
    return ProcessMenuStepType.warning;
  }
  return simuleringResultat ? ProcessMenuStepType.success : ProcessMenuStepType.default;
};

// Hjelpefunksjon for å bygge ikke-vilkårbaserte paneler
const byggPanelUtenVilkår = (
  forrigeVurdert: boolean | undefined,
  type: ProcessMenuStepType,
  label: string,
  id: string,
): ProcessMenuStep => ({
  type: forrigeVurdert ? type : ProcessMenuStepType.default,
  label,
  id,
  erVurdert: erPanelVurdert(forrigeVurdert ? type : ProcessMenuStepType.default),
});

// Hjelpefunksjon for å beregne vedtak-status
export const beregnVedtakType = (
  vilkår: k9_sak_kontrakt_vilkår_VilkårMedPerioderDto[],
  aksjonspunkter: k9_sak_kontrakt_aksjonspunkt_AksjonspunktDto[],
  behandling: Pick<Behandling, 'uuid' | 'versjon' | 'behandlingsresultat'>,
  vedtakAksjonspunkter: readonly string[],
): ProcessMenuStepType => {
  if (!vilkår || vilkår.length === 0) {
    return ProcessMenuStepType.default;
  }

  const harIkkeVurdertVilkar = vilkår.some(v =>
    v.perioder?.some(periode => periode.vilkarStatus === Utfall.IKKE_VURDERT),
  );
  const harApenOverstyringBeregning = aksjonspunkter?.some(
    ap =>
      ap.definisjon === AksjonspunktDefinisjon.OVERSTYRING_AV_BEREGNING && ap.status && isAksjonspunktOpen(ap.status),
  );
  const harÅpneAksjonspunkter = aksjonspunkter?.some(
    ap => vedtakAksjonspunkter.some(vap => vap === ap.definisjon) && ap.status && isAksjonspunktOpen(ap.status),
  );

  if (harIkkeVurdertVilkar || harApenOverstyringBeregning) {
    return ProcessMenuStepType.default;
  }
  if (harÅpneAksjonspunkter) {
    return ProcessMenuStepType.warning;
  }
  if (behandling?.behandlingsresultat?.type) {
    return isAvslag(behandling.behandlingsresultat.type) ? ProcessMenuStepType.danger : ProcessMenuStepType.success;
  }
  return ProcessMenuStepType.default;
};

const skalViseDelvisVedtakStatus = (
  vedtakType: ProcessMenuStepType,
  vilkår: k9_sak_kontrakt_vilkår_VilkårMedPerioderDto[],
): boolean => {
  if (vedtakType === ProcessMenuStepType.default) {
    return false;
  }
  return (
    vilkår.some(v => v.perioder?.some(periode => periode.vilkarStatus === Utfall.IKKE_OPPFYLT)) &&
    vilkår.some(v => v.perioder?.some(periode => periode.vilkarStatus === Utfall.OPPFYLT))
  );
};

interface ProsessmotorProps {
  api: K9SakProsessApi;
  behandling: Pick<Behandling, 'uuid' | 'versjon'>;
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
    // Vilkårbaserte paneler
    const inngangsvilkårPanel = byggVilkårPanel(
      true,
      vilkår,
      PANEL_KONFIG.inngangsvilkår,
      aksjonspunkter,
      'Inngangsvilkår',
      PROSESS_STEG_KODER.INNGANGSVILKAR,
    );

    const sykdomPanel = byggVilkårPanel(
      inngangsvilkårPanel.erVurdert,
      vilkår,
      PANEL_KONFIG.sykdom,
      aksjonspunkter,
      'Sykdom',
      PROSESS_STEG_KODER.MEDISINSK_VILKAR,
    );

    const inngangsvilkårFortsetterPanel = byggVilkårPanel(
      sykdomPanel.erVurdert,
      vilkår,
      PANEL_KONFIG.opptjening,
      aksjonspunkter,
      'Inngangsvilkår Fortsettelse',
      PROSESS_STEG_KODER.OPPTJENING,
    );

    const beregningPanel = byggVilkårPanel(
      inngangsvilkårFortsetterPanel.erVurdert,
      vilkår,
      PANEL_KONFIG.beregning,
      aksjonspunkter,
      'Beregning',
      PROSESS_STEG_KODER.BEREGNINGSGRUNNLAG,
    );

    // Ikke-vilkårbaserte paneler
    const uttakPanel = byggPanelUtenVilkår(
      true,
      beregnUttakType(aksjonspunkter, uttak, PANEL_KONFIG.uttak.aksjonspunkter),
      'Uttak',
      PROSESS_STEG_KODER.UTTAK,
    );

    const tilkjentYtelsePanel = byggPanelUtenVilkår(
      uttakPanel.erVurdert,
      beregnTilkjentYtelseType(beregningsresultatUtbetaling, PANEL_KONFIG.tilkjentYtelse, aksjonspunkter),
      'Tilkjent ytelse',
      PROSESS_STEG_KODER.TILKJENT_YTELSE,
    );

    const simuleringPanel = byggPanelUtenVilkår(
      tilkjentYtelsePanel.erVurdert,
      beregnSimuleringType(aksjonspunkter, simuleringResultat, PANEL_KONFIG.simulering.aksjonspunkter),
      'Simulering',
      PROSESS_STEG_KODER.SIMULERING,
    );

    // Vedtak
    const vedtakType = beregnVedtakType(vilkår, aksjonspunkter, behandling, PANEL_KONFIG.vedtak.aksjonspunkter);
    const vedtakPanel = {
      type: vedtakType,
      label: 'Vedtak',
      id: PROSESS_STEG_KODER.VEDTAK,
      usePartialStatus: skalViseDelvisVedtakStatus(vedtakType, vilkår),
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
