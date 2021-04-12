import { Aksjonspunkt, Vilkar } from '@k9-sak-web/types';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import AvslagskoderKroniskSyk from '../../../../types/utvidetRettMikrofrontend/AvslagskoderKroniskSyk';
import { InformasjonTilLesemodusKroniskSyk } from '../../../../types/utvidetRettMikrofrontend/VilkarKroniskSyktBarnProps';
import AvslagskoderMidlertidigAlene from '../../../../types/utvidetRettMikrofrontend/AvslagskoderMidlertidigAlene';

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

export const formatereLesemodusObjektForMidlertidigAlene = (
  vilkar: Vilkar,
  aksjonspunkt: Aksjonspunkt,
  status: string,
) => {
  if (vilkar.perioder[0]) {
    return {
      begrunnelse: aksjonspunkt.begrunnelse,
      vilkarOppfylt: status === vilkarUtfallType.OPPFYLT,
      dato: {
        fra: vilkar.perioder[0].periode.fom,
        til: vilkar.perioder[0].periode.tom,
      },
      avslagsArsakErPeriodeErIkkeOverSeksMån:
        vilkar.perioder[0]?.avslagKode === AvslagskoderMidlertidigAlene.VARIGHET_UNDER_SEKS_MÅN,
    };
  }
  return {
    begrunnelse: '',
    vilkarOppfylt: false,
    avslagsArsakErIkkeRiskioFraFravaer: false,
    dato: {
      fra: '',
      til: '',
    },
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

export const formatereLosAksjonspunktObjektForMidlertidigAlene = (
  aksjonspunktKode: string,
  begrunnelse: string,
  erVilkarOk: boolean,
  periode: {
    fom: string;
    tom: string;
  },
  avslagsArsakErPeriodeErIkkeOverSeksMån: boolean,
) => {
  const losAksjonspunktObjekt = {
    kode: aksjonspunktKode,
    begrunnelse,
    erVilkarOk,
    periode,
  };

  if (!erVilkarOk) {
    losAksjonspunktObjekt['avslagsårsak'] = avslagsArsakErPeriodeErIkkeOverSeksMån
      ? AvslagskoderMidlertidigAlene.VARIGHET_UNDER_SEKS_MÅN
      : AvslagskoderMidlertidigAlene.REGNES_IKKE_SOM_Å_HA_ALENEOMSORG;
  }

  return losAksjonspunktObjekt;
};
