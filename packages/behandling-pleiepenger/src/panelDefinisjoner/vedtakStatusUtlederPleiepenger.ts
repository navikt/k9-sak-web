import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import { isAvslag } from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import { Aksjonspunkt, Behandling, FeatureToggles, Vilkar } from '@k9-sak-web/types';

// TODO (TOR) Kan denne skrivast om? For høg kompleksitet.

const hasOnlyClosedAps = (aksjonspunkter: Aksjonspunkt[], vedtakAksjonspunkter: Aksjonspunkt[]) =>
  aksjonspunkter
    .filter(ap => !vedtakAksjonspunkter.some(vap => vap.definisjon === ap.definisjon))
    .every(ap => !isAksjonspunktOpen(ap.status));

const hasAksjonspunkt = (ap: Aksjonspunkt) => ap.definisjon === aksjonspunktCodes.OVERSTYR_BEREGNING;

const isAksjonspunktOpenAndOfType = (ap: Aksjonspunkt) => hasAksjonspunkt(ap) && isAksjonspunktOpen(ap.status);

const findStatusForVedtak = (
  vilkar: Vilkar[],
  aksjonspunkter: Aksjonspunkt[],
  vedtakAksjonspunkter: Aksjonspunkt[],
  behandlingsresultat: Behandling['behandlingsresultat'],
) => {
  if (vilkar.length === 0) {
    return vilkarUtfallType.IKKE_VURDERT;
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
