import { isAvslag } from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/combined/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import { vilkårStatus as Utfall } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/VilkårStatus.js';
import { VilkårType } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/VilkårType.js';
import type { AksjonspunktDto } from '@k9-sak-web/backend/k9sak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import type { BeregningsresultatMedUtbetaltePeriodeDto } from '@k9-sak-web/backend/k9sak/kontrakt/beregningsresultat/BeregningsresultatMedUtbetaltePeriodeDto.js';
import type { SimuleringDto } from '@k9-sak-web/backend/k9sak/kontrakt/simulering/v1/SimuleringDto.js';
import type { VilkårMedPerioderDto } from '@k9-sak-web/backend/k9sak/kontrakt/vilkår/VilkårMedPerioderDto.js';
import { sjekkDelvisVilkårStatus } from '@k9-sak-web/gui/behandling/prosess/utils/vilkårUtils.js';
import { useUttakApi } from '@k9-sak-web/gui/prosess/uttak/api/UttakApiContext.js';
import { uttakQueryOptions } from '@k9-sak-web/gui/prosess/uttak/api/uttakQueryOptions.js';
import type { Uttak } from '@k9-sak-web/gui/prosess/uttak/types/Uttak.js';
import { isAksjonspunktOpen } from '@k9-sak-web/gui/utils/aksjonspunktUtils.js';
import { prosessStegCodes } from '@k9-sak-web/gui/utils/skjermlenke/prosessStegCodes.js';
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
  vilkårQueryOptions,
} from './k9SakQueryOptions';

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

const SØKNADSFRIST_DELPANEL_ID = 'SOKNADSFRIST';

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

type StegStatus = typeof Utfall.OPPFYLT | typeof Utfall.IKKE_OPPFYLT | typeof Utfall.IKKE_VURDERT;

interface ProcessMenuStep {
  id: string;
  label: string;
  type: ProcessMenuStepType;
  usePartialStatus?: boolean;
  erVurdert?: boolean;
}

interface Delpanel {
  id: string;
  vilkår: VilkårMedPerioderDto[];
  aksjonspunkter: AksjonspunktDto[];
  status: StegStatus;
}

interface Steg {
  id: string;
  label: string;
  delpaneler: Delpanel[];
  påvirkesIkkeAvStopp?: boolean;
}

const finnRelevanteAksjonspunkter = (
  aksjonspunkter: AksjonspunktDto[],
  definisjoner: readonly string[],
): AksjonspunktDto[] => aksjonspunkter.filter(ap => !!ap.definisjon && definisjoner.includes(ap.definisjon));

// Samme regel som finnStatus i ProsessStegUtledet i gammel rigg
const finnDelpanelStatus = (vilkår: VilkårMedPerioderDto[], aksjonspunkter: AksjonspunktDto[]): StegStatus => {
  if (vilkår.length > 0) {
    const statuser = vilkår
      .flatMap(v => v.perioder ?? [])
      .filter(periode => periode.vurderesIBehandlingen)
      .map(periode => periode.vilkarStatus);

    if (statuser.length === 0 || statuser.some(status => status === Utfall.IKKE_VURDERT)) {
      return Utfall.IKKE_VURDERT;
    }
    return statuser.some(status => status === Utfall.OPPFYLT) ? Utfall.OPPFYLT : Utfall.IKKE_OPPFYLT;
  }

  if (aksjonspunkter.length > 0) {
    return aksjonspunkter.some(ap => isAksjonspunktOpen(ap.status)) ? Utfall.IKKE_VURDERT : Utfall.OPPFYLT;
  }
  return Utfall.IKKE_VURDERT;
};

// Samme regel som ProsessStegUtledet.getStatus i gammel rigg
const finnSamletStatus = (delpaneler: Delpanel[]): StegStatus => {
  if (delpaneler.some(delpanel => delpanel.status === Utfall.IKKE_OPPFYLT)) {
    return Utfall.IKKE_OPPFYLT;
  }
  const harOppfylt = delpaneler.some(delpanel => delpanel.status === Utfall.OPPFYLT);
  const harIkkeVurdert = delpaneler.some(delpanel => delpanel.status === Utfall.IKKE_VURDERT);
  return harOppfylt && !harIkkeVurdert ? Utfall.OPPFYLT : Utfall.IKKE_VURDERT;
};

