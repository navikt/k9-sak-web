import { Aksjonspunkt, Vilkar } from '@k9-sak-web/types';
import { FormState } from '@fpsak-frontend/form/index';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import UtvidetRettMikrofrontendVisning from '../../../../../types/MikrofrontendKomponenter';
import { generereInfoForVurdertVilkar } from '../../../UtvidetRettOmsorgenForMikrofrontendFelles';
import UtvidetRettSoknad from '../../../../../types/UtvidetRettSoknad';
import {
  AleneOmOmsorgenAksjonspunktObjekt,
  AleneOmOmsorgenProps,
} from '../../../../../types/utvidetRettMikrofrontend/VilkarAleneOmOmsorgenProps';
import AvslagskoderMidlertidigAlene from '../../../../../types/utvidetRettMikrofrontend/AvslagskoderMidlertidigAlene';

interface OwnProps {
  behandlingsID: string;
  aksjonspunktLost: boolean;
  lesemodus: boolean;
  vilkarKnyttetTilAksjonspunkt: Vilkar;
  status: string;
  aksjonspunkt: Aksjonspunkt;
  skalVilkarsUtfallVises: boolean;
  submitCallback;
  soknad: UtvidetRettSoknad;
}

const formatereLesemodusObjekt = (vilkar: Vilkar, aksjonspunkt: Aksjonspunkt, status: string) => {
  if (vilkar.perioder[0].vilkarStatus.kode !== vilkarUtfallType.IKKE_VURDERT) {
    return {
      begrunnelse: aksjonspunkt.begrunnelse,
      vilkarOppfylt: status === vilkarUtfallType.OPPFYLT,
      fraDato: vilkar.perioder[0].periode.fom,
      tilDato: vilkar.perioder[0].periode.tom,
      avslagsArsakErPeriodeErIkkeOverSeksMån:
        vilkar.perioder[0]?.avslagKode === AvslagskoderMidlertidigAlene.VARIGHET_UNDER_SEKS_MÅN,
    } as AleneOmOmsorgenAksjonspunktObjekt;
  }
  return {
    begrunnelse: '',
    vilkarOppfylt: false,
    avslagsArsakErPeriodeErIkkeOverSeksMån: false,
    fraDato: '',
    tilDato: '',
  } as AleneOmOmsorgenAksjonspunktObjekt;
};

const formatereLosAksjonspunktObjekt = (
  aksjonspunktKode: string,
  begrunnelse: string,
  erVilkarOk: boolean,
  fraDato: string,
  tilDato: string,
) => ({
  kode: aksjonspunktKode,
  begrunnelse,
  erVilkarOk,
  periode: {
    fom: fraDato,
    tom: tilDato,
  },
});

/* Avventer funksjonelle avklaringer.
  if (!erVilkarOk) {
    losAksjonspunktObjekt['avslagsårsak'] = avslagsArsakErPeriodeErIkkeOverSeksMån
      ? AvslagskoderMidlertidigAlene.VARIGHET_UNDER_SEKS_MÅN
      : AvslagskoderMidlertidigAlene.REGNES_IKKE_SOM_Å_HA_ALENEOMSORG;
  }
  return losAksjonspunktObjekt; */

const AleneOmOmsorgenObjektTilMikrofrontend = ({
  behandlingsID,
  aksjonspunktLost,
  lesemodus,
  vilkarKnyttetTilAksjonspunkt,
  status,
  aksjonspunkt,
  skalVilkarsUtfallVises,
  submitCallback,
  soknad,
}: OwnProps) => {
  const angittBarn = soknad.angittePersoner.filter(person => person.rolle === 'BARN');
  const barnetsFodselsdato = new Date(angittBarn[0].fødselsdato);
  const årBarnetFyller13 = `${barnetsFodselsdato.getFullYear() + 13}-12-31`;
  return {
    visKomponent: UtvidetRettMikrofrontendVisning.VILKAR_ALENE_OM_OMSORGEN,
    props: {
      behandlingsID,
      lesemodus,
      aksjonspunktLost,
      fraDatoFraSoknad: soknad?.søknadsperiode.fom,
      tomDato: årBarnetFyller13,
      vedtakFattetVilkarOppfylt: skalVilkarsUtfallVises,
      informasjonOmVilkar: generereInfoForVurdertVilkar(
        skalVilkarsUtfallVises,
        vilkarKnyttetTilAksjonspunkt,
        aksjonspunkt.begrunnelse,
        'Utvidet Rett',
      ),
      informasjonTilLesemodus: formatereLesemodusObjekt(vilkarKnyttetTilAksjonspunkt, aksjonspunkt, status),
      losAksjonspunkt: ({ begrunnelse, vilkarOppfylt, fraDato, tilDato }) => {
        submitCallback([
          formatereLosAksjonspunktObjekt(aksjonspunkt.definisjon.kode, begrunnelse, vilkarOppfylt, fraDato, tilDato),
        ]);
      },
      formState: FormState,
    } as AleneOmOmsorgenProps,
  };
};
export default AleneOmOmsorgenObjektTilMikrofrontend;
