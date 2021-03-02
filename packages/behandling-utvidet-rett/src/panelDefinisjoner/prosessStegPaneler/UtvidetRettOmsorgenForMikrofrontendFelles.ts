import { Aksjonspunkt, Vilkar } from '@k9-sak-web/types';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import { InformasjonOmVurdertVilkar } from '../../types/utvidetRettMikrofrontend/InformasjonOmVurdertVilkar';

export const generereInfoForVurdertVilkar = (
  skalVilkarsUtfallVises: boolean,
  vilkar: Vilkar,
  begrunnelseFraAksjonspunkt: string,
  navnPåAksjonspunkt: string,
) => {
  const vurdertVilkar = {
    begrunnelse: '',
    navnPåAksjonspunkt,
    vilkarOppfylt: false,
    vilkar: 'Vilkar ikke funnet.',
  } as InformasjonOmVurdertVilkar;

  if (skalVilkarsUtfallVises && vilkar.perioder[0]) {
    const periode = vilkar.perioder[0];
    vurdertVilkar.begrunnelse = begrunnelseFraAksjonspunkt;
    vurdertVilkar.navnPåAksjonspunkt = navnPåAksjonspunkt;
    vurdertVilkar.vilkarOppfylt = periode.vilkarStatus.kode === vilkarUtfallType.OPPFYLT;
    vurdertVilkar.vilkar = vilkar.lovReferanse;
  }
  return vurdertVilkar;
};

export const erVilkarVurdert = (vilkarArr: Vilkar) => {
  let vilkarVurdert = false;

  if (vilkarArr.perioder.length > 0) {
    const periode = vilkarArr.perioder[0];
    const vilkarUtfall = periode.vilkarStatus.kode;
    vilkarVurdert = vilkarUtfall !== vilkarUtfallType.IKKE_VURDERT;
  }

  return vilkarVurdert;
};

export const hentBegrunnelseOgVilkarOppfylt = (vilkar: Vilkar, aksjonspunkt: Aksjonspunkt) => {
  if (vilkar.perioder[0]) {
    return {
      begrunnelse: aksjonspunkt.begrunnelse,
      vilkarOppfylt: vilkar.perioder[0].vilkarStatus.kode === vilkarUtfallType.OPPFYLT,
    };
  }
  return {
    begrunnelse: 'Noe gikk galt.',
    vilkarOppfylt: false,
  };
};

export default { erVilkarVurdert, hentBegrunnelseOgVilkarOppfylt, generereInfoForVurdertVilkar };
