import { isAvslag, isOpphor } from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import { VilkårMedPerioderDto } from '@k9-sak-web/backend/combined/kontrakt/vilkår/VilkårMedPerioderDto.js';
import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import { AksjonspunktStatus } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktStatus.js';
import { Utfall } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/Utfall.js';
import { vilkarType } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/VilkårType.js';
import { AksjonspunktDto } from '@k9-sak-web/backend/ungsak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import { BehandlingDto } from '@k9-sak-web/backend/ungsak/kontrakt/behandling/BehandlingDto.js';
import { SimuleringDto } from '@k9-sak-web/backend/ungsak/kontrakt/simulering/v1/SimuleringDto.js';
import { AktivitetspengerApi } from '@k9-sak-web/gui/prosess/aktivitetspenger-prosess/AktivitetspengerApi.js';
import {
  aksjonspunkterQueryOptions,
  beregningsgrunnlagQueryOptions,
  innloggetBrukerQueryOptions,
  kontrollerInntektQueryOptions,
  satsOgUtbetalingPerioderQueryOptions,
  simuleringResultatQueryOptions,
  vilkårQueryOptions,
} from '@k9-sak-web/gui/prosess/aktivitetspenger-prosess/aktivitetspengerQueryOptions.js';
import { isAksjonspunktOpen } from '@k9-sak-web/gui/utils/aksjonspunktUtils.js';
import { erAktivitetspengerOpphørsbehandling } from '@k9-sak-web/gui/utils/behandlingUtils.js';
import { prosessStegCodes } from '@k9-sak-web/gui/utils/skjermlenke/prosessStegCodes.js';
import { ProcessMenuStepType } from '@navikt/ft-plattform-komponenter';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

const PROSESS_STEG_KODER = {
  INNGANGSVILKAR: prosessStegCodes.INNGANGSVILKAR,
  MEDLEMSKAP: prosessStegCodes.FORUTGAENDE_MEDLEMSKAP,
  VEDTAK: prosessStegCodes.VEDTAK,
  BEREGNING: prosessStegCodes.BEREGNING,
  BEREGNET_UTBETALING: prosessStegCodes.KONTROLL_AV_INNTEKT,
  SIMULERING: prosessStegCodes.SIMULERING,
} as const;

