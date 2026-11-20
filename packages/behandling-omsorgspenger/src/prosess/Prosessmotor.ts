import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import { vilkårStatus as Utfall } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/VilkårStatus.js';
import { VilkårType } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/VilkårType.js';
import type { BeregningsresultatMedUtbetaltePeriodeDto } from '@k9-sak-web/backend/k9sak/kontrakt/beregningsresultat/BeregningsresultatMedUtbetaltePeriodeDto.js';
import type { ÅrskvantumForbrukteDagerDto } from '@k9-sak-web/backend/k9sak/kontrakt/omsorgspenger/ÅrskvantumForbrukteDagerDto.js';
import { ÅrskvantumUtfall } from '@k9-sak-web/backend/k9sak/kodeverk/uttak/ÅrskvantumUtfall.js';
import { prosessStegCodes } from '@k9-sak-web/gui/utils/skjermlenke/prosessStegCodes.js';
import type { Behandling } from '@k9-sak-web/types';
import { ProcessMenuStepType } from '@navikt/ft-plattform-komponenter';
import {
  beregnVedtakType,
  byggMenysteg,
  byggStegMedOverstyrtStatus,
  byggVilkårSteg,
  finnDelpanelStatus,
  finnRelevanteAksjonspunkter,
  finnSimuleringStatus,
  harKunAvslåtteUttak,
  skalViseDelvisVedtakStatus,
  SØKNADSFRIST_DELPANEL_ID,
} from '@k9-sak-web/gui/behandling/prosess/prosessmotor/prosessmotorUtils.js';
import type {
  ProsessmotorSteg,
  Steg,
  StegStatus,
} from '@k9-sak-web/gui/behandling/prosess/prosessmotor/prosessmotorUtils.js';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import type { K9SakProsessApi } from '@k9-sak-web/gui/behandling/prosess/api/K9SakProsessApi.js';
import {
  aksjonspunkterQueryOptions,
  beregningsresultatUtbetalingQueryOptions,
  forbrukteDagerQueryOptions,
  simuleringResultatQueryOptions,
  vilkårQueryOptions,
} from '@k9-sak-web/gui/behandling/prosess/api/k9SakQueryOptions.js';

const PROSESS_STEG_KODER = {
  INNGANGSVILKAR: prosessStegCodes.INNGANGSVILKAR,
  UTTAK: prosessStegCodes.UTTAK,
  BEREGNINGSGRUNNLAG: prosessStegCodes.BEREGNINGSGRUNNLAG,
  TILKJENT_YTELSE: prosessStegCodes.TILKJENT_YTELSE,
  SIMULERING: prosessStegCodes.SIMULERING,
  VEDTAK: prosessStegCodes.VEDTAK,
} as const;

