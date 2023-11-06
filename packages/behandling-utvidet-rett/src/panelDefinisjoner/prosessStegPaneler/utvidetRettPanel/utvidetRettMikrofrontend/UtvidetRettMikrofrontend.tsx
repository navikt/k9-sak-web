import { Omsorgsdager } from '@navikt/k9-fe-omsorgsdager';
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
  return (
    <Omsorgsdager
      containerData={KartleggePropertyTilUtvidetRettMikrofrontendKomponent(
        saksInformasjon,
        isReadOnly,
        submitCallback,
        behandling,
        { aksjonspunkter, isAksjonspunktOpen },
        { vilkar, status },
      )}
    />
  );
};
