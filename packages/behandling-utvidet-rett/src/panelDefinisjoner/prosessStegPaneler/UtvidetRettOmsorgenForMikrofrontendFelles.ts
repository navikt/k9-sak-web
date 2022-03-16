import { Vilkar } from '@k9-sak-web/types';
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
    vurdertVilkar.vilkarOppfylt = periode.vilkarStatus === vilkarUtfallType.OPPFYLT;
    vurdertVilkar.vilkar = vilkar.lovReferanse;
  }
  return vurdertVilkar;
};

export default { generereInfoForVurdertVilkar };
