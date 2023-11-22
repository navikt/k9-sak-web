import { FormState } from '@fpsak-frontend/form';
import { Omsorgsdager } from '@k9-sak-web/fakta-omsorgsdager';
import React from 'react';
import KartleggePropertyTilOmsorgenForMikrofrontendKomponent from './KartleggePropertyTilOmsorgenForMikrofrontendKomponent';

export default ({
  isReadOnly,
  aksjonspunkter,
  isAksjonspunktOpen,
  submitCallback,
  behandling,
  status,
  vilkar,
  angitteBarn,
  fagsaksType,
  harBarnSoktForRammevedtakOmKroniskSyk,
}) => (
  <Omsorgsdager
    containerData={KartleggePropertyTilOmsorgenForMikrofrontendKomponent({
      isReadOnly,
      submitCallback,
      behandling,
      angitteBarn,
      aksjonspunktInformasjon: { aksjonspunkter, isAksjonspunktOpen },
      vilkarInformasjon: { vilkar, status },
      fagsaksType,
      FormState,
      harBarnSoktForRammevedtakOmKroniskSyk,
    })}
  />
);
