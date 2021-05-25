import { Aksjonspunkt, Vilkar } from '@k9-sak-web/types';
import { FormState } from '@fpsak-frontend/form/index';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import UtvidetRettMikrofrontendVisning from '../../../../../types/MikrofrontendKomponenter';
import { generereInfoForVurdertVilkar } from '../../../UtvidetRettOmsorgenForMikrofrontendFelles';
import {
  InformasjonTilLesemodusKroniskSyk,
  VilkarKroniskSyktBarnProps,
} from '../../../../../types/utvidetRettMikrofrontend/VilkarKroniskSyktBarnProps';
import AvslagskoderKroniskSyk from '../../../../../types/utvidetRettMikrofrontend/AvslagskoderKroniskSyk';

interface OwnProps {
  behandlingsID: string;
  aksjonspunktLost: boolean;
  lesemodus: boolean;
  vilkarKnyttetTilAksjonspunkt: Vilkar;
  aksjonspunkt: Aksjonspunkt;
  skalVilkarsUtfallVises: boolean;
  submitCallback;
}

const formatereLosAksjonspunktObjektForKroniskSyk = (
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

const formatereLesemodusObjektForKroniskSyk = (vilkar: Vilkar, aksjonspunkt: Aksjonspunkt) => {
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

const KroniskSykObjektTilMikrofrontend = ({
  behandlingsID,
  aksjonspunktLost,
  lesemodus,
  vilkarKnyttetTilAksjonspunkt,
  aksjonspunkt,
  skalVilkarsUtfallVises,
  submitCallback,
}: OwnProps) => ({
  visKomponent: UtvidetRettMikrofrontendVisning.VILKAR_KRONISK_SYKT_BARN,
  props: {
    behandlingsID,
    aksjonspunktLost,
    lesemodus,
    informasjonTilLesemodus: formatereLesemodusObjektForKroniskSyk(vilkarKnyttetTilAksjonspunkt, aksjonspunkt),
    vedtakFattetVilkarOppfylt: skalVilkarsUtfallVises,
    informasjonOmVilkar: generereInfoForVurdertVilkar(
      skalVilkarsUtfallVises,
      vilkarKnyttetTilAksjonspunkt,
      aksjonspunkt.begrunnelse,
      'Utvidet Rett',
    ),
    losAksjonspunkt: (harDokumentasjonOgFravaerRisiko, begrunnelse, avslagsArsakErIkkeRiskioFraFravaer) => {
      submitCallback([
        formatereLosAksjonspunktObjektForKroniskSyk(
          aksjonspunkt.definisjon.kode,
          begrunnelse,
          harDokumentasjonOgFravaerRisiko,
          avslagsArsakErIkkeRiskioFraFravaer,
        ),
      ]);
    },
    formState: FormState,
  } as VilkarKroniskSyktBarnProps,
});

export default KroniskSykObjektTilMikrofrontend;
