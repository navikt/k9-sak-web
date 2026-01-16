import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { isAvslag } from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import { finnPanelStatus } from '@k9-sak-web/gui/behandling/prosess/utils/vilkårUtils.js';
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

interface ProsessmotorProps {
  api: K9SakProsessApi;
  behandling: Behandling;
}

export const Prosessmotor = ({ api, behandling }: ProsessmotorProps) => {
  const { data: vilkår } = useSuspenseQuery(vilkårQueryOptions(api, behandling));
  const { data: aksjonspunkter } = useSuspenseQuery(aksjonspunkterQueryOptions(api, behandling));
  const { data: uttak } = useSuspenseQuery(uttakQueryOptions(api, behandling));
  const { data: beregningsresultatUtbetaling } = useSuspenseQuery(
    beregningsresultatUtbetalingQueryOptions(api, behandling),
  );
  const { data: simuleringResultat } = useSuspenseQuery(simuleringResultatQueryOptions(api, behandling));

  const inngangsvilkårPanelStatus = useMemo(() => {
    const vilkårkoder = [vilkarType.SOKNADSFRISTVILKARET, vilkarType.ALDERSVILKARET, vilkarType.OMSORGENFORVILKARET];
    const aksjonspunktkoder = [
      aksjonspunktCodes.OVERSTYR_SOKNADSFRISTVILKAR,
      aksjonspunktCodes.KONTROLLER_OPPLYSNINGER_OM_SØKNADSFRIST,
      aksjonspunktCodes.OVERSTYR_OMSORGEN_FOR,
    ];

    const vilkårForSteg = vilkår.filter(vilkar => vilkårkoder.includes(vilkar.vilkarType));
    return finnPanelStatus(true, vilkårForSteg, aksjonspunkter, aksjonspunktkoder);
  }, [vilkår, aksjonspunkter]);

  const sykdomPanelStatus = useMemo(() => {
    const vilkårkoder = [vilkarType.MEDISINSKEVILKÅR_UNDER_18_ÅR, vilkarType.MEDISINSKEVILKÅR_18_ÅR];
    const aksjonspunktkoder = [aksjonspunktCodes.MEDISINSK_VILKAAR];

    const vilkårForSteg = vilkår.filter(vilkar => vilkårkoder.includes(vilkar.vilkarType));
    return finnPanelStatus(true, vilkårForSteg, aksjonspunkter, aksjonspunktkoder);
  }, [vilkår, aksjonspunkter]);

  const inngangsvilkårFortsetterPanelStatus = useMemo(() => {
    const vilkårkoder = [vilkarType.MEDLEMSKAPSVILKARET, vilkarType.OPPTJENINGSVILKARET];
    const aksjonspunktkoder = [
      aksjonspunktCodes.OVERSTYR_MEDLEMSKAPSVILKAR,
      aksjonspunktCodes.VURDER_OPPTJENINGSVILKARET,
    ];

    const vilkårForSteg = vilkår.filter(vilkar => vilkårkoder.includes(vilkar.vilkarType));
    return finnPanelStatus(true, vilkårForSteg, aksjonspunkter, aksjonspunktkoder);
  }, [vilkår, aksjonspunkter]);

  const beregningPanelStatus = useMemo(() => {
    const vilkårkoder = [vilkarType.BEREGNINGSGRUNNLAGVILKARET];
    const aksjonspunktkoder = [
      aksjonspunktCodes.FASTSETT_BEREGNINGSGRUNNLAG_ARBEIDSTAKER_FRILANS,
      aksjonspunktCodes.VURDER_VARIG_ENDRET_ELLER_NYOPPSTARTET_NAERING_SELVSTENDIG_NAERINGSDRIVENDE,
      aksjonspunktCodes.VURDER_VARIG_ENDRET_ARBEIDSSITUASJON,
      aksjonspunktCodes.FASTSETT_BRUTTO_BEREGNINGSGRUNNLAG_SELVSTENDIG_NAERINGSDRIVENDE,
      aksjonspunktCodes.FASTSETT_BEREGNINGSGRUNNLAG_TIDSBEGRENSET_ARBEIDSFORHOLD,
      aksjonspunktCodes.FASTSETT_BEREGNINGSGRUNNLAG_SN_NY_I_ARBEIDSLIVET,
    ];

    const vilkårForSteg = vilkår.filter(vilkar => vilkårkoder.includes(vilkar.vilkarType));
    return finnPanelStatus(true, vilkårForSteg, aksjonspunkter, aksjonspunktkoder);
  }, [vilkår, aksjonspunkter]);

  const uttakPanelStatus = useMemo(() => {
    const aksjonspunktkoder = [
      aksjonspunktCodes.VENT_ANNEN_PSB_SAK,
      aksjonspunktCodes.VURDER_DATO_NY_REGEL_UTTAK,
      aksjonspunktCodes.OVERSTYRING_AV_UTTAK_KODE,
      aksjonspunktCodes.VURDER_OVERLAPPENDE_SØSKENSAK_KODE,
    ];

    const harApenAksjonspunkt = aksjonspunkter?.some(
      ap =>
        aksjonspunktkoder.some(kode => kode === ap.definisjon) &&
        ap.status === k9_kodeverk_behandling_aksjonspunkt_AksjonspunktStatus.OPPRETTET,
    );

    // Hvis det er åpent aksjonspunkt, vis warning (gul/oransje)
    if (harApenAksjonspunkt) {
      return ProcessMenuStepType.warning;
    }

    // Hvis data ikke er lastet ennå, bruk default
    if (!uttak) {
      return ProcessMenuStepType.default;
    }

    // Sjekk om uttaksplan eksisterer og har perioder
    if (
      !uttak.uttaksplan ||
      !uttak.uttaksplan.perioder ||
      (uttak.uttaksplan.perioder && Object.keys(uttak.uttaksplan.perioder).length === 0)
    ) {
      return ProcessMenuStepType.default;
    }

    const uttaksperiodeKeys = Object.keys(uttak.uttaksplan.perioder);
    const perioder = uttak.uttaksplan.perioder;

    // Hvis alle perioder er ikke oppfylt, vis danger
    if (uttaksperiodeKeys.every(key => perioder?.[key]?.utfall === vilkarUtfallType.IKKE_OPPFYLT)) {
      return ProcessMenuStepType.danger;
    }

    // Ellers (hvis ikke alle er IKKE_OPPFYLT), vis success
    // Dette matcher legacy-logikken: getOverstyrtStatus returnerer OPPFYLT hvis ikke alle er IKKE_OPPFYLT
    return ProcessMenuStepType.success;
  }, [aksjonspunkter, uttak]);

  const tilkjentYtelsePanelStatus = useMemo(() => {
    if (!beregningsresultatUtbetaling?.perioder) {
      return ProcessMenuStepType.default;
    }

    // Hvis kun avslåtte uttak, vis danger (rød)
    if (harKunAvslåtteUttak(beregningsresultatUtbetaling)) {
      return ProcessMenuStepType.danger;
    }

    // Ellers vis success (grønn hake)
    return ProcessMenuStepType.success;
  }, [beregningsresultatUtbetaling]);

  const simuleringPanelStatus = useMemo(() => {
    // Hvis det finnes åpne aksjonspunkter relatert til simulering, vis warning
    const harApentAksjonspunkt = aksjonspunkter.some(
      ap =>
        ap.status === k9_kodeverk_behandling_aksjonspunkt_AksjonspunktStatus.OPPRETTET &&
        (ap.definisjon === aksjonspunktCodes.VURDER_FEILUTBETALING ||
          ap.definisjon === aksjonspunktCodes.SJEKK_HØY_ETTERBETALING),
    );

    if (harApentAksjonspunkt) {
      return ProcessMenuStepType.warning;
    }

    // Hvis simulering er utført, vis success
    if (simuleringResultat) {
      return ProcessMenuStepType.success;
    }

    // Ellers vis default (ingen status)
    return ProcessMenuStepType.default;
  }, [simuleringResultat, aksjonspunkter]);

  const vedtakPanelStatus = useMemo(() => {
    // Hvis ingen vilkår, er panelet ikke vurdert (default)
    if (!vilkår || vilkår.length === 0) {
      return ProcessMenuStepType.default;
    }

    // Sjekk om noen vilkår ikke er vurdert
    const harIkkeVurdertVilkar = vilkår.some(v =>
      v.perioder?.some(periode => periode.vilkarStatus === vilkarUtfallType.IKKE_VURDERT),
    );

    // Sjekk om det finnes åpent OVERSTYR_BEREGNING aksjonspunkt
    const harApenOverstyringBeregning = aksjonspunkter?.some(
      ap => ap.definisjon === aksjonspunktCodes.OVERSTYR_BEREGNING && ap.status && isAksjonspunktOpen(ap.status),
    );

    // Hvis vilkår ikke er vurdert eller det finnes åpen overstyring, vis default
    if (harIkkeVurdertVilkar || harApenOverstyringBeregning) {
      return ProcessMenuStepType.default;
    }

    // Sjekk om det finnes åpne aksjonspunkter utenfor vedtakspanelet
    const harApneAksjonspunkterUtenforVedtak = aksjonspunkter?.some(
      ap => aksjonspunkter.some(vap => vap.definisjon === ap.definisjon) && ap.status && isAksjonspunktOpen(ap.status),
    );

    // Hvis det finnes åpne aksjonspunkter utenfor vedtak, vis default
    if (harApneAksjonspunkterUtenforVedtak) {
      return ProcessMenuStepType.warning;
    }

    // Sjekk behandlingsresultat
    if (behandling?.behandlingsresultat?.type) {
      if (isAvslag(behandling.behandlingsresultat.type)) {
        // Avslag vises som danger
        return ProcessMenuStepType.danger;
      }
      // Innvilgelse vises som success
      return ProcessMenuStepType.success;
    }

    // Default tilstand
    return ProcessMenuStepType.default;
  }, [aksjonspunkter, behandling, vilkår]);
};
