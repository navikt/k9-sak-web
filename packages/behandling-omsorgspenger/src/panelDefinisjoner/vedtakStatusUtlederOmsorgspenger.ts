import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import { isAvslag } from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';

const hasOnlyClosedAps = (aksjonspunkter, vedtakAksjonspunkter) =>
  aksjonspunkter
    .filter(ap => !vedtakAksjonspunkter.some(vap => vap.definisjon.kode === ap.definisjon.kode))
    .every(ap => !isAksjonspunktOpen(ap.status.kode));

const hasAksjonspunkt = ap => ap.definisjon.kode === aksjonspunktCodes.OVERSTYR_BEREGNING;

const isAksjonspunktOpenAndOfType = ap => hasAksjonspunkt(ap) && isAksjonspunktOpen(ap.status.kode);

const harVilkårSomIkkeErOppfylt = vilkar =>
  vilkar.some(v => v.perioder.some(periode => periode.vilkarStatus.kode === vilkarUtfallType.IKKE_OPPFYLT));

const harVilkårSomIkkeErVurdert = vilkar =>
  vilkar.some(v => v.perioder.some(periode => periode.vilkarStatus.kode === vilkarUtfallType.IKKE_VURDERT));

const findStatusForVedtak = (vilkar, aksjonspunkter, vedtakAksjonspunkter, behandlingsresultat) => {
  if (vilkar.length === 0) {
    return vilkarUtfallType.IKKE_VURDERT;
  }

  if (hasOnlyClosedAps(aksjonspunkter, vedtakAksjonspunkter) && harVilkårSomIkkeErOppfylt(vilkar)) {
    return vilkarUtfallType.IKKE_OPPFYLT;
  }

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
