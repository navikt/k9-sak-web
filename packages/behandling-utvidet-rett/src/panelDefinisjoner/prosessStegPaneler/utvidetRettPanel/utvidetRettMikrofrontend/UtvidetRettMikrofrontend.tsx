import { Omsorgsdager } from '@k9-sak-web/prosess-omsorgsdager';
import KartleggePropertyTilUtvidetRettMikrofrontendKomponent from './KartleggePropertyTilUtvidetRettMikrofrontendKomponent';

export const UtvidetRettMikrofrontend = props => {
  const {
    saksInformasjon,
    isReadOnly,
    aksjonspunkter,
    submitCallback,
    isAksjonspunktOpen,
    behandling,
    status,
    vilkar,
  } = props;
  const containerData = KartleggePropertyTilUtvidetRettMikrofrontendKomponent(
    saksInformasjon,
    isReadOnly,
    submitCallback,
    behandling,
    { aksjonspunkter, isAksjonspunktOpen },
    { vilkar, status },
  );
  if (!containerData) {
    return null;
  }
  return <Omsorgsdager containerData={containerData} />;
};