const PANEL_KONFIG = {
  inngangsvilkår: {
    aksjonspunkter: [
      AksjonspunktDefinisjon.VURDER_BISTANDSVILKÅR,
      AksjonspunktDefinisjon.NAV_KONTOR_FORESLÅR_VILKÅR,
      AksjonspunktDefinisjon.NAV_KONTOR_BESLUTTER_VILKÅR,
      AksjonspunktDefinisjon.VURDER_ANDRE_LIVSOPPHOLDSYTELSER,
      AksjonspunktDefinisjon.VURDER_BOSTEDVILKÅR,
      AksjonspunktDefinisjon.KONTROLLER_OPPLYSNINGER_OM_SØKNADSFRIST,
      AksjonspunktDefinisjon.VURDER_AKTIVITETSVILKÅR,
    ],
    id: PROSESS_STEG_KODER.INNGANGSVILKAR,
    label: 'Inngangsvilkår',
    vilkår: [
      vilkarType.SØKNADSFRIST,
      vilkarType.BISTANDSVILKÅR,
      vilkarType.BOSTEDSVILKÅR,
      vilkarType.ANDRE_LIVSOPPHOLDSYTELSER_VILKÅR,
      vilkarType.ALDERSVILKÅR,
      vilkarType.AKTIVITETSVILKÅR,
    ],
  },
  vedtak: {
    aksjonspunkter: [
      AksjonspunktDefinisjon.FORESLÅ_VEDTAK,
      AksjonspunktDefinisjon.FATTER_VEDTAK,
      AksjonspunktDefinisjon.FORESLÅ_VEDTAK_MANUELT,
      AksjonspunktDefinisjon.VEDTAK_UTEN_TOTRINNSKONTROLL,
      AksjonspunktDefinisjon.KONTROLLER_REVURDERINGSBEHANDLING_VARSEL_VED_UGUNST,
      AksjonspunktDefinisjon.KONTROLL_AV_MANUELT_OPPRETTET_REVURDERINGSBEHANDLING,
      AksjonspunktDefinisjon.SJEKK_TILBAKEKREVING,
    ],
    id: PROSESS_STEG_KODER.VEDTAK,
    label: 'Vedtak',
  },
  beregning: {
    aksjonspunkter: [],
    id: PROSESS_STEG_KODER.BEREGNING,
    label: 'Beregning',
  },
  medlemskap: {
    aksjonspunkter: [AksjonspunktDefinisjon.AVKLAR_GYLDIG_MEDLEMSKAP],
    id: PROSESS_STEG_KODER.MEDLEMSKAP,
    label: 'Medlemskap',
    vilkår: [vilkarType.FORUTGÅENDE_MEDLEMSKAPSVILKÅRET],
  },
  beregnetUtbetaling: {
    aksjonspunkter: [AksjonspunktDefinisjon.KONTROLLER_INNTEKT],
    id: PROSESS_STEG_KODER.BEREGNET_UTBETALING,
    label: 'Beregnet utbetaling',
  },
  opphør: {
    aksjonspunkter: [
      AksjonspunktDefinisjon.VURDER_FAKTA_OM_BOSTED,
      AksjonspunktDefinisjon.VURDER_BOSTEDVILKÅR,
      AksjonspunktDefinisjon.VURDER_BOSTEDSVILKÅR_OPPHØR,
      AksjonspunktDefinisjon.NAV_KONTOR_FORESLÅR_VILKÅR,
      AksjonspunktDefinisjon.NAV_KONTOR_BESLUTTER_VILKÅR,
      AksjonspunktDefinisjon.AUTO_SATT_PÅ_VENT_ETTERLYST_BOSTEDUTTALELSE,
      AksjonspunktDefinisjon.VURDER_FAKTA_OM_ANDRE_LIVSOPPHOLDSYTELSER,
      AksjonspunktDefinisjon.VURDER_ANDRE_LIVSOPPHOLDSYTELSER_OPPHØR,
      AksjonspunktDefinisjon.AUTO_SATT_PÅ_VENT_ETTERLYST_LIVSOPPHOLDSYTELSEUTTALELSE,
    ],
    id: prosessStegCodes.OPPHØR,
    label: 'Opphør',
    vilkår: [],
  },
  simulering: {
    aksjonspunkter: [AksjonspunktDefinisjon.VURDER_FEILUTBETALING],
    id: PROSESS_STEG_KODER.SIMULERING,
    label: 'Simulering',
  },
} as const;

export const harData = (data: unknown): boolean => {
  if (data === null || data === undefined) {
    return false;
  }
  if (Array.isArray(data)) {
    return data.length > 0;
  }
  // Tomme svar (204/Content-Length 0) kan komme fra SDK-klienten som {} eller ReadableStream
  if (typeof data === 'object') {
    return Object.keys(data).length > 0;
  }
  return true;
};

const beholdForrigeDataForSammeBehandling =
  (uuid: string) =>
  <T>(prev: T | undefined, prevQuery: { queryKey: readonly unknown[] } | undefined): T | undefined =>
    prevQuery?.queryKey[1] === uuid ? prev : undefined;

interface ProcessMenuStep {
  id: string;
  label: string;
  type: ProcessMenuStepType;
  usePartialStatus?: boolean;
  locked?: boolean;
}

type VilkårPeriode = NonNullable<VilkårMedPerioderDto['perioder']>[number];

// Vises som «Ingen perioder å vurdere» i panelene, og skal verken gi avslag eller stoppe senere steg
const erIkkeRelevant = (vilkår: VilkårMedPerioderDto): boolean => {
  const perioder: VilkårPeriode[] = vilkår.perioder ?? [];
  return perioder.length > 0 && perioder.every(periode => periode.vilkarStatus === Utfall.IKKE_RELEVANT);
};

