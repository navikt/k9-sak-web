import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import { isAvslag } from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';

const hasOnlyClosedAps = (aksjonspunkter, vedtakAksjonspunkter) =>
  aksjonspunkter
    .filter(ap => !vedtakAksjonspunkter.some(vap => vap.definisjon.kode === ap.definisjon.kode))
    .every(ap => !isAksjonspunktOpen(ap.status.kode));

const hasOpenOverstyrBeregningAksjonspunkt = ap =>
  ap.definisjon.kode === aksjonspunktCodes.OVERSTYR_BEREGNING && isAksjonspunktOpen(ap.status.kode);

const harVilkårMedStatus = (vilkar, status) =>
  vilkar.some(v => v.perioder.some(periode => periode.vilkarStatus.kode === status));

const utledVedtakStatus = (
  vilkar,
  aksjonspunkter,
  vedtakAksjonspunkter,
  behandlingsresultat,
  skalSjekkeIkkeOppfyltVilkår = true,
) => {
  if (vilkar.length === 0) {
    return vilkarUtfallType.IKKE_VURDERT;
  }

  if (
    skalSjekkeIkkeOppfyltVilkår &&
    hasOnlyClosedAps(aksjonspunkter, vedtakAksjonspunkter) &&
    harVilkårMedStatus(vilkar, vilkarUtfallType.IKKE_OPPFYLT)
  ) {
    return vilkarUtfallType.IKKE_OPPFYLT;
  }

  if (
    harVilkårMedStatus(vilkar, vilkarUtfallType.IKKE_VURDERT) ||
    aksjonspunkter.some(hasOpenOverstyrBeregningAksjonspunkt)
  ) {
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

export default utledVedtakStatus;
