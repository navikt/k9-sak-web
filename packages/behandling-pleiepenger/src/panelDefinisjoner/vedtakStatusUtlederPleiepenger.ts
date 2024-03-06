import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import { isAvslag } from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';

// TODO (TOR) Kan denne skrivast om? For høg kompleksitet.

const hasOnlyClosedAps = (aksjonspunkter, vedtakAksjonspunkter) =>
  aksjonspunkter
    .filter(ap => !vedtakAksjonspunkter.some(vap => vap.definisjon.kode === ap.definisjon.kode))
    .every(ap => !isAksjonspunktOpen(ap.status.kode));

const hasAksjonspunkt = ap => ap.definisjon.kode === aksjonspunktCodes.OVERSTYR_BEREGNING;

const isAksjonspunktOpenAndOfType = ap => hasAksjonspunkt(ap) && isAksjonspunktOpen(ap.status.kode);

const findStatusForVedtak = (vilkar, aksjonspunkter, vedtakAksjonspunkter, behandlingsresultat, featureToggles) => {
  if (vilkar.length === 0) {
    return vilkarUtfallType.IKKE_VURDERT;
  }

  if (
    vilkar.some(v => v.perioder.some(periode => periode.vilkarStatus.kode === vilkarUtfallType.IKKE_VURDERT)) ||
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
