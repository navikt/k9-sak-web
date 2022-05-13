import React from 'react';
import { MicroFrontend } from '@fpsak-frontend/utils';
import { FormState } from '@fpsak-frontend/form';
import KartleggePropertyTilOmsorgenForMikrofrontendKomponent from './KartleggePropertyTilOmsorgenForMikrofrontendKomponent';

const initializeOmsorgenForVilkar = (
  elementId,
  {
    isReadOnly,
    aksjonspunkter,
    isAksjonspunktOpen,
    submitCallback,
    behandling,
    status,
    vilkar,
    angitteBarn,
    fagsaksType,
    harBarnSoktForRammevedtakOmKroniskSyk
  },
) => {
  (window as any).renderMicrofrontendOmsorgsdagerApp(
    elementId,
    KartleggePropertyTilOmsorgenForMikrofrontendKomponent({
      isReadOnly,
      submitCallback,
      behandling,
      angitteBarn,
      aksjonspunktInformasjon: { aksjonspunkter, isAksjonspunktOpen },
      vilkarInformasjon: { vilkar, status },
      fagsaksType,
      FormState,
      harBarnSoktForRammevedtakOmKroniskSyk
    }),
  );
};

export default props => {
  const omsorgenForVilkårAppID = 'omsorgenForRettApp';

    return (
      <MicroFrontend
        id={omsorgenForVilkårAppID}
        jsSrc="/k9/microfrontend/omsorgsdager/1/app.js"
        stylesheetSrc="/k9/microfrontend/omsorgsdager/1/styles.css"
        onReady={() => initializeOmsorgenForVilkar(omsorgenForVilkårAppID, {...props, FormState})}
      />
    );
};
