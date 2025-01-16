import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import { formatereLukketPeriode } from '@k9-sak-web/lib/dateUtils/dateUtils.js';
import { Vilkar } from '@k9-sak-web/types';
import { InformasjonOmVurdertVilkar } from '../../types/utvidetRettMikrofrontend/InformasjonOmVurdertVilkar';

type GenerereInfoForVurdertVilkarProps = {
  skalVilkarsUtfallVises: boolean;
  vilkår: Vilkar;
  begrunnelseFraAksjonspunkt: string;
  begrunnelseFraVilkår: string;
  navnPåAksjonspunkt: string;
};

export const generereInfoForVurdertVilkar = ({
  skalVilkarsUtfallVises,
  vilkår,
  begrunnelseFraAksjonspunkt,
  begrunnelseFraVilkår,
  navnPåAksjonspunkt,
}: GenerereInfoForVurdertVilkarProps) => {
  const vurdertVilkar = {
    begrunnelse: '',
    navnPåAksjonspunkt,
    vilkarOppfylt: false,
    vilkar: 'Vilkar ikke funnet.',
    periode: '',
  } as InformasjonOmVurdertVilkar;

  if (skalVilkarsUtfallVises && vilkår.perioder[0]) {
    const periode = vilkår.perioder[0];
    vurdertVilkar.begrunnelse = begrunnelseFraAksjonspunkt ? begrunnelseFraAksjonspunkt : begrunnelseFraVilkår;
    vurdertVilkar.navnPåAksjonspunkt = navnPåAksjonspunkt;
    vurdertVilkar.vilkarOppfylt = periode.vilkarStatus.kode === vilkarUtfallType.OPPFYLT;
    vurdertVilkar.vilkar = vilkår.lovReferanse;
    vurdertVilkar.periode = formatereLukketPeriode(`${periode.periode.fom}/${periode.periode.tom}`);
  }
  return vurdertVilkar;
};

export default { generereInfoForVurdertVilkar };