const PANEL_KONFIG = {
  inngangsvilkår: {
    id: PROSESS_STEG_KODER.INNGANGSVILKAR,
    label: 'Inngangsvilkår',
    delpaneler: [
      {
        id: SØKNADSFRIST_DELPANEL_ID,
        vilkår: [VilkårType.SØKNADSFRIST],
        aksjonspunkter: [
          AksjonspunktDefinisjon.OVERSTYRING_AV_SØKNADSFRISTVILKÅRET,
          AksjonspunktDefinisjon.KONTROLLER_OPPLYSNINGER_OM_SØKNADSFRIST,
        ],
      },
      {
        id: 'TI_DAGER',
        vilkår: [VilkårType.ARBEIDSGIVER_UTBETALT_PLIKTIGE_DAGER],
        aksjonspunkter: [AksjonspunktDefinisjon.VURDER_RETT_FRA_DAG_EN],
      },
      {
        id: 'OMSORGENFOR',
        vilkår: [VilkårType.OMSORGEN_FOR],
        aksjonspunkter: [AksjonspunktDefinisjon.OVERSTYRING_AV_OMSORGEN_FOR],
      },
      {
        id: 'OPPTJENING',
        vilkår: [VilkårType.OPPTJENINGSVILKÅRET],
        aksjonspunkter: [AksjonspunktDefinisjon.VURDER_OPPTJENINGSVILKÅRET],
      },
      {
        id: 'MEDLEMSKAP',
        vilkår: [VilkårType.MEDLEMSKAPSVILKÅRET],
        aksjonspunkter: [AksjonspunktDefinisjon.OVERSTYRING_AV_MEDLEMSKAPSVILKÅRET],
      },
      { id: 'ALDER', vilkår: [VilkårType.ALDERSVILKÅR], aksjonspunkter: [] },
    ],
  },
  uttak: {
    id: PROSESS_STEG_KODER.UTTAK,
    label: 'Uttak',
    aksjonspunkter: [
      AksjonspunktDefinisjon.VURDER_ÅRSKVANTUM_KVOTE,
      AksjonspunktDefinisjon.ÅRSKVANTUM_FOSTERBARN,
      AksjonspunktDefinisjon.VURDER_ÅRSKVANTUM_DOK,
    ],
  },
  beregning: {
    id: PROSESS_STEG_KODER.BEREGNINGSGRUNNLAG,
    label: 'Beregning',
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
    id: PROSESS_STEG_KODER.TILKJENT_YTELSE,
    label: 'Tilkjent ytelse',
    aksjonspunkter: [AksjonspunktDefinisjon.VURDER_TILBAKETREKK],
  },
  simulering: {
    id: PROSESS_STEG_KODER.SIMULERING,
    label: 'Simulering',
    aksjonspunkter: [AksjonspunktDefinisjon.VURDER_FEILUTBETALING, AksjonspunktDefinisjon.SJEKK_HØY_ETTERBETALING],
  },
  vedtak: {
    id: PROSESS_STEG_KODER.VEDTAK,
    label: 'Vedtak',
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

export const finnÅrskvantumUttakStatus = (
  forbrukteDager: ÅrskvantumForbrukteDagerDto | null | undefined,
): StegStatus => {
  const uttaksperioder =
    forbrukteDager?.sisteUttaksplan?.aktiviteter?.flatMap(aktivitet => aktivitet.uttaksperioder ?? []) ?? [];
  if (uttaksperioder.length === 0) {
    // Bevisst avvik fra gammel rigg, lik pleiepenger: uten data eller perioder er uttak ikke vurdert.
    return Utfall.IKKE_VURDERT;
  }
  // Som i gammel rigg teller alt som ikke er AVSLÅTT som oppfylt, også UAVKLART og manglende utfall
  return uttaksperioder.every(periode => periode.utfall === ÅrskvantumUtfall.AVSLÅTT)
    ? Utfall.IKKE_OPPFYLT
    : Utfall.OPPFYLT;
};

export const finnTilkjentYtelseStatus = (
  beregningsresultatUtbetaling: BeregningsresultatMedUtbetaltePeriodeDto | null,
): StegStatus => {
  if (!beregningsresultatUtbetaling?.perioder?.length) {
    // Som i gammel rigg for omsorgspenger: tom periodeliste gir IKKE_VURDERT, mens pleiepenger gir IKKE_OPPFYLT

    return Utfall.IKKE_VURDERT;
  }
  return harKunAvslåtteUttak(beregningsresultatUtbetaling) ? Utfall.IKKE_OPPFYLT : Utfall.OPPFYLT;
};

interface ProsessmotorProps {
  api: K9SakProsessApi;
  behandling: Pick<Behandling, 'uuid' | 'versjon' | 'behandlingsresultat' | 'status'>;
}

export const useOmsorgspengerProsessmotor = ({ api, behandling }: ProsessmotorProps): ProsessmotorSteg[] => {
  const { data: vilkår } = useSuspenseQuery(vilkårQueryOptions(api, behandling));
  const { data: aksjonspunkter } = useSuspenseQuery(aksjonspunkterQueryOptions(api, behandling));
  const { data: forbrukteDager } = useSuspenseQuery(forbrukteDagerQueryOptions(api, behandling));
  const { data: beregningsresultatUtbetaling } = useSuspenseQuery(
    beregningsresultatUtbetalingQueryOptions(api, behandling),
  );
  const { data: simuleringResultat } = useSuspenseQuery(simuleringResultatQueryOptions(api, behandling));

  return useMemo(() => {
    // Gammel rigg bruker overstyringspanelet for opptjening når vurderingsaksjonspunktet mangler
    const harVurderOpptjeningAP = aksjonspunkter.some(
      ap => ap.definisjon === AksjonspunktDefinisjon.VURDER_OPPTJENINGSVILKÅRET,
    );
    const inngangsvilkårKonfig = {
      ...PANEL_KONFIG.inngangsvilkår,
      delpaneler: PANEL_KONFIG.inngangsvilkår.delpaneler.map(delpanel =>
        delpanel.id === 'OPPTJENING' && !harVurderOpptjeningAP
          ? { ...delpanel, aksjonspunkter: [AksjonspunktDefinisjon.OVERSTYRING_AV_OPPTJENINGSVILKÅRET] }
          : delpanel,
      ),
    };

    const beregningVilkår = vilkår.filter(v =>
      PANEL_KONFIG.beregning.vilkår.some(vilkårType => vilkårType === v.vilkarType),
    );
    const beregningAksjonspunkter = finnRelevanteAksjonspunkter(aksjonspunkter, PANEL_KONFIG.beregning.aksjonspunkter);
    const beregningSteg: Steg = {
      id: PANEL_KONFIG.beregning.id,
      label: PANEL_KONFIG.beregning.label,
      delpaneler: [
        {
          id: PANEL_KONFIG.beregning.id,
          vilkår: beregningVilkår,
          aksjonspunkter: beregningAksjonspunkter,
          status: finnDelpanelStatus(beregningVilkår, beregningAksjonspunkter),
        },
      ],
    };

    const steg = [
      byggVilkårSteg(inngangsvilkårKonfig, vilkår, aksjonspunkter),
      byggStegMedOverstyrtStatus(PANEL_KONFIG.uttak, finnÅrskvantumUttakStatus(forbrukteDager), aksjonspunkter, true),
      beregningSteg,
      byggStegMedOverstyrtStatus(
        PANEL_KONFIG.tilkjentYtelse,
        finnTilkjentYtelseStatus(beregningsresultatUtbetaling),
        aksjonspunkter,
      ),
      byggStegMedOverstyrtStatus(
        PANEL_KONFIG.simulering,
        finnSimuleringStatus(simuleringResultat),
        aksjonspunkter,
        true,
      ),
    ].filter(s => s !== undefined);

    const vedtakType = beregnVedtakType(vilkår, aksjonspunkter, behandling, PANEL_KONFIG.vedtak.aksjonspunkter);
    const vedtakPanel: ProsessmotorSteg = {
      id: PANEL_KONFIG.vedtak.id,
      label: PANEL_KONFIG.vedtak.label,
      type: vedtakType,
      usePartialStatus: vedtakType === ProcessMenuStepType.success && skalViseDelvisVedtakStatus(vilkår),
      erVurdert: vedtakType === ProcessMenuStepType.success || vedtakType === ProcessMenuStepType.danger,
    };

    return [...byggMenysteg(steg), vedtakPanel];
  }, [vilkår, aksjonspunkter, forbrukteDager, beregningsresultatUtbetaling, simuleringResultat, behandling]);
};
