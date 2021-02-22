import FagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import { Aksjonspunkt, Behandling } from '@k9-sak-web/types';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { VilkarMidlertidigAleneProps } from '../../../types/utvidetRettMikrofrontend/VilkarMidlertidigAleneProps';

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
        visKomponent: 'Omsorg',
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
          visKomponent: 'VilkarKroniskSyktBarn',
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
          visKomponent: 'VilkarMidlertidigAlene',
          props: {
            lesemodus: false,
            soknadsopplysninger: {
              årsak: 'Årsak',
              beskrivelse: 'Beskrivelse',
              periode: 'DD.MM.ÅÅÅÅ - DD.MM.ÅÅÅÅ',
            },
            informasjonTilLesemodus: {
              begrunnelse: 'Begrunnelse',
              vilkarOppfylt: true,
              dato: {
                til: '22.03.1993',
                fra: '22.12.1994',
              },
            },
            onSubmit: ({ begrunnelse, erSokerenMidlertidigAleneOmOmsorgen, fra, til }) => {
              submitCallback([
                {
                  kode: aksjonspunktCodes.UTVIDET_RETT,
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
      }
      break;
    }
    default:
      break;
  }
  return objektTilMikrofrontend;
};

export default kartleggePropertyTilMikrofrontendKomponent;
