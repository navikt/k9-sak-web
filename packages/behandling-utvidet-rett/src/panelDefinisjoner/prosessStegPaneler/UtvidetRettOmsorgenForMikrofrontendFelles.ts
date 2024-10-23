import { Vilkar } from '@k9-sak-web/types';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import { formatereLukketPeriode } from '@fpsak-frontend/utils';
import { InformasjonOmVurdertVilkar } from '@k9-sak-web/prosess-omsorgsdager/src/types/InformasjonOmVurdertVilkar';

export const generereInfoForVurdertVilkar = (
  skalVilkarsUtfallVises: boolean,
  vilkar: Vilkar,
  begrunnelseFraAksjonspunkt: string,
  navnPåAksjonspunkt: string,
): InformasjonOmVurdertVilkar => {
  if (skalVilkarsUtfallVises && vilkar.perioder[0]) {
    const periode = vilkar.perioder[0];
    return {
      begrunnelse: begrunnelseFraAksjonspunkt,
      navnPåAksjonspunkt,
      vilkarOppfylt: periode.vilkarStatus.kode === vilkarUtfallType.OPPFYLT,
      lovReferanse: vilkar.lovReferanse,
      vilkarperiode: periode,
      periode: formatereLukketPeriode(`${periode.periode.fom}/${periode.periode.tom}`),
    };
  }
  return {
    begrunnelse: '',
    navnPåAksjonspunkt,
    vilkarOppfylt: false,
    lovReferanse: 'Vilkar ikke funnet.',
    periode: '',
  };
};

export default { generereInfoForVurdertVilkar };