// Perioder som avgjør både status og delvisstatus for et vilkårspanel
const finnPerioderSomTeller = (vilkår: VilkårMedPerioderDto[]): VilkårPeriode[] => {
  const relevantePerioder = vilkår
    .flatMap((v): VilkårPeriode[] => v.perioder ?? [])
    .filter(periode => periode.vilkarStatus !== Utfall.IKKE_RELEVANT);
  const perioderIBehandlingen = relevantePerioder.filter(periode => periode.vurderesIBehandlingen);
  // Avvik fra gammel rigg: vurderes ingen perioder i denne behandlingen (f.eks. revurdering),
  // brukes utfallet fra tidligere behandling i stedet for å vise vilkåret som ikke vurdert
  return perioderIBehandlingen.length > 0 ? perioderIBehandlingen : relevantePerioder;
};

// Samme regel som sjekkDelvisVilkårStatus, men på perioder fra finnPerioderSomTeller
const erDelvisVurdert = (vilkår: VilkårMedPerioderDto[]): boolean => {
  const statuser = new Set(finnPerioderSomTeller(vilkår).map(periode => periode.vilkarStatus));
  return statuser.size > 1 && (statuser.has(Utfall.OPPFYLT) || statuser.has(Utfall.IKKE_OPPFYLT));
};

const finnStatus = (vilkår: VilkårMedPerioderDto[], aksjonspunkter: AksjonspunktDto[]): Utfall => {
  if (vilkår.length > 0) {
    const vilkårStatus = finnPerioderSomTeller(vilkår).map(periode => periode.vilkarStatus);

    if (vilkårStatus.length === 0 || vilkårStatus.some(status => status === Utfall.IKKE_VURDERT)) {
      return Utfall.IKKE_VURDERT;
    }

    return vilkårStatus.some(status => status === Utfall.OPPFYLT) ? Utfall.OPPFYLT : Utfall.IKKE_OPPFYLT;
  }

  if (aksjonspunkter.length > 0) {
    return aksjonspunkter.some(ap => typeof ap.status === 'string' && isAksjonspunktOpen(ap.status))
      ? Utfall.IKKE_VURDERT
      : Utfall.OPPFYLT;
  }
  return Utfall.IKKE_VURDERT;
};

const harÅpentAksjonspunkt = (relevanteAksjonspunkter: AksjonspunktDto[]): boolean =>
  relevanteAksjonspunkter.some(ap => ap.status === AksjonspunktStatus.OPPRETTET && ap.kanLoses === true);

