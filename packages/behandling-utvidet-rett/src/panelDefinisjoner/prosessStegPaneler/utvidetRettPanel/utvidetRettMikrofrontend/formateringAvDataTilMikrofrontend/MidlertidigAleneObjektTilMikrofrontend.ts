import { Aksjonspunkt, Vilkar } from '@k9-sak-web/types';
import { FormState } from '@fpsak-frontend/form/index';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import { KomponenterEnum } from '@k9-sak-web/prosess-omsorgsdager';
import { generereInfoForVurdertVilkar } from '../../../UtvidetRettOmsorgenForMikrofrontendFelles';
import { VilkarMidlertidigAleneProps } from '../../../../../types/utvidetRettMikrofrontend/VilkarMidlertidigAleneProps';
import UtvidetRettSoknad from '../../../../../types/UtvidetRettSoknad';

interface OwnProps {
  behandlingsID: string;
  aksjonspunktLost: boolean;
  lesemodus: boolean;
  vilkar: Vilkar;
  status: string;
  aksjonspunkt: Aksjonspunkt;
  skalVilkarsUtfallVises: boolean;
  submitCallback;
  soknad: UtvidetRettSoknad;
}

const formatereLesemodusObjektForMidlertidigAlene = (vilkar: Vilkar, aksjonspunkt: Aksjonspunkt, status: string) => {
  if (vilkar.perioder[0].vilkarStatus !== vilkarUtfallType.IKKE_VURDERT) {
    return {
      begrunnelse: aksjonspunkt.begrunnelse,
      vilkarOppfylt: status === vilkarUtfallType.OPPFYLT,
      dato: {
        fra: vilkar.perioder[0].periode.fom,
        til: vilkar.perioder[0].periode.tom,
      },
      avslagsårsakKode: vilkar.perioder[0]?.avslagKode
    };
  }
  return {
    begrunnelse: '',
    vilkarOppfylt: false,
    dato: {
      fra: '',
      til: '',
    },
  };
};

const formatereLosAksjonspunktObjektForMidlertidigAlene = (
  aksjonspunktKode: string,
  begrunnelse: string,
  erVilkarOk: boolean,
  periode: {
    fom: string;
    tom: string;
  },
  avslagsårsakKode: string
) => {
  const losAksjonspunktObjekt = {
    kode: aksjonspunktKode,
    begrunnelse,
    erVilkarOk,
    periode,
    avslagsårsak: erVilkarOk ? null : avslagsårsakKode
  };

  return losAksjonspunktObjekt;
};

const MidlertidigAleneObjektTilMikrofrontend = ({
  behandlingsID,
  aksjonspunktLost,
  lesemodus,
  vilkar,
  status,
  aksjonspunkt,
  skalVilkarsUtfallVises,
  submitCallback,
  soknad,
}: OwnProps): {
  visKomponent: KomponenterEnum.VILKAR_MIDLERTIDIG_ALENE;
  props: VilkarMidlertidigAleneProps;
} => {
  const angittForelder = soknad.angittePersoner.filter(person => person.rolle === 'ANPA');
  return {
    visKomponent: KomponenterEnum.VILKAR_MIDLERTIDIG_ALENE,
    props: {
      behandlingsID,
      aksjonspunktLost,
      lesemodus,
      soknadsopplysninger: {
        årsak: angittForelder[0]?.situasjonKode || '',
        beskrivelse: angittForelder[0]?.tilleggsopplysninger || '',
        periode: `${soknad.søknadsperiode.fom} - ${soknad.søknadsperiode.tom}`,
        soknadsdato: soknad.soknadsdato,
      },
      vedtakFattetVilkarOppfylt: skalVilkarsUtfallVises,
      informasjonOmVilkar: generereInfoForVurdertVilkar(
        skalVilkarsUtfallVises,
        vilkar,
        aksjonspunkt.begrunnelse,
        'Utvidet Rett',
      ),
      informasjonTilLesemodus: formatereLesemodusObjektForMidlertidigAlene(vilkar, aksjonspunkt, status),
      losAksjonspunkt: ({
        begrunnelse,
        erSokerenMidlertidigAleneOmOmsorgen,
        fra,
        til,
        avslagsårsakKode
      }) => {
        submitCallback([
          formatereLosAksjonspunktObjektForMidlertidigAlene(
            aksjonspunkt.definisjon,
            begrunnelse,
            erSokerenMidlertidigAleneOmOmsorgen,
            {
              fom: fra,
              tom: til,
            },
            avslagsårsakKode
          ),
        ]);
      },
      formState: FormState,
    } as VilkarMidlertidigAleneProps,
  };
};

export default MidlertidigAleneObjektTilMikrofrontend;
