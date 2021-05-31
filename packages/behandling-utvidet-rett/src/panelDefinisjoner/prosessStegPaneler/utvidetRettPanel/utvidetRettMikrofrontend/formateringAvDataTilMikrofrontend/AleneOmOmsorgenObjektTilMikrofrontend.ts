import { Aksjonspunkt, Vilkar } from '@k9-sak-web/types';
import { FormState } from '@fpsak-frontend/form/index';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import UtvidetRettMikrofrontendVisning from '../../../../../types/MikrofrontendKomponenter';
import { generereInfoForVurdertVilkar } from '../../../UtvidetRettOmsorgenForMikrofrontendFelles';
import UtvidetRettSoknad from '../../../../../types/UtvidetRettSoknad';
import {
  AleneOmOmsorgenProps,
  AleneOmOmsorgenSoknadsopplysninger,
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
  if (vilkar.perioder[0]) {
    return {
      begrunnelse: aksjonspunkt.begrunnelse,
      vilkarOppfylt: status === vilkarUtfallType.OPPFYLT,
      fraDato: vilkar.perioder[0].periode.fom,
      avslagsArsakErPeriodeErIkkeOverSeksMån:
        vilkar.perioder[0]?.avslagKode === AvslagskoderMidlertidigAlene.VARIGHET_UNDER_SEKS_MÅN,
    };
  }
  return {
    begrunnelse: '',
    vilkarOppfylt: false,
    avslagsArsakErIkkeRiskioFraFravaer: false,
    fraDato: '',
  };
};

const formatereLosAksjonspunktObjekt = (
  aksjonspunktKode: string,
  begrunnelse: string,
  erVilkarOk: boolean,
  fraDato: string,
  avslagsArsakErPeriodeErIkkeOverSeksMån: boolean,
) => {
  const losAksjonspunktObjekt = {
    kode: aksjonspunktKode,
    begrunnelse,
    erVilkarOk,
    periode: {
      fom: fraDato,
      tom: '',
    },
  };

  if (!erVilkarOk) {
    losAksjonspunktObjekt['avslagsårsak'] = avslagsArsakErPeriodeErIkkeOverSeksMån
      ? AvslagskoderMidlertidigAlene.VARIGHET_UNDER_SEKS_MÅN
      : AvslagskoderMidlertidigAlene.REGNES_IKKE_SOM_Å_HA_ALENEOMSORG;
  }
  return losAksjonspunktObjekt;
};

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
}: OwnProps) => ({
  visKomponent: UtvidetRettMikrofrontendVisning.VILKAR_ALENE_OM_OMSORGEN,
  props: {
    behandlingsID,
    lesemodus,
    aksjonspunktLost,
    soknadsopplysninger: {
      årsak: 'Årsak',
      beskrivelse: 'Beskrivelse',
      fraDato: soknad?.søknadsperiode.fom,
      soknadsdato: soknad.soknadsdato,
    } as AleneOmOmsorgenSoknadsopplysninger,
    vedtakFattetVilkarOppfylt: skalVilkarsUtfallVises,
    informasjonOmVilkar: generereInfoForVurdertVilkar(
      skalVilkarsUtfallVises,
      vilkarKnyttetTilAksjonspunkt,
      aksjonspunkt.begrunnelse,
      'Utvidet Rett',
    ),
    informasjonTilLesemodus: formatereLesemodusObjekt(vilkarKnyttetTilAksjonspunkt, aksjonspunkt, status),
    losAksjonspunkt: ({ begrunnelse, vilkarOppfylt, fraDato, avslagsArsakErPeriodeErIkkeOverSeksMån }) => {
      submitCallback([
        formatereLosAksjonspunktObjekt(
          aksjonspunkt.definisjon.kode,
          begrunnelse,
          vilkarOppfylt,
          fraDato,
          avslagsArsakErPeriodeErIkkeOverSeksMån,
        ),
      ]);
    },
    formState: FormState,
  } as AleneOmOmsorgenProps,
});
export default AleneOmOmsorgenObjektTilMikrofrontend;
