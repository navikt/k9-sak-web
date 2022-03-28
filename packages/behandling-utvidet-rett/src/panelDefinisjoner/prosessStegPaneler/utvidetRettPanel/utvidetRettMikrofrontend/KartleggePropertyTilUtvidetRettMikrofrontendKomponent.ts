import FagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import { Behandling } from '@k9-sak-web/types';
import {
  AksjonspunktInformasjon,
  SaksinformasjonUtvidetRett,
  VilkarInformasjon,
} from '../../../../types/utvidetRettMikrofrontend/KartleggePropertyTilMikrofrontendTypes';
import KroniskSykObjektTilMikrofrontend from './formateringAvDataTilMikrofrontend/KroniskSykObjektTilMikrofrontend';
import MidlertidigAleneObjektTilMikrofrontend from './formateringAvDataTilMikrofrontend/MidlertidigAleneObjektTilMikrofrontend';
import AleneOmOmsorgenObjektTilMikrofrontend from './formateringAvDataTilMikrofrontend/AleneOmOmsorgenObjektTilMikrofrontend';

const KartleggePropertyTilUtvidetRettMikrofrontendKomponent = (
  saksInformasjon: SaksinformasjonUtvidetRett,
  isReadOnly: boolean,
  submitCallback,
  behandling: Behandling,
  aksjonspunktInformasjon: AksjonspunktInformasjon,
  vilkarInformasjon: VilkarInformasjon,
) => {
  const { soknad, fagsaksType } = saksInformasjon;
  const { aksjonspunkter, isAksjonspunktOpen } = aksjonspunktInformasjon;
  const { vilkar, status } = vilkarInformasjon;

  // I utvidet rett finns det en aksjonspunkt (9013) og tre ulike vilkår (alene om omsorg, kronisk syk og midlertidig alene).
  // Hver behandling får ned det aktuelle vilkåret hit med kun en periode.

  const aksjonspunkt = aksjonspunkter[0];
  const vilkaret = vilkar[0];
  const eksistererAksjonspunktOgVilkar = aksjonspunkt && vilkar;

  if (eksistererAksjonspunktOgVilkar) {
    const skalVilkarsUtfallVises = behandling.status.kode === behandlingStatus.AVSLUTTET;
    const lesemodus = isReadOnly || !isAksjonspunktOpen;
    const aksjonspunktLost = behandling.status.kode === behandlingStatus.BEHANDLING_UTREDES && !isAksjonspunktOpen;
    const behandlingsID = behandling.id.toString();

    switch (fagsaksType) {
      case FagsakYtelseType.OMSORGSPENGER_KRONISK_SYKT_BARN:
        return KroniskSykObjektTilMikrofrontend({
          behandlingsID,
          aksjonspunktLost,
          lesemodus,
          vilkar: vilkaret,
          aksjonspunkt,
          skalVilkarsUtfallVises,
          submitCallback,
          soknad,
        });

      case FagsakYtelseType.OMSORGSPENGER_MIDLERTIDIG_ALENE:
        return MidlertidigAleneObjektTilMikrofrontend({
          behandlingsID,
          aksjonspunktLost,
          lesemodus,
          vilkar: vilkaret,
          status,
          aksjonspunkt,
          skalVilkarsUtfallVises,
          submitCallback,
          soknad,
        });

      case FagsakYtelseType.OMSORGSPENGER_ALENE_OM_OMSORGEN:
        return AleneOmOmsorgenObjektTilMikrofrontend({
          behandling,
          aksjonspunktLost,
          lesemodus,
          vilkar: vilkaret,
          status,
          aksjonspunkt,
          skalVilkarsUtfallVises,
          submitCallback,
          soknad,
        });
      default:
        break;
    }
  }
  return {};
};

export default KartleggePropertyTilUtvidetRettMikrofrontendKomponent;
