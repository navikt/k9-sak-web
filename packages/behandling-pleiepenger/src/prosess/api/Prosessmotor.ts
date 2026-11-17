import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import { vilkårStatus as Utfall } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/VilkårStatus.js';
import { VilkårType } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/VilkårType.js';
import type { BeregningsresultatMedUtbetaltePeriodeDto } from '@k9-sak-web/backend/k9sak/kontrakt/beregningsresultat/BeregningsresultatMedUtbetaltePeriodeDto.js';
import { useUttakApi } from '@k9-sak-web/gui/prosess/uttak/api/UttakApiContext.js';
import { uttakQueryOptions } from '@k9-sak-web/gui/prosess/uttak/api/uttakQueryOptions.js';
import type { Uttak } from '@k9-sak-web/gui/prosess/uttak/types/Uttak.js';
import { prosessStegCodes } from '@k9-sak-web/gui/utils/skjermlenke/prosessStegCodes.js';
import { Behandling } from '@k9-sak-web/types';
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
import { K9SakProsessApi } from '@k9-sak-web/gui/behandling/prosess/api/K9SakProsessApi.js';
import {
  aksjonspunkterQueryOptions,
  beregningsresultatUtbetalingQueryOptions,
  simuleringResultatQueryOptions,
  vilkårQueryOptions,
} from '@k9-sak-web/gui/behandling/prosess/api/k9SakQueryOptions.js';

const PROSESS_STEG_KODER = {
  INNGANGSVILKAR: prosessStegCodes.INNGANGSVILKAR,
  MEDISINSK_VILKAR: prosessStegCodes.MEDISINSK_VILKAR,
  OPPTJENING: prosessStegCodes.OPPTJENING,
  UTTAK: prosessStegCodes.UTTAK,
  TILKJENT_YTELSE: prosessStegCodes.TILKJENT_YTELSE,
  SIMULERING: prosessStegCodes.SIMULERING,
  BEREGNINGSGRUNNLAG: prosessStegCodes.BEREGNINGSGRUNNLAG,
  VEDTAK: prosessStegCodes.VEDTAK,
} as const;

// Vilkår og aksjonspunkter per steg og delpanel, som i panelDefinisjoner/prosessStegPaneler i gammel rigg
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
      { id: 'ALDER', vilkår: [VilkårType.ALDERSVILKÅR], aksjonspunkter: [] },
      {
        id: 'OMSORGENFOR',
        vilkår: [VilkårType.OMSORGEN_FOR],
        aksjonspunkter: [AksjonspunktDefinisjon.OVERSTYRING_AV_OMSORGEN_FOR],
      },
    ],
  },
  sykdom: {
    id: PROSESS_STEG_KODER.MEDISINSK_VILKAR,
    label: 'Sykdom',
    delpaneler: [
      {
        id: 'MEDISINSK_VILKAR',
        vilkår: [VilkårType.MEDISINSKEVILKÅR_UNDER_18_ÅR, VilkårType.MEDISINSKEVILKÅR_18_ÅR],
        aksjonspunkter: [AksjonspunktDefinisjon.KONTROLLER_LEGEERKLÆRING],
      },
    ],
  },
  opptjening: {
    id: PROSESS_STEG_KODER.OPPTJENING,
    label: 'Inngangsvilkår Fortsettelse',
    delpaneler: [
      {
        id: 'OPPTJENING',
        vilkår: [VilkårType.OPPTJENINGSVILKÅRET],
        aksjonspunkter: [AksjonspunktDefinisjon.VURDER_OPPTJENINGSVILKÅRET],
      },
      // Fortsatt medlemskap har ikke eget steg: steget i gammel rigg krevde aksjonspunkt 6012, som ikke finnes i backend
      {
        id: 'MEDLEMSKAP',
        vilkår: [VilkårType.MEDLEMSKAPSVILKÅRET],
        aksjonspunkter: [AksjonspunktDefinisjon.OVERSTYRING_AV_MEDLEMSKAPSVILKÅRET],
      },
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
    aksjonspunkter: [AksjonspunktDefinisjon.VURDER_TILBAKETREKK],
    id: PROSESS_STEG_KODER.TILKJENT_YTELSE,
    label: 'Tilkjent ytelse',
  },
  uttak: {
    aksjonspunkter: [
      AksjonspunktDefinisjon.VENT_ANNEN_PSB_SAK,
      AksjonspunktDefinisjon.VURDER_DATO_NY_REGEL_UTTAK,
      AksjonspunktDefinisjon.OVERSTYRING_AV_UTTAK,
      AksjonspunktDefinisjon.VURDER_OVERLAPPENDE_SØSKENSAKER,
    ],
    id: PROSESS_STEG_KODER.UTTAK,
    label: 'Uttak',
  },
  simulering: {
    aksjonspunkter: [AksjonspunktDefinisjon.VURDER_FEILUTBETALING, AksjonspunktDefinisjon.SJEKK_HØY_ETTERBETALING],
    id: PROSESS_STEG_KODER.SIMULERING,
    label: 'Simulering',
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
    id: PROSESS_STEG_KODER.VEDTAK,
    label: 'Vedtak',
  },
} as const;

