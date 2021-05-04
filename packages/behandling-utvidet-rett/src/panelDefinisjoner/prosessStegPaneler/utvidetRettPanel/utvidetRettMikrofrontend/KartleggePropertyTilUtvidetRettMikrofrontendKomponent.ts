import FagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import { Behandling } from '@k9-sak-web/types';
import { FormStateType } from '@fpsak-frontend/form/src/types/FormStateType';
import { VilkarMidlertidigAleneProps } from '../../../../types/utvidetRettMikrofrontend/VilkarMidlertidigAleneProps';
import UtvidetRettMikrofrontendVisning from '../../../../types/MikrofrontendKomponenter';
import { generereInfoForVurdertVilkar } from '../../UtvidetRettOmsorgenForMikrofrontendFelles';
import { VilkarKroniskSyktBarnProps } from '../../../../types/utvidetRettMikrofrontend/VilkarKroniskSyktBarnProps';
import {
  AksjonspunktInformasjon,
  SaksinformasjonUtvidetRett,
  VilkarInformasjon,
} from '../../../../types/utvidetRettMikrofrontend/KartleggePropertyTilMikrofrontendTypes';
import {
  formatereLesemodusObjektForKroniskSyk,
  formatereLesemodusObjektForMidlertidigAlene,
  formatereLosAksjonspunktObjektForKroniskSyk,
  formatereLosAksjonspunktObjektForMidlertidigAlene,
} from './FormatereObjektForUtvidetRett';

const KartleggePropertyTilUtvidetRettMikrofrontendKomponent = (
  saksInformasjon: SaksinformasjonUtvidetRett,
  isReadOnly: boolean,
  submitCallback,
  behandling: Behandling,
  aksjonspunktInformasjon: AksjonspunktInformasjon,
  vilkarInformasjon: VilkarInformasjon,
  FormState: FormStateType,
) => {
  let objektTilMikrofrontend = {};
  const { soknad, fagsaksType } = saksInformasjon;
  const { aksjonspunkter, isAksjonspunktOpen } = aksjonspunktInformasjon;
  const { vilkar, status } = vilkarInformasjon;

  const aksjonspunkt = aksjonspunkter[0];
  const vilkarKnyttetTilAksjonspunkt = vilkar[0];
  const eksistererAksjonspunktOgVilkar = aksjonspunkt && vilkarKnyttetTilAksjonspunkt;

  if (eksistererAksjonspunktOgVilkar) {
    const skalVilkarsUtfallVises = behandling.status.kode === behandlingStatus.AVSLUTTET;
    const lesemodus = isReadOnly || !isAksjonspunktOpen;
    const aksjonspunktLost = behandling.status.kode === behandlingStatus.BEHANDLING_UTREDES && !isAksjonspunktOpen;
    const behandlingsID = behandling.id.toString();

    switch (fagsaksType) {
      case FagsakYtelseType.OMSORGSPENGER_KRONISK_SYKT_BARN: {
        objektTilMikrofrontend = {
          visKomponent: UtvidetRettMikrofrontendVisning.VILKAR_KRONISK_SYKT_BARN,
          props: {
            behandlingsID,
            aksjonspunktLost,
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
                  avslagsArsakErIkkeRiskioFraFravaer,
                ),
              ]);
            },
            formState: FormState,
          } as VilkarKroniskSyktBarnProps,
        };
        break;
      }
      case FagsakYtelseType.OMSORGSPENGER_MIDLERTIDIG_ALENE: {
        const angittForelder = soknad.angittePersoner.filter(person => person.rolle === 'ANPA');
        objektTilMikrofrontend = {
          visKomponent: UtvidetRettMikrofrontendVisning.VILKAR_MIDLERTIDIG_ALENE,
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
              vilkarKnyttetTilAksjonspunkt,
              aksjonspunkt.begrunnelse,
              'Utvidet Rett',
            ),
            informasjonTilLesemodus: formatereLesemodusObjektForMidlertidigAlene(
              vilkarKnyttetTilAksjonspunkt,
              aksjonspunkt,
              status,
            ),
            losAksjonspunkt: ({
              begrunnelse,
              erSokerenMidlertidigAleneOmOmsorgen,
              fra,
              til,
              avslagsArsakErPeriodeErIkkeOverSeksMån,
            }) => {
              submitCallback([
                formatereLosAksjonspunktObjektForMidlertidigAlene(
                  aksjonspunkt.definisjon.kode,
                  begrunnelse,
                  erSokerenMidlertidigAleneOmOmsorgen,
                  {
                    fom: fra,
                    tom: til,
                  },
                  avslagsArsakErPeriodeErIkkeOverSeksMån,
                ),
              ]);
            },
            formState: FormState,
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