const harAksjonspunktSomKanLøses = (aksjonspunkter: AksjonspunktDto[]): boolean =>
  aksjonspunkter.some(ap => isAksjonspunktOpen(ap.status) && ap.kanLoses === true);

const finnProsessmenyType = (status: StegStatus, harÅpentAksjonspunkt: boolean): ProcessMenuStepType => {
  if (harÅpentAksjonspunkt) {
    return ProcessMenuStepType.warning;
  }
  if (status === Utfall.OPPFYLT) {
    return ProcessMenuStepType.success;
  }
  if (status === Utfall.IKKE_OPPFYLT) {
    return ProcessMenuStepType.danger;
  }
  return ProcessMenuStepType.default;
};

// Delpaneler for vilkår vises bare når behandlingen har vilkåret, som i gammel rigg
const byggVilkårDelpanel = (
  konfig: { id: string; vilkår: readonly string[]; aksjonspunkter: readonly string[] },
  alleVilkår: VilkårMedPerioderDto[],
  alleAksjonspunkter: AksjonspunktDto[],
): Delpanel | undefined => {
  const vilkår = alleVilkår.filter(v => konfig.vilkår.includes(v.vilkarType));
  if (vilkår.length === 0) {
    return undefined;
  }
  const aksjonspunkter = finnRelevanteAksjonspunkter(alleAksjonspunkter, konfig.aksjonspunkter);
  return { id: konfig.id, vilkår, aksjonspunkter, status: finnDelpanelStatus(vilkår, aksjonspunkter) };
};

const byggVilkårSteg = (
  konfig: {
    id: string;
    label: string;
    delpaneler: readonly { id: string; vilkår: readonly string[]; aksjonspunkter: readonly string[] }[];
  },
  vilkår: VilkårMedPerioderDto[],
  aksjonspunkter: AksjonspunktDto[],
): Steg | undefined => {
  const delpaneler = konfig.delpaneler
    .map(delpanel => byggVilkårDelpanel(delpanel, vilkår, aksjonspunkter))
    .filter(delpanel => delpanel !== undefined);
  return delpaneler.length > 0 ? { id: konfig.id, label: konfig.label, delpaneler } : undefined;
};

const byggStegMedOverstyrtStatus = (
  konfig: { id: string; label: string; aksjonspunkter: readonly string[] },
  status: StegStatus,
  aksjonspunkter: AksjonspunktDto[],
  påvirkesIkkeAvStopp = false,
): Steg => ({
  id: konfig.id,
  label: konfig.label,
  påvirkesIkkeAvStopp,
  delpaneler: [
    {
      id: konfig.id,
      vilkår: [],
      aksjonspunkter: finnRelevanteAksjonspunkter(aksjonspunkter, konfig.aksjonspunkter),
      status,
    },
  ],
});

// Gammel rigg stopper ikke senere steg når bare søknadsfristvilkåret er avslått eller ikke vurdert
const erUnntattStoppPgaSøknadsfrist = (steg: Steg): boolean =>
  steg.delpaneler.some(delpanel => delpanel.id === SØKNADSFRIST_DELPANEL_ID) &&
  steg.delpaneler
    .filter(delpanel => delpanel.id !== SØKNADSFRIST_DELPANEL_ID)
    .every(delpanel => delpanel.status === Utfall.OPPFYLT);

// Samme stopp-regel som useProsessStegPaneler i prosessStegHooks i gammel rigg
const byggMenysteg = (steg: Steg[]): ProcessMenuStep[] => {
  let stanset = false;
  const endeligeStatuser: StegStatus[] = [];

  return steg.map((gjeldendeSteg, index) => {
    const forrigeSteg = steg[index - 1];
    let erStanset = false;
    if (forrigeSteg && !gjeldendeSteg.påvirkesIkkeAvStopp) {
      const forrigeStatus = endeligeStatuser[index - 1];
      if (
        (forrigeStatus === Utfall.IKKE_OPPFYLT || forrigeStatus === Utfall.IKKE_VURDERT) &&
        !erUnntattStoppPgaSøknadsfrist(forrigeSteg)
      ) {
        stanset = true;
      }
      erStanset = stanset;
    }

    const status = erStanset ? Utfall.IKKE_VURDERT : finnSamletStatus(gjeldendeSteg.delpaneler);
    endeligeStatuser.push(status);

    const type = finnProsessmenyType(
      status,
      gjeldendeSteg.delpaneler.some(delpanel => harAksjonspunktSomKanLøses(delpanel.aksjonspunkter)),
    );

    return {
      id: gjeldendeSteg.id,
      label: gjeldendeSteg.label,
      type,
      // Avvik fra gammel rigg: delvis vurdert vises bare på grønne steg
      usePartialStatus:
        type === ProcessMenuStepType.success &&
        gjeldendeSteg.delpaneler.some(delpanel => sjekkDelvisVilkårStatus(delpanel.vilkår)),
      erVurdert: status !== Utfall.IKKE_VURDERT,
    };
  });
};

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

