import { Aksjonspunkt, Vilkar } from '@k9-sak-web/types';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import AvslagskoderKroniskSyk from '../../../../types/utvidetRettMikrofrontend/AvslagskoderKroniskSyk';
import { InformasjonTilLesemodusKroniskSyk } from '../../../../types/utvidetRettMikrofrontend/VilkarKroniskSyktBarnProps';

export const formatereLesemodusObjektForKroniskSyk = (vilkar: Vilkar, aksjonspunkt: Aksjonspunkt) => {
  if (vilkar.perioder[0]) {
    return {
      begrunnelse: aksjonspunkt.begrunnelse,
      vilkarOppfylt: vilkar.perioder[0].vilkarStatus.kode === vilkarUtfallType.OPPFYLT,
      avslagsArsakErIkkeRiskioFraFravaer:
        vilkar.perioder[0]?.avslagKode === AvslagskoderKroniskSyk.IKKE_OKT_RISIKO_FRA_FRAVAER,
    } as InformasjonTilLesemodusKroniskSyk;
  }
  return {
    begrunnelse: '',
    vilkarOppfylt: false,
    avslagsArsakErIkkeRiskioFraFravaer: false,
  };
};

export const formatereLosAksjonspunktObjektForKroniskSyk = (
  aksjonspunktKode: string,
  begrunnelse: string,
  erVilkarOk: boolean,
  avslagsArsakErIkkeRiskioFraFravaer: boolean,
) => {
  const losAksjonspunktObjekt = {
    kode: aksjonspunktKode,
    begrunnelse,
    erVilkarOk,
  };

  if (!erVilkarOk) {
    losAksjonspunktObjekt['avslagsårsak'] = avslagsArsakErIkkeRiskioFraFravaer
      ? AvslagskoderKroniskSyk.IKKE_OKT_RISIKO_FRA_FRAVAER
      : AvslagskoderKroniskSyk.IKKE_KRONISK_SYK_ELLER_FUNKSJONSHEMMET;
  }

  return losAksjonspunktObjekt;
};
