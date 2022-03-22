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
import UtvidetRettSoknad from '../../../../../types/UtvidetRettSoknad';

interface OwnProps {
  behandlingsID: string;
  aksjonspunktLost: boolean;
  lesemodus: boolean;
  vilkar: Vilkar;
  aksjonspunkt: Aksjonspunkt;
  skalVilkarsUtfallVises: boolean;
  submitCallback;
  soknad: UtvidetRettSoknad;
}

const formatereLosAksjonspunktObjektForKroniskSyk = (
  aksjonspunktKode: string,
  begrunnelse: string,
  erVilkarOk: boolean,
  avslagsArsakErIkkeRiskioFraFravaer: boolean,
  fraDato: string,
  vilkar: Vilkar,
) => {
  const losAksjonspunktObjekt = {
    kode: aksjonspunktKode,
    begrunnelse,
    erVilkarOk,
    periode: {
      fom: fraDato,
      tom:
        typeof vilkar.perioder[0]?.periode.tom !== 'undefined' && vilkar.perioder[0]?.periode.tom !== null
          ? vilkar.perioder[0]?.periode.tom
          : '',
    },
  };

  if (!erVilkarOk) {
    losAksjonspunktObjekt['avslagsårsak'] = avslagsArsakErIkkeRiskioFraFravaer
      ? AvslagskoderKroniskSyk.IKKE_OKT_RISIKO_FRA_FRAVAER
      : AvslagskoderKroniskSyk.IKKE_KRONISK_SYK_ELLER_FUNKSJONSHEMMET;
  }

  return losAksjonspunktObjekt;
};

const formatereLesemodusObjektForKroniskSyk = (vilkar: Vilkar, aksjonspunkt: Aksjonspunkt) => {
  if (vilkar.perioder[0].vilkarStatus.kode !== vilkarUtfallType.IKKE_VURDERT) {
    return {
      begrunnelse: aksjonspunkt.begrunnelse,
      vilkarOppfylt: vilkar.perioder[0].vilkarStatus.kode === vilkarUtfallType.OPPFYLT,
      avslagsArsakErIkkeRiskioFraFravaer:
        vilkar.perioder[0]?.avslagKode === AvslagskoderKroniskSyk.IKKE_OKT_RISIKO_FRA_FRAVAER,
      fraDato: vilkar.perioder[0].periode.fom,
    } as InformasjonTilLesemodusKroniskSyk;
  }
  return {
    begrunnelse: '',
    vilkarOppfylt: false,
    avslagsArsakErIkkeRiskioFraFravaer: false,
    fraDato: '',
  } as InformasjonTilLesemodusKroniskSyk;
};

const KroniskSykObjektTilMikrofrontend = ({
  behandlingsID,
  aksjonspunktLost,
  lesemodus,
  vilkar,
  aksjonspunkt,
  skalVilkarsUtfallVises,
  submitCallback,
  soknad,
}: OwnProps) => ({
  visKomponent: UtvidetRettMikrofrontendVisning.VILKAR_KRONISK_SYKT_BARN,
  props: {
    behandlingsID,
    aksjonspunktLost,
    lesemodus,
    soknadsdato: soknad.soknadsdato,
    informasjonTilLesemodus: formatereLesemodusObjektForKroniskSyk(vilkar, aksjonspunkt),
    vedtakFattetVilkarOppfylt: skalVilkarsUtfallVises,
    informasjonOmVilkar: generereInfoForVurdertVilkar(
      skalVilkarsUtfallVises,
      vilkar,
      aksjonspunkt.begrunnelse,
      'Utvidet Rett',
    ),
    losAksjonspunkt: (harDokumentasjonOgFravaerRisiko, begrunnelse, avslagsArsakErIkkeRiskioFraFravaer, fraDato) => {
      submitCallback([
        formatereLosAksjonspunktObjektForKroniskSyk(
          aksjonspunkt.definisjon.kode,
          begrunnelse,
          harDokumentasjonOgFravaerRisiko,
          avslagsArsakErIkkeRiskioFraFravaer,
          fraDato || soknad.soknadsdato,
          vilkar,
        ),
      ]);
    },
    formState: FormState,
  } as VilkarKroniskSyktBarnProps,
});

export default KroniskSykObjektTilMikrofrontend;
