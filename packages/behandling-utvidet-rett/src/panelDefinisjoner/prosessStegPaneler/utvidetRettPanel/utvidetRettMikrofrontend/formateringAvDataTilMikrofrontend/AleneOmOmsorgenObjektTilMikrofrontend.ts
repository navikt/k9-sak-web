import { Aksjonspunkt, Behandling, Vilkar } from '@k9-sak-web/types';
import { FormState } from '@fpsak-frontend/form/index';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import BehandlingType from "@fpsak-frontend/kodeverk/src/behandlingType";
import UtvidetRettMikrofrontendVisning from '../../../../../types/MikrofrontendKomponenter';
import { generereInfoForVurdertVilkar } from '../../../UtvidetRettOmsorgenForMikrofrontendFelles';
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
  if (vilkar.perioder[0].vilkarStatus !== vilkarUtfallType.IKKE_VURDERT) {
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
  } else {
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
  const erBehandlingRevurdering: boolean = behandling.type === BehandlingType.REVURDERING;
  const angittBarn = soknad.angittePersoner.filter(person => person.rolle === 'BARN');
  const barnetsFodselsdato = new Date(angittBarn[0].fødselsdato);
  const åretBarnetFyller18 = `${barnetsFodselsdato.getFullYear() + 18}-12-31`;

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
          formatereLosAksjonspunktObjekt(
            aksjonspunkt.definisjon,
            begrunnelse,
            vilkarOppfylt,
            fraDato,
            erBehandlingRevurdering && !!tilDato ? tilDato : åretBarnetFyller18
          ),
        ]);
      },
      formState: FormState,
    } as AleneOmOmsorgenProps,
  };
};
export default AleneOmOmsorgenObjektTilMikrofrontend;
