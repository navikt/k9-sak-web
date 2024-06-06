import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import { isAvslag } from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';

// TODO (TOR) Kan denne skrivast om? For høg kompleksitet.

const hasOnlyClosedAps = (aksjonspunkter, vedtakAksjonspunkter) =>
  aksjonspunkter
    .filter(ap => !vedtakAksjonspunkter.some(vap => vap.definisjon === ap.definisjon))
    .every(ap => !isAksjonspunktOpen(ap.status));

const hasAksjonspunkt = ap => ap.definisjon === aksjonspunktCodes.OVERSTYR_BEREGNING;

const isAksjonspunktOpenAndOfType = ap => hasAksjonspunkt(ap) && isAksjonspunktOpen(ap.status);

const findStatusForVedtak = (vilkar, aksjonspunkter, vedtakAksjonspunkter, behandlingsresultat) => {
  if (vilkar.length === 0) {
    return vilkarUtfallType.IKKE_VURDERT;
  }

  if (
    hasOnlyClosedAps(aksjonspunkter, vedtakAksjonspunkter) &&
    vilkar.some(v => v.perioder.some(periode => periode.vilkarStatus === vilkarUtfallType.IKKE_OPPFYLT))
  ) {
    return vilkarUtfallType.IKKE_OPPFYLT;
  }

  if (
    vilkar.some(v => v.perioder.some(periode => periode.vilkarStatus === vilkarUtfallType.IKKE_VURDERT)) ||
    aksjonspunkter.some(isAksjonspunktOpenAndOfType)
  ) {
    return vilkarUtfallType.IKKE_VURDERT;
  }

  if (!hasOnlyClosedAps(aksjonspunkter, vedtakAksjonspunkter)) {
    return vilkarUtfallType.IKKE_VURDERT;
  }

  if (isAvslag(behandlingsresultat.type)) {
    return vilkarUtfallType.IKKE_OPPFYLT;
  }
  return vilkarUtfallType.OPPFYLT;
};

export default findStatusForVedtak;
