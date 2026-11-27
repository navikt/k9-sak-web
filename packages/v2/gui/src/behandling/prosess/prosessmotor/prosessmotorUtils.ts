import { BehandlingResultatType as behandlingResultatType } from '@k9-sak-web/backend/combined/kodeverk/behandling/BehandlingResultatType.js';
import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import { vilkårStatus as Utfall } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/VilkårStatus.js';
import { VilkårType } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/VilkårType.js';
import type { AksjonspunktDto } from '@k9-sak-web/backend/k9sak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import type { SimuleringDto } from '@k9-sak-web/backend/k9sak/kontrakt/simulering/v1/SimuleringDto.js';
import type { VilkårMedPerioderDto } from '@k9-sak-web/backend/k9sak/kontrakt/vilkår/VilkårMedPerioderDto.js';
import type { BeregningsresultatMedUtbetaltePeriodeDto } from '@k9-sak-web/backend/k9sak/kontrakt/beregningsresultat/BeregningsresultatMedUtbetaltePeriodeDto.js';
import { sjekkDelvisVilkårStatus } from '@k9-sak-web/gui/behandling/prosess/utils/vilkårUtils.js';
import { isAksjonspunktOpen } from '@k9-sak-web/gui/utils/aksjonspunktUtils.js';
import { ProcessMenuStepType } from '@navikt/ft-plattform-komponenter';

export const SØKNADSFRIST_DELPANEL_ID = 'SOKNADSFRIST';

export type StegStatus = typeof Utfall.OPPFYLT | typeof Utfall.IKKE_OPPFYLT | typeof Utfall.IKKE_VURDERT;

export interface ProsessmotorSteg {
  id: string;
  label: string;
  type: ProcessMenuStepType;
  usePartialStatus?: boolean;
  erVurdert?: boolean;
}

export interface Delpanel {
  id: string;
  vilkår: VilkårMedPerioderDto[];
  aksjonspunkter: AksjonspunktDto[];
  status: StegStatus;
}

export interface Steg {
  id: string;
  label: string;
  delpaneler: Delpanel[];
  påvirkesIkkeAvStopp?: boolean;
}

export const finnRelevanteAksjonspunkter = (
  aksjonspunkter: AksjonspunktDto[],
  definisjoner: readonly AksjonspunktDefinisjon[],
): AksjonspunktDto[] => aksjonspunkter.filter(ap => !!ap.definisjon && definisjoner.includes(ap.definisjon));

/**
 * Sjekker om beregningsresultatet kun inneholder avslåtte uttak
 */
export const harKunAvslåtteUttak = (
  beregningsresultatUtbetaling: BeregningsresultatMedUtbetaltePeriodeDto,
): boolean => {
  if (!beregningsresultatUtbetaling?.perioder) {
    return false;
  }
  const { perioder } = beregningsresultatUtbetaling;
  const alleUtfall = perioder.flatMap(({ andeler }) => [
    ...andeler.flatMap(({ uttak }) => [...(uttak ?? []).flatMap(({ utfall }) => utfall)]),
  ]);
  return !alleUtfall.some(utfall => utfall === 'INNVILGET');
};

