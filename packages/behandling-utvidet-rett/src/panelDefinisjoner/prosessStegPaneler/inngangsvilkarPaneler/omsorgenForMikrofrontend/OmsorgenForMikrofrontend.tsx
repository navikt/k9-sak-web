import { FormState } from '@fpsak-frontend/form';
import { Omsorgsdager } from '@navikt/k9-fe-omsorgsdager';
import { Omsorgsdager as LokalOmsorgsdager } from '@k9-sak-web/fakta-omsorgsdager';
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
  featureToggles,
}) =>
  featureToggles?.LOKALE_PAKKER ? (
    <LokalOmsorgsdager
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
  ) : (
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
