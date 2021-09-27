import {Aksjonspunkt, Behandling, Vilkar} from '@k9-sak-web/types';
import {FormState} from '@fpsak-frontend/form/index';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import BehandlingType from "@fpsak-frontend/kodeverk/src/behandlingType";
import UtvidetRettMikrofrontendVisning from '../../../../../types/MikrofrontendKomponenter';
import {generereInfoForVurdertVilkar} from '../../../UtvidetRettOmsorgenForMikrofrontendFelles';
import UtvidetRettSoknad from '../../../../../types/UtvidetRettSoknad';
import {
  AleneOmOmsorgenAksjonspunktObjekt,
  AleneOmOmsorgenLosAksjonspunktK9Format,
  AleneOmOmsorgenProps,
} from '../../../../../types/utvidetRettMikrofrontend/VilkarAleneOmOmsorgenProps';
import AvslagskoderAleneOmOmsorgen from "../../../../../types/utvidetRettMikrofrontend/AvslagskoderAleneOmOmsorgen";

interface OwnProps {
  behandling: Behandling;
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
    } as AleneOmOmsorgenAksjonspunktObjekt;
  }
  return {
    begrunnelse: '',
    vilkarOppfylt: false,
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
  erBehandlingRevurdering: boolean
) => {

  const losAksjonspunktObjekt: AleneOmOmsorgenLosAksjonspunktK9Format = {
    kode: aksjonspunktKode,
    begrunnelse,
    erVilkarOk,
    periode: {
      fom: fraDato,
    }
  };

  if (!erVilkarOk) {
    losAksjonspunktObjekt.avslagsårsak = AvslagskoderAleneOmOmsorgen.IKKE_GRUNNLAG_ALENE_OMSORG;
  }

  if(erBehandlingRevurdering){
    losAksjonspunktObjekt.periode.tom = tilDato;
  }

  return losAksjonspunktObjekt;
}

const AleneOmOmsorgenObjektTilMikrofrontend = ({
  behandling,
  aksjonspunktLost,
  lesemodus,
  vilkarKnyttetTilAksjonspunkt,
  status,
  aksjonspunkt,
  skalVilkarsUtfallVises,
  submitCallback,
  soknad,
}: OwnProps) => {
  const erBehandlingRevurdering: boolean = behandling.type.kode === BehandlingType.REVURDERING;

  return {
    visKomponent: UtvidetRettMikrofrontendVisning.VILKAR_ALENE_OM_OMSORGEN,
    props: {
      behandlingsID: behandling.id.toString(),
      lesemodus,
      aksjonspunktLost,
      fraDatoFraSoknad: soknad?.søknadsperiode.fom,
      vedtakFattetVilkarOppfylt: skalVilkarsUtfallVises,
      erBehandlingstypeRevurdering: erBehandlingRevurdering,
      informasjonOmVilkar: generereInfoForVurdertVilkar(
        skalVilkarsUtfallVises,
        vilkarKnyttetTilAksjonspunkt,
        aksjonspunkt.begrunnelse,
        'Utvidet Rett',
      ),
      informasjonTilLesemodus: formatereLesemodusObjekt(vilkarKnyttetTilAksjonspunkt, aksjonspunkt, status),
      losAksjonspunkt: ({ begrunnelse, vilkarOppfylt, fraDato, tilDato }) => {
        submitCallback([
          formatereLosAksjonspunktObjekt(aksjonspunkt.definisjon.kode, begrunnelse, vilkarOppfylt, fraDato, tilDato, erBehandlingRevurdering),
        ]);
      },
      formState: FormState,
    } as AleneOmOmsorgenProps,
  };
};
export default AleneOmOmsorgenObjektTilMikrofrontend;