// Samme regel som finnStatus i ProsessStegUtledet i gammel rigg
export const finnDelpanelStatus = (vilkår: VilkårMedPerioderDto[], aksjonspunkter: AksjonspunktDto[]): StegStatus => {
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
export const finnSamletStatus = (delpaneler: Delpanel[]): StegStatus => {
  if (delpaneler.some(delpanel => delpanel.status === Utfall.IKKE_OPPFYLT)) {
    return Utfall.IKKE_OPPFYLT;
  }
  const harOppfylt = delpaneler.some(delpanel => delpanel.status === Utfall.OPPFYLT);
  const harIkkeVurdert = delpaneler.some(delpanel => delpanel.status === Utfall.IKKE_VURDERT);
  return harOppfylt && !harIkkeVurdert ? Utfall.OPPFYLT : Utfall.IKKE_VURDERT;
};

export const harAksjonspunktSomKanLøses = (aksjonspunkter: AksjonspunktDto[]): boolean =>
  aksjonspunkter.some(ap => isAksjonspunktOpen(ap.status) && ap.kanLoses === true);

export const finnProsessmenyType = (status: StegStatus, harÅpentAksjonspunkt: boolean): ProcessMenuStepType => {
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
export const byggVilkårDelpanel = (
  konfig: { id: string; vilkår: readonly VilkårType[]; aksjonspunkter: readonly AksjonspunktDefinisjon[] },
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

export const byggVilkårSteg = (
  konfig: {
    id: string;
    label: string;
    delpaneler: readonly {
      id: string;
      vilkår: readonly VilkårType[];
      aksjonspunkter: readonly AksjonspunktDefinisjon[];
    }[];
  },
  vilkår: VilkårMedPerioderDto[],
  aksjonspunkter: AksjonspunktDto[],
): Steg | undefined => {
  const delpaneler = konfig.delpaneler
    .map(delpanel => byggVilkårDelpanel(delpanel, vilkår, aksjonspunkter))
    .filter(delpanel => delpanel !== undefined);
  return delpaneler.length > 0 ? { id: konfig.id, label: konfig.label, delpaneler } : undefined;
};

export const byggStegMedOverstyrtStatus = (
  konfig: { id: string; label: string; aksjonspunkter: readonly AksjonspunktDefinisjon[] },
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
export const erUnntattStoppPgaSøknadsfrist = (steg: Steg): boolean =>
  steg.delpaneler.some(delpanel => delpanel.id === SØKNADSFRIST_DELPANEL_ID) &&
  steg.delpaneler
    .filter(delpanel => delpanel.id !== SØKNADSFRIST_DELPANEL_ID)
    .every(delpanel => delpanel.status === Utfall.OPPFYLT);

// Samme stopp-regel som useProsessStegPaneler i prosessStegHooks i gammel rigg
export const byggMenysteg = (steg: Steg[]): ProsessmotorSteg[] => {
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

export const finnSimuleringStatus = (simuleringResultat: SimuleringDto | null | undefined): StegStatus =>
  simuleringResultat ? Utfall.OPPFYLT : Utfall.IKKE_VURDERT;

interface BehandlingMedResultat {
  behandlingsresultat?: { type?: { kode?: string } } | null;
}

// Samme regel som findStatusForVedtak i vedtakStatusUtlederPleiepenger i gammel rigg
export const finnVedtakStatus = (
  vilkår: VilkårMedPerioderDto[],
  aksjonspunkter: AksjonspunktDto[],
  behandling: BehandlingMedResultat,
  vedtakAksjonspunkter: readonly AksjonspunktDefinisjon[],
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
  return behandlingsresultatType === behandlingResultatType.AVSLÅTT ||
    behandlingsresultatType === behandlingResultatType.KLAGE_AVVIST ||
    behandlingsresultatType === behandlingResultatType.KLAGE_YTELSESVEDTAK_OPPHEVET
    ? Utfall.IKKE_OPPFYLT
    : Utfall.OPPFYLT;
};

export const beregnVedtakType = (
  vilkår: VilkårMedPerioderDto[],
  aksjonspunkter: AksjonspunktDto[],
  behandling: BehandlingMedResultat,
  vedtakAksjonspunkter: readonly AksjonspunktDefinisjon[],
): ProcessMenuStepType =>
  finnProsessmenyType(
    finnVedtakStatus(vilkår, aksjonspunkter, behandling, vedtakAksjonspunkter),
    harAksjonspunktSomKanLøses(finnRelevanteAksjonspunkter(aksjonspunkter, vedtakAksjonspunkter)),
  );

export const skalViseDelvisVedtakStatus = (vilkår: VilkårMedPerioderDto[]): boolean =>
  vilkår.some(v => v.perioder?.some(periode => periode.vilkarStatus === Utfall.IKKE_OPPFYLT)) &&
  vilkår.some(v => v.perioder?.some(periode => periode.vilkarStatus === Utfall.OPPFYLT));
