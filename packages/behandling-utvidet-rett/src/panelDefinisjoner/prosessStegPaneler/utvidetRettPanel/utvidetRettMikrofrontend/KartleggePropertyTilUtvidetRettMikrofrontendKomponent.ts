import FagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import { Aksjonspunkt, Vilkar } from '@k9-sak-web/types';
import { VilkarMidlertidigAleneProps } from '../../../../types/utvidetRettMikrofrontend/VilkarMidlertidigAleneProps';
import UtvidetRettMikrofrontendVisning from '../../../../types/MikrofrontendKomponenter';
import {
  erVilkarVurdert,
  generereInfoForVurdertVilkar,
  hentBegrunnelseOgVilkarOppfylt,
} from '../../UtvidetRettOmsorgenForMikrofrontendFelles';
import { VilkarKroniskSyktBarnProps } from '../../../../types/utvidetRettMikrofrontend/VilkarKroniskSyktBarnProps';
import UtvidetRettSoknad from '../../../../types/UtvidetRettSoknad';
import { InformasjonTilLesemodus } from '../../../../types/utvidetRettMikrofrontend/informasjonTilLesemodus';

interface Saksinformasjon {
  fagsaksType: string;
  vedtakFattetAksjonspunkt: Aksjonspunkt[];
  vilkar: Vilkar[];
  soknad: UtvidetRettSoknad;
}

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

  if (aksjonspunkt && vilkarKnyttetTilAksjonspunkt) {
    const vedtakFattet = vedtakFattetAksjonspunkt.length > 0 && !vedtakFattetAksjonspunkt[0].kanLoses;
    const skalVilkarsUtfallVises = !isAksjonspunktOpen && vedtakFattet && erVilkarVurdert(vilkarKnyttetTilAksjonspunkt);

    switch (fagsaksType) {
      case FagsakYtelseType.OMSORGSPENGER_KRONISK_SYKT_BARN: {
        objektTilMikrofrontend = {
          visKomponent: UtvidetRettMikrofrontendVisning.VILKAR_KRONISK_SYKT_BARN,
          props: {
            lesemodus: isReadOnly || !isAksjonspunktOpen,
            informasjonTilLesemodus: hentBegrunnelseOgVilkarOppfylt(
              vilkarKnyttetTilAksjonspunkt,
              aksjonspunkt,
            ) as InformasjonTilLesemodus,
            vedtakFattetVilkarOppfylt: skalVilkarsUtfallVises,
            informasjonOmVilkar: generereInfoForVurdertVilkar(
              skalVilkarsUtfallVises,
              vilkarKnyttetTilAksjonspunkt,
              aksjonspunkt.begrunnelse,
              'Utvidet Rett',
            ),
            losAksjonspunkt: (endreHarDokumentasjonOgFravaerRisiko, begrunnelse) => {
              submitCallback([
                {
                  kode: aksjonspunkt.definisjon.kode,
                  begrunnelse,
                  erVilkarOk: endreHarDokumentasjonOgFravaerRisiko,
                  periode: {
                    fom: soknad.søknadsperiode.fom,
                    tom: soknad.søknadsperiode.tom,
                  },
                },
              ]);
            },
          } as VilkarKroniskSyktBarnProps,
        };
        break;
      }
      case FagsakYtelseType.OMSORGSPENGER_MIDLERTIDIG_ALENE: {
        objektTilMikrofrontend = {
          visKomponent: UtvidetRettMikrofrontendVisning.VILKAR_MIDLERTIDIG_ALENE,
          props: {
            lesemodus: isReadOnly || !isAksjonspunktOpen,
            // Lägg in söknadsupplysningar när det är tillgängligt från API.
            soknadsopplysninger: {
              årsak: 'Årsak',
              beskrivelse: 'Beskrivelse',
              periode: `${soknad.søknadsperiode.fom} - ${soknad.søknadsperiode.tom}`,
            },
            vedtakFattetVilkarOppfylt: skalVilkarsUtfallVises,
            informasjonOmVilkar: generereInfoForVurdertVilkar(
              skalVilkarsUtfallVises,
              vilkarKnyttetTilAksjonspunkt,
              aksjonspunkt.begrunnelse,
              'Utvidet Rett',
            ),
            informasjonTilLesemodus: {
              begrunnelse: 'Begrunnelse',
              vilkarOppfylt: true,
              dato: {
                fra: '22.03.1993',
                til: '22.12.1994',
              },
            },
            losAksjonspunkt: ({ begrunnelse, erSokerenMidlertidigAleneOmOmsorgen, fra, til }) => {
              submitCallback([
                {
                  kode: aksjonspunkt.definisjon.kode,
                  begrunnelse,
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
  } else {
    objektTilMikrofrontend = {
      visKomponent: UtvidetRettMikrofrontendVisning.ERROR,
    };
  }
  return objektTilMikrofrontend;
};

export default KartleggePropertyTilUtvidetRettMikrofrontendKomponent;
