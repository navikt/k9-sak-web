import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import { Aksjonspunkt, Vilkar } from '@k9-sak-web/types';

const hasOnlyClosedAps = (aksjonspunkter: Aksjonspunkt[], vedtakAksjonspunkter: Aksjonspunkt[]) =>
  aksjonspunkter
    .filter(ap => !vedtakAksjonspunkter.some(vap => vap.definisjon.kode === ap.definisjon.kode))
    .every(ap => !isAksjonspunktOpen(ap.status.kode));

const findStatusForVedtak = (
  vilkar: Vilkar[],
  aksjonspunkter: Aksjonspunkt[],
  vedtakAksjonspunkter: Aksjonspunkt[],
  // behandlingsresultat: Behandlingsresultat,
) => {
  if (vilkar.length === 0) {
    return vilkarUtfallType.IKKE_VURDERT;
  }

  if (vilkar.some(v => v.perioder.some(periode => periode.vilkarStatus.kode === vilkarUtfallType.IKKE_VURDERT))) {
    return vilkarUtfallType.IKKE_VURDERT;
  }

  if (!hasOnlyClosedAps(aksjonspunkter, vedtakAksjonspunkter)) {
    return vilkarUtfallType.IKKE_VURDERT;
  }

  // if (isAvslag(behandlingsresultat.type.kode)) {
  //   return vilkarUtfallType.IKKE_OPPFYLT;
  // }
  return vilkarUtfallType.OPPFYLT;
};

export default findStatusForVedtak;
