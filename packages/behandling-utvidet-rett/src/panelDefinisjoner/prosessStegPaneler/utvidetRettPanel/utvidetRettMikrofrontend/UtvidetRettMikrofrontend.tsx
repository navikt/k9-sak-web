import { Omsorgsdager } from '@navikt/k9-fe-omsorgsdager';
import { Omsorgsdager as LokalOmsorgsdager } from '@k9-sak-web/fakta-omsorgsdager';
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
    featureToggles,
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
  if (featureToggles?.LOKALE_PAKKER) {
    return <LokalOmsorgsdager containerData={containerData} />;
  }
  return <Omsorgsdager containerData={containerData} />;
};
