import { Omsorgsdager } from '@k9-sak-web/fakta-omsorgsdager';
import React from 'react';
import KartleggePropertyTilUtvidetRettMikrofrontendKomponent from './KartleggePropertyTilUtvidetRettMikrofrontendKomponent';

export default props => {
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
