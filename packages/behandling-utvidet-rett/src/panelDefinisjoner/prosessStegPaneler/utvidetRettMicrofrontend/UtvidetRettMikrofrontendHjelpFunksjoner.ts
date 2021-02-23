import FagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import { Aksjonspunkt, Behandling, Vilkar } from '@k9-sak-web/types';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
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

const filtrerVilkar = (vilkarArr: Vilkar[], vilkarTypeFraAksjonspunkt: string) => {
  const vilkarFraAksjonspunkt = vilkarArr.filter(vilkar => vilkar.vilkarType.kode === vilkarTypeFraAksjonspunkt);
  if (vilkarFraAksjonspunkt[0]) return vilkarFraAksjonspunkt[0];
  return undefined;
};

const generereNavnPåAksjonspunktForVurdertVilkar = (vilkarTypeFraAksjonspunkt: string) => {
  let navn = '';
  // TODO legg till for omsorgen for når den får egen vilkarskode og for KS og MA når de får to ulike.
  switch (vilkarTypeFraAksjonspunkt) {
    case vilkarType.UTVIDETRETTVILKARET:
      navn = 'Utvidet rett';
      break;
    default:
      navn = 'Omsorgen for';
      break;
  }
  return navn;
};

const generereInfoForVurdertVilkar = (
  skalVilkarsUtfallVises: boolean,
  vilkarArr: Vilkar[],
  vilkarTypeFraAksjonspunkt: string,
) => {
  const vurdertVilkar = {
    begrunnelse: '',
    navnPåAksjonspunkt: '',
    vilkarOppfylt: false,
    vilkar: '',
  };

  if (skalVilkarsUtfallVises) {
    const vilkar = filtrerVilkar(vilkarArr, vilkarTypeFraAksjonspunkt);
    if (vilkar && vilkar.perioder.length > 0) {
      const periode = vilkar.perioder[0];
      vurdertVilkar.begrunnelse = periode.begrunnelse;
      vurdertVilkar.navnPåAksjonspunkt = generereNavnPåAksjonspunktForVurdertVilkar(vilkarTypeFraAksjonspunkt);
      vurdertVilkar.vilkarOppfylt = periode.vilkarStatus.kode === vilkarUtfallType.OPPFYLT;
      vurdertVilkar.vilkar = vilkar.lovReferanse;
    }
  }
  return vurdertVilkar;
};

const erVilkarVurdert = (vilkarArr: Vilkar[], vilkarTypeFraAksjonspunkt: string) => {
  const vilkar = filtrerVilkar(vilkarArr, vilkarTypeFraAksjonspunkt);
  let vilkarVurdert = false;

  if (vilkar && vilkar.perioder.length > 0) {
    const periode = vilkar.perioder[0];
    const vilkarUtfall = periode.vilkarStatus.kode;
    vilkarVurdert = vilkarUtfall !== vilkarUtfallType.IKKE_VURDERT;
  }

  return vilkarVurdert;
};

const kartleggePropertyTilMikrofrontendKomponent = (
  behandling: Behandling,
  isReadOnly: boolean,
  aksjonspunkter: Aksjonspunkt[],
  vilkar: Vilkar[],
  submitCallback,
  isAksjonspunktOpen,
) => {
  let objektTilMikrofrontend = {};
  const aksjonspunktKode = aksjonspunkter[0].definisjon.kode;
  const fagsaksType = behandling.fagSaksType;
  const vilkarTypeFraAksjonspunkt = aksjonspunkter[0].vilkarType.kode;
  const skalVilkarsUtfallVises = !isAksjonspunktOpen && erVilkarVurdert(vilkar, vilkarTypeFraAksjonspunkt);

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
            vedtakFattetVilkarOppfylt: skalVilkarsUtfallVises,
            informasjonOmVilkar: generereInfoForVurdertVilkar(
              skalVilkarsUtfallVises,
              vilkar,
              vilkarTypeFraAksjonspunkt,
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
