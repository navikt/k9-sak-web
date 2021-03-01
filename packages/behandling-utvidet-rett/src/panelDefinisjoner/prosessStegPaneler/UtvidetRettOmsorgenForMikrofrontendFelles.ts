import { Vilkar } from '@k9-sak-web/types';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import { InformasjonOmVurdertVilkar } from '../../types/utvidetRettMikrofrontend/InformasjonOmVurdertVilkar';

export const generereInfoForVurdertVilkar = (
  skalVilkarsUtfallVises: boolean,
  vilkarArr: Vilkar[],
  vilkarTypeFraAksjonspunkt: string,
  navnPåAksjonspunkt: string,
) => {
  const vurdertVilkar = {
    begrunnelse: '',
    navnPåAksjonspunkt,
    vilkarOppfylt: false,
    vilkar: '',
  } as InformasjonOmVurdertVilkar;

  const vilkarFraAksjonspunkt = vilkarArr.filter(vilkar => vilkar.vilkarType.kode === vilkarTypeFraAksjonspunkt);

  if (skalVilkarsUtfallVises && vilkarFraAksjonspunkt.length > 0) {
    if (vilkarFraAksjonspunkt[0].perioder.length === 1) {
      const periode = vilkarFraAksjonspunkt[0].perioder[0];
      vurdertVilkar.begrunnelse = periode.begrunnelse;
      vurdertVilkar.navnPåAksjonspunkt = navnPåAksjonspunkt;
      vurdertVilkar.vilkarOppfylt = periode.vilkarStatus.kode === vilkarUtfallType.OPPFYLT;
      vurdertVilkar.vilkar = vilkarFraAksjonspunkt[0].lovReferanse;
    }
  }
  return vurdertVilkar;
};

export const erVilkarVurdert = (vilkarArr: Vilkar[], vilkarTypeFraAksjonspunkt: string) => {
  const vilkarFraAksjonspunkt = vilkarArr.filter(vilkar => vilkar.vilkarType.kode === vilkarTypeFraAksjonspunkt);
  let vilkarVurdert = false;

  if (vilkarFraAksjonspunkt.length === 1 && vilkarFraAksjonspunkt[0].perioder.length > 0) {
    const periode = vilkarFraAksjonspunkt[0].perioder[0];
    const vilkarUtfall = periode.vilkarStatus.kode;
    vilkarVurdert = vilkarUtfall !== vilkarUtfallType.IKKE_VURDERT;
  }

  return vilkarVurdert;
};

export default { erVilkarVurdert, generereInfoForVurdertVilkar };
