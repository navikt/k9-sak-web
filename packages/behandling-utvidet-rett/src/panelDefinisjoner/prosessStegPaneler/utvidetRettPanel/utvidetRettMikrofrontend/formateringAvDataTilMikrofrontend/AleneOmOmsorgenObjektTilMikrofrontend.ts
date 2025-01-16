import { FormState } from '@fpsak-frontend/form/index';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import BehandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import { KomponenterEnum } from '@k9-sak-web/prosess-omsorgsdager';
import { Aksjonspunkt, Behandling, Vilkar } from '@k9-sak-web/types';
import UtvidetRettSoknad from '../../../../../types/UtvidetRettSoknad';
import AvslagskoderAleneOmOmsorgen from '../../../../../types/utvidetRettMikrofrontend/AvslagskoderAleneOmOmsorgen';
import {
  AleneOmOmsorgenAksjonspunktObjekt,
  AleneOmOmsorgenLosAksjonspunktK9Format,
  AleneOmOmsorgenProps,
} from '../../../../../types/utvidetRettMikrofrontend/VilkarAleneOmOmsorgenProps';
import { generereInfoForVurdertVilkar } from '../../../UtvidetRettOmsorgenForMikrofrontendFelles';

interface OwnProps {
  behandling: Behandling;
  aksjonspunktLost: boolean;
  lesemodus: boolean;
  vilkar: Vilkar;
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
      avslagsårsakKode: vilkar.perioder[0].avslagKode,
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
  avslagsårsakKode: string,
  fraDato: string,
  tilDato: string,
) => {
  const losAksjonspunktObjekt: AleneOmOmsorgenLosAksjonspunktK9Format = {
    kode: aksjonspunktKode,
    begrunnelse,
    erVilkarOk,
    avslagsårsak: erVilkarOk ? null : avslagsårsakKode,
    periode: {
      fom: fraDato,
    },
  };

  if (erVilkarOk) {
    losAksjonspunktObjekt.periode.tom = tilDato;
  }

  return losAksjonspunktObjekt;
};

const AleneOmOmsorgenObjektTilMikrofrontend = ({
  behandling,
  aksjonspunktLost,
  lesemodus,
  vilkar,
  status,
  aksjonspunkt,
  skalVilkarsUtfallVises,
  submitCallback,
  soknad,
}: OwnProps): {
  visKomponent: KomponenterEnum.ALENE_OM_OMSORGEN;
  props: AleneOmOmsorgenProps;
} => {
  const erBehandlingRevurdering: boolean = behandling.type.kode === BehandlingType.REVURDERING;
  const angittBarn = soknad.angittePersoner.filter(person => person.rolle === 'BARN');
  const barnetsFodselsdato = new Date(angittBarn[0].fødselsdato);
  const åretBarnetFyller18 = `${barnetsFodselsdato.getFullYear() + 18}-12-31`;

  const vilkaretVurderesManuelltMedAksjonspunkt =
    aksjonspunkt && vilkar && aksjonspunkt.definisjon.kode === aksjonspunktCodes.UTVIDET_RETT;
  // Vilkåret kan kun bli automatisk innvilget. Dersom det blir automatiskt avslått resulterer det i manuell vurdering via aksjonspunkt.
  const vilkaretErAutomatiskInnvilget =
    !aksjonspunkt && vilkar && vilkar.perioder[0]?.vilkarStatus.kode === vilkarUtfallType.OPPFYLT;

  if (vilkaretVurderesManuelltMedAksjonspunkt) {
    return {
      visKomponent: KomponenterEnum.ALENE_OM_OMSORGEN,
      props: {
        behandlingsID: behandling.id.toString(),
        lesemodus,
        aksjonspunktLost,
        fraDatoFraVilkar: vilkar?.perioder[0]?.periode?.fom,
        vedtakFattetVilkarOppfylt: skalVilkarsUtfallVises,
        erBehandlingstypeRevurdering: erBehandlingRevurdering,
        informasjonOmVilkar: generereInfoForVurdertVilkar({
          skalVilkarsUtfallVises,
          vilkår: vilkar,
          begrunnelseFraAksjonspunkt: aksjonspunkt.begrunnelse,
          begrunnelseFraVilkår: vilkar?.perioder[0].begrunnelse,
          navnPåAksjonspunkt: 'Utvidet Rett',
        }),
        informasjonTilLesemodus: formatereLesemodusObjekt(vilkar, aksjonspunkt, status),
        losAksjonspunkt: ({ begrunnelse, vilkarOppfylt, avslagsårsakKode, fraDato, tilDato }) => {
          submitCallback([
            formatereLosAksjonspunktObjekt(
              aksjonspunkt.definisjon.kode,
              begrunnelse,
              vilkarOppfylt,
              avslagsårsakKode ?? AvslagskoderAleneOmOmsorgen.IKKE_GRUNNLAG_ALENE_OMSORG,
              fraDato,
              erBehandlingRevurdering && !!tilDato ? tilDato : åretBarnetFyller18,
            ),
          ]);
        },
        formState: FormState,
      } as AleneOmOmsorgenProps,
    };
  }

  if (vilkaretErAutomatiskInnvilget) {
    return {
      visKomponent: KomponenterEnum.ALENE_OM_OMSORGEN,
      props: {
        behandlingsID: behandling.id.toString(),
        aksjonspunktLost: false,
        fraDatoFraVilkar: vilkar?.perioder[0]?.periode?.fom,
        vedtakFattetVilkarOppfylt: true,
        erBehandlingstypeRevurdering: erBehandlingRevurdering,
        informasjonOmVilkar: generereInfoForVurdertVilkar({
          skalVilkarsUtfallVises: true,
          vilkår: vilkar,
          begrunnelseFraAksjonspunkt: '',
          begrunnelseFraVilkår: vilkar?.perioder[0].begrunnelse,
          navnPåAksjonspunkt: 'Utvidet Rett',
        }),
        formState: FormState,
      } as AleneOmOmsorgenProps,
    };
  }

  return null;
};
export default AleneOmOmsorgenObjektTilMikrofrontend;
