import { Aksjonspunkt, Vilkar } from '@k9-sak-web/types';
import { FormState } from '@fpsak-frontend/form/index';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import { KomponenterEnum } from '@navikt/k9-fe-omsorgsdager';
import { generereInfoForVurdertVilkar } from '../../../UtvidetRettOmsorgenForMikrofrontendFelles';
import {
  InformasjonTilLesemodusKroniskSyk,
  VilkarKroniskSyktBarnProps,
} from '../../../../../types/utvidetRettMikrofrontend/VilkarKroniskSyktBarnProps';
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
  fraDato: string,
  vilkar: Vilkar,
  avslagsårsakKode: string,
  soknad: UtvidetRettSoknad,
) => {
  const angittBarn = soknad.angittePersoner.find(person => person.rolle === 'BARN');
  const barnetsFodselsdato = new Date(angittBarn.fødselsdato);
  const åretBarnetFyller18 = `${barnetsFodselsdato.getFullYear() + 18}-12-31`;

  const losAksjonspunktObjekt = {
    kode: aksjonspunktKode,
    begrunnelse,
    erVilkarOk,
    avslagsårsak: erVilkarOk ? null : avslagsårsakKode,
    periode: {
      fom: fraDato,
      tom:
        typeof vilkar.perioder[0]?.periode.tom && vilkar.perioder[0]?.periode.tom !== '9999-12-31'
          ? vilkar.perioder[0]?.periode.tom
          : åretBarnetFyller18,
    },
  };

  return losAksjonspunktObjekt;
};

const formatereLesemodusObjektForKroniskSyk = (vilkar: Vilkar, aksjonspunkt: Aksjonspunkt) => {
  if (vilkar.perioder[0].vilkarStatus.kode !== vilkarUtfallType.IKKE_VURDERT) {
    return {
      begrunnelse: aksjonspunkt.begrunnelse,
      vilkarOppfylt: vilkar.perioder[0].vilkarStatus.kode === vilkarUtfallType.OPPFYLT,
      avslagsårsakKode: vilkar.perioder[0].avslagKode,
      fraDato: vilkar.perioder[0].periode.fom,
    } as InformasjonTilLesemodusKroniskSyk;
  }
  return {
    begrunnelse: '',
    vilkarOppfylt: false,
    avslagsårsakKode: '',
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
}: OwnProps): {
  visKomponent: KomponenterEnum.VILKAR_KRONISK_SYKT_BARN;
  props: VilkarKroniskSyktBarnProps;
} => ({
  visKomponent: KomponenterEnum.VILKAR_KRONISK_SYKT_BARN,
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
    losAksjonspunkt: (harDokumentasjonOgFravaerRisiko, begrunnelse, avslagsårsakKode, fraDato) => {
      submitCallback([
        formatereLosAksjonspunktObjektForKroniskSyk(
          aksjonspunkt.definisjon.kode,
          begrunnelse,
          harDokumentasjonOgFravaerRisiko,
          fraDato || soknad.soknadsdato,
          vilkar,
          avslagsårsakKode,
          soknad,
        ),
      ]);
    },
    formState: FormState,
  } as VilkarKroniskSyktBarnProps,
});

export default KroniskSykObjektTilMikrofrontend;
