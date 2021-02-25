import FagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import { Aksjonspunkt, Behandling, Vilkar } from '@k9-sak-web/types';
import { VilkarMidlertidigAleneProps } from '../../../../types/utvidetRettMikrofrontend/VilkarMidlertidigAleneProps';
import UtvidetRettMikrofrontendVisning from '../../../../types/MikrofrontendKomponenter';
import { erVilkarVurdert, generereInfoForVurdertVilkar } from '../../UtvidetRettOmsorgenForMikrofrontendFelles';

const KartleggePropertyTilMikrofrontendKomponent = (
  behandling: Behandling,
  isReadOnly: boolean,
  aksjonspunkter: Aksjonspunkt[],
  vilkar: Vilkar[],
  submitCallback,
  isAksjonspunktOpen,
  soknad,
  fagsaksType,
) => {
  let objektTilMikrofrontend = {};
  const aksjonspunktKode = aksjonspunkter[0].definisjon.kode;
  const vilkarTypeFraAksjonspunkt = aksjonspunkter[0].vilkarType.kode;
  const skalVilkarsUtfallVises = !isAksjonspunktOpen && erVilkarVurdert(vilkar, vilkarTypeFraAksjonspunkt);

  switch (fagsaksType) {
    case FagsakYtelseType.OMSORGSPENGER_KRONISK_SYKT_BARN: {
      objektTilMikrofrontend = {
        visKomponent: UtvidetRettMikrofrontendVisning.VILKAR_KRONISK_SYKT_BARN,
        props: {
          lesemodus: false,
          legeerklaeringsinfo: { harDokumentasjon: true, harSammenheng: true, begrunnelse: 'Begrunnelse' },
          losAksjonspunkt: (harDokumentasjon, harSammenheng, begrunnelse) =>
            submitCallback([
              {
                kode: aksjonspunktKode,
                begrunnelse,
                harSammenheng,
                harDokumentasjon,
              },
            ]),
        },
      };
      break;
    }
    case FagsakYtelseType.OMSORGSPENGER_MIDLERTIDIG_ALENE: {
      objektTilMikrofrontend = {
        visKomponent: UtvidetRettMikrofrontendVisning.VILKAR_MIDLERTIDIG_ALENE,
        props: {
          lesemodus: isReadOnly,
          // TODO Lägg in söknadsupplysningar när det är tillgängligt från API.
          soknadsopplysninger: {
            årsak: 'Årsak',
            beskrivelse: 'Beskrivelse',
            periode: `${soknad.søknadsperiode.fom} - ${soknad.søknadsperiode.tom}`,
          },
          vedtakFattetVilkarOppfylt: false,
          informasjonOmVilkar: generereInfoForVurdertVilkar(
            skalVilkarsUtfallVises,
            vilkar,
            vilkarTypeFraAksjonspunkt,
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
          onSubmit: ({ begrunnelse, erSokerenMidlertidigAleneOmOmsorgen, fra, til }) => {
            submitCallback([
              {
                kode: aksjonspunktKode,
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
  return objektTilMikrofrontend;
};

export default KartleggePropertyTilMikrofrontendKomponent;
