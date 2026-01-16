import {
  k9_kodeverk_behandling_aksjonspunkt_AksjonspunktStatus,
  k9_kodeverk_vilkår_Utfall,
  type k9_sak_kontrakt_aksjonspunkt_AksjonspunktDto,
  type k9_sak_kontrakt_vilkår_VilkårMedPerioderDto,
} from '@k9-sak-web/backend/k9sak/generated/types.js';
import { ProcessMenuStepType } from '@navikt/ft-plattform-komponenter';

/**
 * Type for vilkår med perioder.
 * Brukes som input til sjekkDelvisVilkårStatus.
 */
interface VilkårMedPerioder {
  perioder?: Array<{
    vurderesIBehandlingen?: boolean;
    vilkarStatus: k9_kodeverk_vilkår_Utfall;
  }>;
}

/**
 * Sjekker om vilkår har delvis status (blanding av oppfylt/ikke oppfylt/ikke vurdert).
 *
 * Brukes til å vise delvis fullføringsindikator i prosessmenyen når:
 * - Noen perioder er oppfylt, men ikke alle
 * - Noen perioder er ikke oppfylt, men ikke alle
 * - Noen perioder er ikke vurdert, men ikke alle
 *
 * @param vilkårForSteg - Array av vilkår med perioder som skal sjekkes
 * @returns true hvis vilkår har delvis status (blanding), false ellers
 *
 * @example
 * ```typescript
 * const vilkår = [
 *   {
 *     perioder: [
 *       { vurderesIBehandlingen: true, vilkarStatus: 'OPPFYLT' },
 *       { vurderesIBehandlingen: true, vilkarStatus: 'IKKE_OPPFYLT' }
 *     ]
 *   }
 * ];
 * const harDelvisStatus = sjekkDelvisVilkårStatus(vilkår); // true
 * ```
 */
export function sjekkDelvisVilkårStatus(vilkårForSteg: VilkårMedPerioder[]): boolean {
  if (vilkårForSteg.length === 0) {
    return false;
  }

  // Samle alle vilkårstatuser fra perioder som vurderes i behandlingen
  const vilkarStatusCodes: k9_kodeverk_vilkår_Utfall[] = [];
  vilkårForSteg.forEach(vilkår =>
    vilkår.perioder
      ?.filter(periode => periode.vurderesIBehandlingen)
      .forEach(periode => vilkarStatusCodes.push(periode.vilkarStatus)),
  );

  // Sjekk om alle vilkår har samme status
  const alleVilkårErIkkeVurdert = vilkarStatusCodes.every(vsc => vsc === k9_kodeverk_vilkår_Utfall.IKKE_VURDERT);
  const alleVilkårErIkkeOppfylt = vilkarStatusCodes.every(vsc => vsc === k9_kodeverk_vilkår_Utfall.IKKE_OPPFYLT);
  const alleVilkårErOppfylt = vilkarStatusCodes.every(vsc => vsc === k9_kodeverk_vilkår_Utfall.OPPFYLT);

  // Kun sjekk delvis status hvis det er flere vilkår
  const harFlereVilkår = vilkarStatusCodes.length > 1;

  if (harFlereVilkår) {
    // Sjekk om noen (men ikke alle) vilkår har en bestemt status
    const erDelvisIkkeVurdert =
      vilkarStatusCodes.some(vsc => vsc === k9_kodeverk_vilkår_Utfall.IKKE_VURDERT) && !alleVilkårErIkkeVurdert;

    const erDelvisIkkeOppfylt =
      vilkarStatusCodes.some(vsc => vsc === k9_kodeverk_vilkår_Utfall.IKKE_OPPFYLT) && !alleVilkårErIkkeOppfylt;

    const erDelvisOppfylt =
      vilkarStatusCodes.some(vsc => vsc === k9_kodeverk_vilkår_Utfall.OPPFYLT) && !alleVilkårErOppfylt;
    return erDelvisIkkeVurdert || erDelvisIkkeOppfylt || erDelvisOppfylt;
  }

  return false;
}

export const finnPanelStatus = (
  skalVisePanel: boolean,
  vilkårForSteg: k9_sak_kontrakt_vilkår_VilkårMedPerioderDto[],
  aksjonspunkter: k9_sak_kontrakt_aksjonspunkt_AksjonspunktDto[],
  relevanteAksjonspunktkoder: string[],
) => {
  // Hvis panelet ikke skal vises, bruk default
  if (!skalVisePanel) {
    return ProcessMenuStepType.default;
  }
  if (vilkårForSteg.length > 0) {
    // Samle alle periode-statuser fra alle relevante vilkår
    const vilkarStatusCodes: string[] = [];
    vilkårForSteg.forEach(vilkar => {
      vilkar.perioder
        ?.filter(periode => periode.vurderesIBehandlingen)
        .forEach(periode => vilkarStatusCodes.push(periode.vilkarStatus));
    });

    if (
      vilkarStatusCodes.length > 0 &&
      vilkarStatusCodes.every(vsc => vsc === k9_kodeverk_vilkår_Utfall.IKKE_VURDERT)
    ) {
      return ProcessMenuStepType.warning;
    }

    return vilkarStatusCodes.some(vsc => vsc === k9_kodeverk_vilkår_Utfall.OPPFYLT)
      ? ProcessMenuStepType.success
      : ProcessMenuStepType.danger;
  }

  const harApenAksjonspunkt = aksjonspunkter?.some(ap => {
    const kode = ap.definisjon;
    return (
      relevanteAksjonspunktkoder.some(relevantAksjonspunkt => relevantAksjonspunkt === kode) &&
      ap.status === k9_kodeverk_behandling_aksjonspunkt_AksjonspunktStatus.OPPRETTET
    );
  });
  if (harApenAksjonspunkt) {
    return ProcessMenuStepType.warning;
  }

  // Default tilstand
  return ProcessMenuStepType.default;
};
