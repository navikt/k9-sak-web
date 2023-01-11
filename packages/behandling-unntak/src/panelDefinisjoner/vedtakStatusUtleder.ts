import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import { isAvslag } from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import Behandlingsresultat from '@k9-sak-web/types/src/behandlingsresultatTsType';
import { Aksjonspunkt, Vilkar } from '@k9-sak-web/types';

// TODO (TOR) Kan denne skrivast om? For høg kompleksitet.

const hasOnlyClosedAps = (aksjonspunkter: Aksjonspunkt[], vedtakAksjonspunkter) =>
  aksjonspunkter
    .filter(ap => !vedtakAksjonspunkter.some(vap => vap.definisjon === ap.definisjon))
    .every(ap => !isAksjonspunktOpen(ap.status));

const hasAksjonspunkt = (ap: Aksjonspunkt) => ap.definisjon === aksjonspunktCodes.OVERSTYR_BEREGNING;

const isAksjonspunktOpenAndOfType = (ap: Aksjonspunkt) => hasAksjonspunkt(ap) && isAksjonspunktOpen(ap.status);

const harVilkårSomIkkeErOppfylt = (vilkar: Vilkar[]) =>
  vilkar.some(v => v.perioder.some(periode => periode.vilkarStatus === vilkarUtfallType.IKKE_OPPFYLT));

const harVilkårSomIkkeErVurdert = (vilkar: Vilkar[]) =>
  vilkar.some(v => v.perioder.some(periode => periode.vilkarStatus === vilkarUtfallType.IKKE_VURDERT));

const findStatusForVedtak = (
  vilkar: Vilkar[],
  aksjonspunkter: Aksjonspunkt[],
  vedtakAksjonspunkter,
  behandlingsresultat: Behandlingsresultat,
) => {
  if (vilkar.length === 0) {
    return vilkarUtfallType.IKKE_VURDERT;
  }

  if (hasOnlyClosedAps(aksjonspunkter, vedtakAksjonspunkter) && harVilkårSomIkkeErOppfylt(vilkar)) {
    return vilkarUtfallType.IKKE_OPPFYLT;
  }

  // TODO (Magnus) Burde ikke denne sjekke om vilkår ikke er oppfyllt snarere enn om de ikke er vurdert?
  if (harVilkårSomIkkeErVurdert(vilkar) || aksjonspunkter.some(isAksjonspunktOpenAndOfType)) {
    return vilkarUtfallType.IKKE_VURDERT;
  }

  if (!hasOnlyClosedAps(aksjonspunkter, vedtakAksjonspunkter)) {
    return vilkarUtfallType.IKKE_VURDERT;
  }

  if (isAvslag(behandlingsresultat.type.kode)) {
    return vilkarUtfallType.IKKE_OPPFYLT;
  }
  return vilkarUtfallType.OPPFYLT;
};

export default findStatusForVedtak;
