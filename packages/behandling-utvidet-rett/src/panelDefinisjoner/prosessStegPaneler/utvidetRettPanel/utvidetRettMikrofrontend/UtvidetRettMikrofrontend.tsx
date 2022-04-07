import React from 'react';
import { MicroFrontend } from '@fpsak-frontend/utils';
import { FormState } from '@fpsak-frontend/form/index';
import sjekkHvisErIProduksjon from "@fpsak-frontend/utils/src/micro-frontends/sjekkHvisErIProduksjon";
import KartleggePropertyTilUtvidetRettMikrofrontendKomponent from './KartleggePropertyTilUtvidetRettMikrofrontendKomponent';

const initializeUtvidetRettVilkar = (
  elementId,
  { saksInformasjon, isReadOnly, aksjonspunkter, submitCallback, isAksjonspunktOpen, behandling, status, vilkar },
) => {
  (window as any).renderMicrofrontendOmsorgsdagerApp(
    elementId,
    KartleggePropertyTilUtvidetRettMikrofrontendKomponent(
      saksInformasjon,
      isReadOnly,
      submitCallback,
      behandling,
      { aksjonspunkter, isAksjonspunktOpen },
      { vilkar, status },
    ),
  );
};

export default props => {
  const utvidetRettVilkårAppID = 'utvidetRettApp';
  const erIProduksjon = sjekkHvisErIProduksjon();
  const path = erIProduksjon ? 'prod' : '1';

  return (
    <MicroFrontend
      id={utvidetRettVilkårAppID}
      jsSrc={`/k9/microfrontend/omsorgsdager/${path}/app.js`}
      stylesheetSrc={`/k9/microfrontend/omsorgsdager/${path}/styles.css`}
      onReady={() => initializeUtvidetRettVilkar(utvidetRettVilkårAppID, { ...props, FormState })}
    />
  );
};
