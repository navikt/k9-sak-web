import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { isAvslag } from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import {
  k9_kodeverk_behandling_aksjonspunkt_AksjonspunktStatus,
  k9_oppdrag_kontrakt_simulering_v1_SimuleringDto,
  k9_sak_kontrakt_aksjonspunkt_AksjonspunktDto,
  k9_sak_kontrakt_beregningsresultat_BeregningsresultatMedUtbetaltePeriodeDto,
  k9_sak_kontrakt_vilkår_VilkårMedPerioderDto,
  k9_sak_web_app_tjenester_behandling_uttak_UttaksplanMedUtsattePerioder,
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
  tilkjentYtelse: {
    aksjonspunkter: [aksjonspunktCodes.VURDER_TILBAKETREKK],
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
  vedtak: {
    aksjonspunkter: [
      aksjonspunktCodes.FORESLA_VEDTAK,
      aksjonspunktCodes.FATTER_VEDTAK,
      aksjonspunktCodes.FORESLA_VEDTAK_MANUELT,
      aksjonspunktCodes.VEDTAK_UTEN_TOTRINNSKONTROLL,
      aksjonspunktCodes.VURDERE_ANNEN_YTELSE,
      aksjonspunktCodes.VURDERE_OVERLAPPENDE_YTELSER_FØR_VEDTAK,
      aksjonspunktCodes.VURDERE_DOKUMENT,
      aksjonspunktCodes.KONTROLLER_REVURDERINGSBEHANDLING_VARSEL_VED_UGUNST,
      aksjonspunktCodes.KONTROLL_AV_MAUNELT_OPPRETTET_REVURDERINGSBEHANDLING,
      aksjonspunktCodes.SJEKK_TILBAKEKREVING,
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
  const alleAvslått = uttaksperiodeKeys.every(key => perioder?.[key]?.utfall === vilkarUtfallType.IKKE_OPPFYLT);

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
const byggPanel = (
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
    v.perioder?.some(periode => periode.vilkarStatus === vilkarUtfallType.IKKE_VURDERT),
  );
  const harApenOverstyringBeregning = aksjonspunkter?.some(
    ap => ap.definisjon === aksjonspunktCodes.OVERSTYR_BEREGNING && ap.status && isAksjonspunktOpen(ap.status),
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
    vilkår.some(v => v.perioder?.some(periode => periode.vilkarStatus === vilkarUtfallType.IKKE_OPPFYLT)) &&
    vilkår.some(v => v.perioder?.some(periode => periode.vilkarStatus === vilkarUtfallType.OPPFYLT))
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
    const uttakPanel = byggPanel(
      true,
      beregnUttakType(aksjonspunkter, uttak, PANEL_KONFIG.uttak.aksjonspunkter),
      'Uttak',
      PROSESS_STEG_KODER.UTTAK,
    );

    const tilkjentYtelsePanel = byggPanel(
      uttakPanel.erVurdert,
      beregnTilkjentYtelseType(beregningsresultatUtbetaling, PANEL_KONFIG.tilkjentYtelse, aksjonspunkter),
      'Tilkjent ytelse',
      PROSESS_STEG_KODER.TILKJENT_YTELSE,
    );

    const simuleringPanel = byggPanel(
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