const finnProsessmenyType = (status: Utfall, harÅpentAp: boolean): ProcessMenuStepType => {
  if (harÅpentAp) {
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

interface InngangsvilkårDelpanel {
  vilkårType: string;
  vilkår: VilkårMedPerioderDto[];
  status: Utfall;
}

// Ett delpanel per inngangsvilkår, som i gammel rigg
const byggInngangsvilkårDelpaneler = (vilkår: VilkårMedPerioderDto[]): InngangsvilkårDelpanel[] =>
  PANEL_KONFIG.inngangsvilkår.vilkår.flatMap(vilkårType => {
    const vilkårForType = vilkår.filter(v => v.vilkarType === vilkårType && !erIkkeRelevant(v));
    if (vilkårForType.length === 0) {
      return [];
    }
    return [{ vilkårType, vilkår: vilkårForType, status: finnStatus(vilkårForType, []) }];
  });

// Slår sammen delpanelstatuser på samme måte som ProsessStegUtledet.getStatus i gammel rigg
const finnSamletStatus = (statuser: Utfall[]): Utfall => {
  if (statuser.includes(Utfall.IKKE_OPPFYLT)) {
    return Utfall.IKKE_OPPFYLT;
  }
  if (statuser.includes(Utfall.OPPFYLT) && !statuser.includes(Utfall.IKKE_VURDERT)) {
    return Utfall.OPPFYLT;
  }
  return Utfall.IKKE_VURDERT;
};

const finnStatusForVedtak = (
  vilkår: VilkårMedPerioderDto[],
  aksjonspunkter: AksjonspunktDto[],
  vedtakAksjonspunkter: readonly string[],
  behandling: Pick<BehandlingDto, 'behandlingsresultat'>,
): Utfall => {
  if (vilkår.length === 0) {
    return Utfall.IKKE_VURDERT;
  }

  if (vilkår.some(v => (v.perioder ?? []).some(periode => periode.vilkarStatus === Utfall.IKKE_VURDERT))) {
    return Utfall.IKKE_VURDERT;
  }

  if (
    aksjonspunkter.some(
      ap =>
        !vedtakAksjonspunkter.some(definisjon => definisjon === ap.definisjon) && isAksjonspunktOpen(ap.status ?? ''),
    )
  ) {
    return Utfall.IKKE_VURDERT;
  }

  const behandlingsresultatType = behandling.behandlingsresultat?.type;
  if (typeof behandlingsresultatType !== 'string') {
    return Utfall.IKKE_VURDERT;
  }
  return isAvslag(behandlingsresultatType) || isOpphor(behandlingsresultatType) ? Utfall.IKKE_OPPFYLT : Utfall.OPPFYLT;
};

export const beregnSimuleringType = (
  aksjonspunkter: AksjonspunktDto[],
  simuleringResultat: SimuleringDto | null | undefined,
  simuleringAksjonspunkter: readonly string[],
): ProcessMenuStepType => {
  const relevanteAksjonspunkter = aksjonspunkter.filter(ap =>
    simuleringAksjonspunkter.some(definisjon => definisjon === ap.definisjon),
  );
  const status = harData(simuleringResultat) ? Utfall.OPPFYLT : Utfall.IKKE_VURDERT;
  return finnProsessmenyType(status, harÅpentAksjonspunkt(relevanteAksjonspunkter));
};

interface ProsessmotorProps {
  api: AktivitetspengerApi;
  behandling: Pick<BehandlingDto, 'uuid' | 'versjon' | 'status' | 'behandlingsresultat' | 'type' | 'behandlingÅrsaker'>;
}

export interface ProsessmotorResultat {
  prosessteg: ProcessMenuStep[];
  erKlar: boolean;
}

export const useProsessmotor = ({ api, behandling }: ProsessmotorProps): ProsessmotorResultat => {
  const vilkårQuery = useQuery({
    ...vilkårQueryOptions(api, behandling),
    placeholderData: beholdForrigeDataForSammeBehandling(behandling.uuid),
  });
  const aksjonspunkterQuery = useQuery({
    ...aksjonspunkterQueryOptions(api, behandling),
    placeholderData: beholdForrigeDataForSammeBehandling(behandling.uuid),
  });
  const beregningsgrunnlagQuery = useQuery({
    ...beregningsgrunnlagQueryOptions(api, behandling),
    placeholderData: beholdForrigeDataForSammeBehandling(behandling.uuid),
    throwOnError: false,
  });
  const satserQuery = useQuery({
    ...satsOgUtbetalingPerioderQueryOptions(api, behandling),
    placeholderData: beholdForrigeDataForSammeBehandling(behandling.uuid),
    throwOnError: false,
  });
  const kontrollerInntektQuery = useQuery({
    ...kontrollerInntektQueryOptions(api, behandling),
    placeholderData: beholdForrigeDataForSammeBehandling(behandling.uuid),
    throwOnError: false,
  });
  const simuleringResultatQuery = useQuery({
    ...simuleringResultatQueryOptions(api, behandling),
    placeholderData: beholdForrigeDataForSammeBehandling(behandling.uuid),
    throwOnError: false,
  });
  const { data: vilkår } = vilkårQuery;
  const { data: aksjonspunkter } = aksjonspunkterQuery;
  const { data: innloggetBruker } = useQuery(innloggetBrukerQueryOptions(api));
  const { data: beregningsgrunnlag } = beregningsgrunnlagQuery;
  const { data: satser } = satserQuery;
  const { data: kontrollerInntekt } = kontrollerInntektQuery;
  const { data: simuleringResultat } = simuleringResultatQuery;

  const erKlar =
    !vilkårQuery.isFetching &&
    !aksjonspunkterQuery.isFetching &&
    !beregningsgrunnlagQuery.isFetching &&
    !satserQuery.isFetching &&
    !kontrollerInntektQuery.isFetching &&
    !simuleringResultatQuery.isFetching &&
    !!vilkår &&
    !!aksjonspunkter &&
    !!innloggetBruker;

  const prosessteg = useMemo(() => {
    const erOpphør = erAktivitetspengerOpphørsbehandling(behandling);
    const alleVilkår = vilkår ?? [];
    const alleAksjonspunkter = aksjonspunkter ?? [];
    const inngangsvilkårDelpaneler = erOpphør ? [] : byggInngangsvilkårDelpaneler(alleVilkår);
    const inngangsvilkårAksjonspunktkoder = erOpphør
      ? PANEL_KONFIG.opphør.aksjonspunkter
      : PANEL_KONFIG.inngangsvilkår.aksjonspunkter;
    const relevanteInngangsvilkårAksjonspunkter = alleAksjonspunkter.filter(ap =>
      inngangsvilkårAksjonspunktkoder.some(definisjon => definisjon === ap.definisjon),
    );
    // Uten inngangsvilkår (f.eks. opphør) utledes status fra aksjonspunktene
    const inngangsvilkårStatus =
      inngangsvilkårDelpaneler.length > 0
        ? finnSamletStatus(inngangsvilkårDelpaneler.map(delpanel => delpanel.status))
        : finnStatus([], relevanteInngangsvilkårAksjonspunkter);

    const relevanteMedlemskapVilkår = alleVilkår.filter(
      v => PANEL_KONFIG.medlemskap.vilkår.some(vilkårType => vilkårType === v.vilkarType) && !erIkkeRelevant(v),
    );
    const relevanteMedlemskapAksjonspunkter = alleAksjonspunkter.filter(ap =>
      PANEL_KONFIG.medlemskap.aksjonspunkter.some(definisjon => definisjon === ap.definisjon),
    );
    const relevanteBeregnetUtbetalingAksjonspunkter = alleAksjonspunkter.filter(ap =>
      PANEL_KONFIG.beregnetUtbetaling.aksjonspunkter.some(definisjon => definisjon === ap.definisjon),
    );
    const relevanteSimuleringAksjonspunkter = alleAksjonspunkter.filter(ap =>
      PANEL_KONFIG.simulering.aksjonspunkter.some(definisjon => definisjon === ap.definisjon),
    );
    const relevanteVedtakAksjonspunkter = alleAksjonspunkter.filter(ap =>
      PANEL_KONFIG.vedtak.aksjonspunkter.some(definisjon => definisjon === ap.definisjon),
    );

    const paneler: {
      id: string;
      label: string;
      status: Utfall;
      aksjonspunkter: AksjonspunktDto[];
      usePartialStatus: boolean;
      // Paneler uten vilkår eller aksjonspunkter å vurdere skal ikke stoppe senere steg
      stopperSenereSteg?: boolean;
      erInngangsvilkår?: boolean;
      inngangsvilkårDelpaneler?: { vilkårType: string; status: Utfall }[];
    }[] = [
      {
        id: erOpphør ? PANEL_KONFIG.opphør.id : PANEL_KONFIG.inngangsvilkår.id,
        label: erOpphør ? PANEL_KONFIG.opphør.label : PANEL_KONFIG.inngangsvilkår.label,
        status: inngangsvilkårStatus,
        aksjonspunkter: relevanteInngangsvilkårAksjonspunkter,
        usePartialStatus: !erOpphør && inngangsvilkårDelpaneler.some(delpanel => erDelvisVurdert(delpanel.vilkår)),
        stopperSenereSteg: inngangsvilkårDelpaneler.length > 0 || relevanteInngangsvilkårAksjonspunkter.length > 0,
        erInngangsvilkår: !erOpphør,
        inngangsvilkårDelpaneler,
      },
      {
        id: PANEL_KONFIG.medlemskap.id,
        label: PANEL_KONFIG.medlemskap.label,
        status: finnStatus(relevanteMedlemskapVilkår, relevanteMedlemskapAksjonspunkter),
        aksjonspunkter: relevanteMedlemskapAksjonspunkter,
        usePartialStatus: erDelvisVurdert(relevanteMedlemskapVilkår),
        stopperSenereSteg: relevanteMedlemskapVilkår.length > 0 || relevanteMedlemskapAksjonspunkter.length > 0,
      },
      {
        id: PANEL_KONFIG.beregning.id,
        label: PANEL_KONFIG.beregning.label,
        status: harData(beregningsgrunnlag) ? Utfall.OPPFYLT : Utfall.IKKE_VURDERT,
        aksjonspunkter: [],
        usePartialStatus: false,
      },
      {
        id: PANEL_KONFIG.beregnetUtbetaling.id,
        label: PANEL_KONFIG.beregnetUtbetaling.label,
        status: harData(satser) || harData(kontrollerInntekt?.kontrollperioder) ? Utfall.OPPFYLT : Utfall.IKKE_VURDERT,
        aksjonspunkter: relevanteBeregnetUtbetalingAksjonspunkter,
        usePartialStatus: false,
      },
      {
        id: PANEL_KONFIG.simulering.id,
        label: PANEL_KONFIG.simulering.label,
        status: harData(simuleringResultat) ? Utfall.OPPFYLT : Utfall.IKKE_VURDERT,
        aksjonspunkter: relevanteSimuleringAksjonspunkter,
        usePartialStatus: false,
      },
      {
        id: PANEL_KONFIG.vedtak.id,
        label: PANEL_KONFIG.vedtak.label,
        status: finnStatusForVedtak(alleVilkår, alleAksjonspunkter, PANEL_KONFIG.vedtak.aksjonspunkter, behandling),
        aksjonspunkter: relevanteVedtakAksjonspunkter,
        usePartialStatus:
          alleVilkår.some(v => (v.perioder ?? []).some(periode => periode.vilkarStatus === Utfall.IKKE_OPPFYLT)) &&
          alleVilkår.some(v => (v.perioder ?? []).some(periode => periode.vilkarStatus === Utfall.OPPFYLT)),
      },
    ];

    let stanset = false;
    let forrigeEndeligStatus: Utfall | undefined;

    return paneler.map((panel, index) => {
      const hoppOverStopp = panel.id === PANEL_KONFIG.simulering.id || panel.id === PANEL_KONFIG.vedtak.id;
      if (index > 0 && !hoppOverStopp) {
        const forrigePanel = paneler[index - 1];
        const harSøknadsfrist =
          forrigePanel.erInngangsvilkår &&
          forrigePanel.inngangsvilkårDelpaneler?.some(delpanel => delpanel.vilkårType === vilkarType.SØKNADSFRIST);
        const alleAndreVilkårOppfylt = harSøknadsfrist
          ? forrigePanel.inngangsvilkårDelpaneler
              ?.filter(delpanel => delpanel.vilkårType !== vilkarType.SØKNADSFRIST)
              .every(delpanel => delpanel.status === Utfall.OPPFYLT)
          : false;

        if (
          (forrigeEndeligStatus === Utfall.IKKE_OPPFYLT || forrigeEndeligStatus === Utfall.IKKE_VURDERT) &&
          !alleAndreVilkårOppfylt &&
          forrigePanel.stopperSenereSteg !== false
        ) {
          stanset = true;
        }
      }

      const endeligStatus = stanset && !hoppOverStopp ? Utfall.IKKE_VURDERT : panel.status;
      const type = finnProsessmenyType(endeligStatus, harÅpentAksjonspunkt(panel.aksjonspunkter));
      const result: ProcessMenuStep = {
        id: panel.id,
        label: panel.label,
        type,
        usePartialStatus: type === ProcessMenuStepType.success && panel.usePartialStatus,
      };
      if (index === 0) {
        result.locked =
          type === ProcessMenuStepType.success &&
          !innloggetBruker?.aktivitetspengerDel1SaksbehandlerTilgang?.kanBeslutte &&
          !innloggetBruker?.aktivitetspengerDel1SaksbehandlerTilgang?.kanSaksbehandle;
      }
      forrigeEndeligStatus = endeligStatus;
      return result;
    });
  }, [
    aksjonspunkter,
    beregningsgrunnlag,
    behandling,
    innloggetBruker,
    kontrollerInntekt,
    satser,
    simuleringResultat,
    vilkår,
  ]);

  return { prosessteg, erKlar };
};
