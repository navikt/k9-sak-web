import FagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import { Aksjonspunkt, Behandling } from '@k9-sak-web/types';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { VilkarMidlertidigAleneProps } from '../../../types/utvidetRettMikrofrontend/VilkarMidlertidigAleneProps';
import UtvidetRettMikrofrontendVisning from '../../../types/MikrofrontendKomponenter';

const formatereLostAksjonspunktObjekt = (aksjonspunktKode, begrunnelse, erVilkarOk, fom, tom) => {
  return {
    kode: aksjonspunktKode,
    begrunnelse,
    erVilkarOk,
    periode: {
      fom,
      tom,
    },
  };
};
const formatereInformasjonsTilLeseModusObjekt = (begrunnelse, vilkarOppfylt, fom, tom) => {
  return {
    begrunnelse,
    vilkarOppfylt,
    dato: {
      fra: fom,
      til: tom,
    },
  };
};

const kartleggePropertyTilMikrofrontendKomponent = (
  behandling: Behandling,
  isReadOnly: boolean,
  aksjonspunkter: Aksjonspunkt[],
  submitCallback,
) => {
  let objektTilMikrofrontend = {};
  const aksjonspunktKode = aksjonspunkter[0].definisjon.kode;
  const fagsaksType = behandling.fagSaksType;

  switch (aksjonspunktKode) {
    case aksjonspunktCodes.OMSORGEN_FOR:
      objektTilMikrofrontend = {
        visKomponent: UtvidetRettMikrofrontendVisning.OMSORG,
        props: {
          behandlingsid: '123',
          stiTilEndepunkt: 'api',
          prosesstype:
            fagsaksType === FagsakYtelseType.OMSORGSPENGER_KRONISK_SYKT_BARN
              ? 'KRONISK_SYKT_BARN'
              : 'MIDLERTIDIG_ALENE',
          lesemodus: isReadOnly,
        },
        onSubmit: submitCallback,
      };
      break;

    case aksjonspunktCodes.UTVIDET_RETT: {
      if (fagsaksType === FagsakYtelseType.OMSORGSPENGER_KRONISK_SYKT_BARN) {
        objektTilMikrofrontend = {
          visKomponent: UtvidetRettMikrofrontendVisning.VILKAR_KRONISK_SYKT_BARN,
          props: {
            behandlingsid: '123',
            stiTilEndepunkt: 'api',
            lesemodus: false,
          },
          onSubmit: submitCallback,
        };
      }
      if (fagsaksType === FagsakYtelseType.OMSORGSPENGER_MIDLERTIDIG_ALENE) {
        objektTilMikrofrontend = {
          visKomponent: UtvidetRettMikrofrontendVisning.VILKAR_MIDLERTIDIG_ALENE,
          props: {
            lesemodus: isReadOnly,
            // TODO Lägg in söknadsupplysningar när det är tillgängligt från API.
            soknadsopplysninger: {
              årsak: 'Årsak',
              beskrivelse: 'Beskrivelse',
              periode: 'DD.MM.ÅÅÅÅ - DD.MM.ÅÅÅÅ',
            },
            informasjonTilLesemodus: formatereInformasjonsTilLeseModusObjekt(
              'Begrunnelse',
              true,
              '22.03.1993',
              '22.12.1994',
            ),

            onSubmit: ({ begrunnelse, erSokerenMidlertidigAleneOmOmsorgen, fra, til }) => {
              submitCallback([
                formatereLostAksjonspunktObjekt(
                  aksjonspunktKode,
                  begrunnelse,
                  erSokerenMidlertidigAleneOmOmsorgen,
                  fra,
                  til,
                ),
              ]);
            },
          } as VilkarMidlertidigAleneProps,
        };
      }
      break;
    }
    default:
      break;
  }
  return objektTilMikrofrontend;
};

export default kartleggePropertyTilMikrofrontendKomponent;
