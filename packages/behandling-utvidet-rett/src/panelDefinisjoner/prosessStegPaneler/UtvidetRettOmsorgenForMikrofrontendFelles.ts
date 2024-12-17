import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import { formatereLukketPeriode } from '@k9-sak-web/lib/dateUtils/dateUtils.js';
import { Vilkar } from '@k9-sak-web/types';
import { InformasjonOmVurdertVilkar } from '../../types/utvidetRettMikrofrontend/InformasjonOmVurdertVilkar';

export const generereInfoForVurdertVilkar = (
  skalVilkarsUtfallVises: boolean,
  vilkar: Vilkar,
  begrunnelseFraAksjonspunkt: string,
  begrunnelseFraVilkar: string,
  navnPåAksjonspunkt: string,
) => {
  const vurdertVilkar = {
    begrunnelse: '',
    navnPåAksjonspunkt,
    vilkarOppfylt: false,
    vilkar: 'Vilkar ikke funnet.',
    periode: '',
  } as InformasjonOmVurdertVilkar;

  if (skalVilkarsUtfallVises && vilkar.perioder[0]) {
    const periode = vilkar.perioder[0];
    vurdertVilkar.begrunnelse = begrunnelseFraAksjonspunkt ? begrunnelseFraAksjonspunkt : begrunnelseFraVilkar;
    vurdertVilkar.navnPåAksjonspunkt = navnPåAksjonspunkt;
    vurdertVilkar.vilkarOppfylt = periode.vilkarStatus.kode === vilkarUtfallType.OPPFYLT;
    vurdertVilkar.vilkar = vilkar.lovReferanse;
    vurdertVilkar.periode = formatereLukketPeriode(`${periode.periode.fom}/${periode.periode.tom}`);
  }
  return vurdertVilkar;
};

export default { generereInfoForVurdertVilkar };
