import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import { fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import { Behandling } from '@k9-sak-web/types';
import {
  AksjonspunktInformasjon,
  SaksinformasjonUtvidetRett,
  VilkarInformasjon,
} from '../../../../types/utvidetRettMikrofrontend/KartleggePropertyTilMikrofrontendTypes';
import AleneOmOmsorgenObjektTilMikrofrontend from './formateringAvDataTilMikrofrontend/AleneOmOmsorgenObjektTilMikrofrontend';
import KroniskSykObjektTilMikrofrontend from './formateringAvDataTilMikrofrontend/KroniskSykObjektTilMikrofrontend';
import MidlertidigAleneObjektTilMikrofrontend from './formateringAvDataTilMikrofrontend/MidlertidigAleneObjektTilMikrofrontend';

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

  // I utvidet rett finns det en aksjonspunkt (9013) med vilkår og tre ulike fagytelsetyper (alene om omsorg, kronisk syk og midlertidig alene).

  const aksjonspunkt = aksjonspunkter.find(ap => ap.definisjon.kode === aksjonspunktCodes.UTVIDET_RETT);
  const vilkaret = vilkar.find(v => v.vilkarType.kode === vilkarType.UTVIDETRETTVILKARET);

  const eksistererAksjonspunktOgVilkar = aksjonspunkt && vilkar;
  const eksistererVilkarForAutomatiskInnvilget =
    (fagsaksType === fagsakYtelsesType.OMSORGSPENGER_AO || fagsaksType === fagsakYtelsesType.OMSORGSPENGER_KS) &&
    vilkar;

  if (eksistererAksjonspunktOgVilkar || eksistererVilkarForAutomatiskInnvilget) {
    const skalVilkarsUtfallVises = behandling.status.kode === behandlingStatus.AVSLUTTET;
    const lesemodus = isReadOnly || !isAksjonspunktOpen;
    const aksjonspunktLost = behandling.status.kode === behandlingStatus.BEHANDLING_UTREDES && !isAksjonspunktOpen;
    const behandlingsID = behandling.id.toString();

    switch (fagsaksType) {
      case fagsakYtelsesType.OMSORGSPENGER_KS:
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

      case fagsakYtelsesType.OMSORGSPENGER_MA:
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

      case fagsakYtelsesType.OMSORGSPENGER_AO:
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
  return null;
};

export default KartleggePropertyTilUtvidetRettMikrofrontendKomponent;