export const finnUttakStatus = (uttak: Uttak | null): StegStatus => {
  const perioder = uttak?.uttaksplan?.perioder;
  const uttaksperiodeKeys = perioder ? Object.keys(perioder) : [];
  if (!perioder || uttaksperiodeKeys.length === 0) {
    return Utfall.IKKE_VURDERT;
  }
  return uttaksperiodeKeys.every(key => perioder[key]?.utfall === Utfall.IKKE_OPPFYLT)
    ? Utfall.IKKE_OPPFYLT
    : Utfall.OPPFYLT;
};

export const finnTilkjentYtelseStatus = (
  beregningsresultatUtbetaling: BeregningsresultatMedUtbetaltePeriodeDto | null,
): StegStatus => {
  if (!beregningsresultatUtbetaling?.perioder) {
    return Utfall.IKKE_VURDERT;
  }
  // Som i gammel rigg gir tom periodeliste avslag, siden ingen uttak er innvilget
  return harKunAvslåtteUttak(beregningsresultatUtbetaling) ? Utfall.IKKE_OPPFYLT : Utfall.OPPFYLT;
};

interface ProsessmotorProps {
  api: K9SakProsessApi;
  behandling: Pick<Behandling, 'uuid' | 'versjon' | 'behandlingsresultat' | 'status'>;
}

export const useProsessmotor = ({ api, behandling }: ProsessmotorProps): ProsessmotorSteg[] => {
  const { data: vilkår } = useSuspenseQuery(vilkårQueryOptions(api, behandling));
  const { data: aksjonspunkter } = useSuspenseQuery(aksjonspunkterQueryOptions(api, behandling));
  const uttakApi = useUttakApi();
  const { data: uttak } = useSuspenseQuery(uttakQueryOptions(uttakApi, behandling.uuid, behandling.versjon));
  const { data: beregningsresultatUtbetaling } = useSuspenseQuery(
    beregningsresultatUtbetalingQueryOptions(api, behandling),
  );
  const { data: simuleringResultat } = useSuspenseQuery(simuleringResultatQueryOptions(api, behandling));

  return useMemo(() => {
    // Gammel rigg bruker overstyringspanelet for opptjening når vurderingsaksjonspunktet mangler
    const harVurderOpptjeningAP = aksjonspunkter.some(
      ap => ap.definisjon === AksjonspunktDefinisjon.VURDER_OPPTJENINGSVILKÅRET,
    );
    const opptjeningKonfig = {
      ...PANEL_KONFIG.opptjening,
      delpaneler: PANEL_KONFIG.opptjening.delpaneler.map(delpanel =>
        delpanel.id === 'OPPTJENING' && !harVurderOpptjeningAP
          ? { ...delpanel, aksjonspunkter: [AksjonspunktDefinisjon.OVERSTYRING_AV_OPPTJENINGSVILKÅRET] }
          : delpanel,
      ),
    };

    const beregningAksjonspunkter = finnRelevanteAksjonspunkter(aksjonspunkter, PANEL_KONFIG.beregning.aksjonspunkter);
    const beregningVilkår = vilkår.filter(v =>
      PANEL_KONFIG.beregning.vilkår.some(vilkårType => vilkårType === v.vilkarType),
    );
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
      byggVilkårSteg(PANEL_KONFIG.inngangsvilkår, vilkår, aksjonspunkter),
      byggVilkårSteg(PANEL_KONFIG.sykdom, vilkår, aksjonspunkter),
      byggVilkårSteg(opptjeningKonfig, vilkår, aksjonspunkter),
      beregningSteg,
      byggStegMedOverstyrtStatus(PANEL_KONFIG.uttak, finnUttakStatus(uttak), aksjonspunkter, true),
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
  }, [vilkår, aksjonspunkter, uttak, beregningsresultatUtbetaling, simuleringResultat, behandling]);
};