export const finnSimuleringStatus = (simuleringResultat: SimuleringDto | null | undefined): StegStatus =>
  simuleringResultat ? Utfall.OPPFYLT : Utfall.IKKE_VURDERT;

// Samme regel som findStatusForVedtak i vedtakStatusUtlederPleiepenger i gammel rigg
const finnVedtakStatus = (
  vilkår: VilkårMedPerioderDto[],
  aksjonspunkter: AksjonspunktDto[],
  behandling: Pick<Behandling, 'behandlingsresultat'>,
  vedtakAksjonspunkter: readonly string[],
): StegStatus => {
  if (vilkår.length === 0) {
    return Utfall.IKKE_VURDERT;
  }
  const harIkkeVurdertVilkår = vilkår.some(v =>
    v.perioder?.some(periode => periode.vilkarStatus === Utfall.IKKE_VURDERT),
  );
  const harÅpentAksjonspunktUtenforVedtak = aksjonspunkter.some(
    ap => !!ap.definisjon && !vedtakAksjonspunkter.includes(ap.definisjon) && isAksjonspunktOpen(ap.status),
  );
  if (harIkkeVurdertVilkår || harÅpentAksjonspunktUtenforVedtak) {
    return Utfall.IKKE_VURDERT;
  }
  // Gammel rigg krasjer uten behandlingsresultat; her vises steget som ikke vurdert
  const behandlingsresultatType = behandling.behandlingsresultat?.type?.kode;
  if (!behandlingsresultatType) {
    return Utfall.IKKE_VURDERT;
  }
  return isAvslag(behandlingsresultatType) ? Utfall.IKKE_OPPFYLT : Utfall.OPPFYLT;
};

export const beregnVedtakType = (
  vilkår: VilkårMedPerioderDto[],
  aksjonspunkter: AksjonspunktDto[],
  behandling: Pick<Behandling, 'behandlingsresultat'>,
  vedtakAksjonspunkter: readonly string[],
): ProcessMenuStepType =>
  finnProsessmenyType(
    finnVedtakStatus(vilkår, aksjonspunkter, behandling, vedtakAksjonspunkter),
    harAksjonspunktSomKanLøses(finnRelevanteAksjonspunkter(aksjonspunkter, vedtakAksjonspunkter)),
  );

const skalViseDelvisVedtakStatus = (vilkår: VilkårMedPerioderDto[]): boolean =>
  vilkår.some(v => v.perioder?.some(periode => periode.vilkarStatus === Utfall.IKKE_OPPFYLT)) &&
  vilkår.some(v => v.perioder?.some(periode => periode.vilkarStatus === Utfall.OPPFYLT));

interface ProsessmotorProps {
  api: K9SakProsessApi;
  behandling: Pick<Behandling, 'uuid' | 'versjon' | 'behandlingsresultat' | 'status'>;
}

export const useProsessmotor = ({ api, behandling }: ProsessmotorProps): ProcessMenuStep[] => {
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
    const vedtakPanel: ProcessMenuStep = {
      id: PANEL_KONFIG.vedtak.id,
      label: PANEL_KONFIG.vedtak.label,
      type: vedtakType,
      usePartialStatus: vedtakType === ProcessMenuStepType.success && skalViseDelvisVedtakStatus(vilkår),
      erVurdert: vedtakType === ProcessMenuStepType.success || vedtakType === ProcessMenuStepType.danger,
    };

    return [...byggMenysteg(steg), vedtakPanel];
  }, [vilkår, aksjonspunkter, uttak, beregningsresultatUtbetaling, simuleringResultat, behandling]);
};
