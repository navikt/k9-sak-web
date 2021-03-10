import FagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import { Aksjonspunkt, Vilkar } from '@k9-sak-web/types';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import { VilkarMidlertidigAleneProps } from '../../../../types/utvidetRettMikrofrontend/VilkarMidlertidigAleneProps';
import UtvidetRettMikrofrontendVisning from '../../../../types/MikrofrontendKomponenter';
import {
  erVilkarVurdert,
  generereInfoForVurdertVilkar,
  hentBegrunnelseOgVilkarOppfylt,
} from '../../UtvidetRettOmsorgenForMikrofrontendFelles';
import {
  InformasjonTilLesemodusKroniskSyk,
  VilkarKroniskSyktBarnProps,
} from '../../../../types/utvidetRettMikrofrontend/VilkarKroniskSyktBarnProps';
import UtvidetRettSoknad from '../../../../types/UtvidetRettSoknad';

interface Saksinformasjon {
  fagsaksType: string;
  vedtakFattetAksjonspunkt: Aksjonspunkt[];
  vilkar: Vilkar[];
  soknad: UtvidetRettSoknad;
}

enum Avslagskoder {
  IKKE_KRONISK_SYK_ELLER_FUNKSJONSHEMMET = '1073',
  IKKE_OKT_RISIKO_FRA_FRAVAER = '1074',
}

const formatereLesemodusObjektForKroniskSyk = (vilkar: Vilkar, aksjonspunkt: Aksjonspunkt) => {
  if (vilkar.perioder[0]) {
    return {
      begrunnelse: aksjonspunkt.begrunnelse,
      vilkarOppfylt: vilkar.perioder[0].vilkarStatus.kode === vilkarUtfallType.OPPFYLT,
      avslagsArsakErIkkeRiskioFraFravaer: vilkar.perioder[0]?.avslagKode === Avslagskoder.IKKE_OKT_RISIKO_FRA_FRAVAER,
    } as InformasjonTilLesemodusKroniskSyk;
  }
  return {
    begrunnelse: '',
    vilkarOppfylt: false,
    avslagsArsakErIkkeRiskioFraFravaer: false,
  };
};

const formatereLosAksjonspunktObjektForKroniskSyk = (
  aksjonspunktKode: string,
  begrunnelse: string,
  erVilkarOk: boolean,
  fom: string,
  tom: string,
  avslagsArsakErIkkeRiskioFraFravaer: boolean,
) => {
  const losAksjonspunktObjekt = {
    kode: aksjonspunktKode,
    begrunnelse,
    erVilkarOk,
    periode: {
      fom,
      tom,
    },
  };

  if (!erVilkarOk) {
    losAksjonspunktObjekt['avslagsårsak'] = avslagsArsakErIkkeRiskioFraFravaer
      ? Avslagskoder.IKKE_OKT_RISIKO_FRA_FRAVAER
      : Avslagskoder.IKKE_KRONISK_SYK_ELLER_FUNKSJONSHEMMET;
  }

  return losAksjonspunktObjekt;
};

const KartleggePropertyTilUtvidetRettMikrofrontendKomponent = (
  saksInformasjon: Saksinformasjon,
  isReadOnly: boolean,
  aksjonspunkter: Aksjonspunkt[],
  submitCallback,
  isAksjonspunktOpen,
) => {
  let objektTilMikrofrontend = {};
  const { vilkar, soknad, fagsaksType, vedtakFattetAksjonspunkt } = saksInformasjon;
  const aksjonspunkt = aksjonspunkter[0];
  const vilkarKnyttetTilAksjonspunkt = vilkar.filter(
    vilkaret => vilkaret.vilkarType.kode === aksjonspunkt.vilkarType.kode,
  )[0];
  const eksistererAksjonspunktOgVilkar = aksjonspunkt && vilkarKnyttetTilAksjonspunkt;

  if (eksistererAksjonspunktOgVilkar) {
    const vedtakFattet = vedtakFattetAksjonspunkt.length > 0 && !vedtakFattetAksjonspunkt[0].kanLoses;
    const skalVilkarsUtfallVises = !isAksjonspunktOpen && vedtakFattet && erVilkarVurdert(vilkarKnyttetTilAksjonspunkt);
    const lesemodus = isReadOnly || !isAksjonspunktOpen;

    switch (fagsaksType) {
      case FagsakYtelseType.OMSORGSPENGER_KRONISK_SYKT_BARN: {
        objektTilMikrofrontend = {
          visKomponent: UtvidetRettMikrofrontendVisning.VILKAR_KRONISK_SYKT_BARN,
          props: {
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
                  soknad.søknadsperiode.fom,
                  soknad.søknadsperiode.tom,
                  avslagsArsakErIkkeRiskioFraFravaer,
                ),
              ]);
            },
          } as VilkarKroniskSyktBarnProps,
        };
        break;
      }
      case FagsakYtelseType.OMSORGSPENGER_MIDLERTIDIG_ALENE: {
        const angittForelder = soknad.angittePersoner.filter(person => person.rolle === 'ANPA');
        objektTilMikrofrontend = {
          visKomponent: UtvidetRettMikrofrontendVisning.VILKAR_MIDLERTIDIG_ALENE,
          props: {
            lesemodus,
            soknadsopplysninger: {
              årsak: angittForelder[0]?.situasjonKode || '',
              beskrivelse: angittForelder[0]?.tilleggsopplysninger || '',
              periode: `${soknad.søknadsperiode.fom} - ${soknad.søknadsperiode.tom}`,
            },
            vedtakFattetVilkarOppfylt: skalVilkarsUtfallVises,
            informasjonOmVilkar: generereInfoForVurdertVilkar(
              skalVilkarsUtfallVises,
              vilkarKnyttetTilAksjonspunkt,
              aksjonspunkt.begrunnelse,
              'Utvidet Rett',
            ),
            informasjonTilLesemodus: hentBegrunnelseOgVilkarOppfylt(vilkarKnyttetTilAksjonspunkt, aksjonspunkt, true),
            losAksjonspunkt: ({ begrunnelseRegistret, erSokerenMidlertidigAleneOmOmsorgen, fra, til }) => {
              submitCallback([
                {
                  kode: aksjonspunkt.definisjon.kode,
                  begrunnelse: begrunnelseRegistret,
                  erVilkarOk: erSokerenMidlertidigAleneOmOmsorgen,
                  periode: {
                    fom: fra,
                    tom: til,
                  },
                },
              ]);
            },
          } as VilkarMidlertidigAleneProps,
        };
        break;
      }
      default:
        break;
    }
  }
  return objektTilMikrofrontend;
};

export default KartleggePropertyTilUtvidetRettMikrofrontendKomponent;
