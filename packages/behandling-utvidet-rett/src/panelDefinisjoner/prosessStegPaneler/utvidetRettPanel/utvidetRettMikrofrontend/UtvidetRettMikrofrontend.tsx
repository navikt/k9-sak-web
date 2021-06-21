import * as React from 'react';
import { MicroFrontend } from '@fpsak-frontend/utils';
import sjekkHvisErIProduksjon from '@fpsak-frontend/utils/src/micro-frontends/sjekkHvisErIProduksjon';
import { FormState } from '@fpsak-frontend/form/index';
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

const hentVersjonInformasjon = () => {
  const produksjonsVersjon = {
    versjon: '2.0.3',
    jsIntegrity: 'sha384-CGmeSJmx0S1O01lIOT2yZ2lcIvwEUPyud8xxVuUomL7CwUh9JcAjkrym8ZerExsX',
    stylesheetIntegrity: 'sha384-3iUtet323prriMT769mdhUmWxrtoD2sTbqMwOZV0tKNwjCvRz+tNgmCtOq2Poocv',
  };
  const preprodVersjon = {
    versjon: '2.0.4',
    jsIntegrity: 'sha384-u2n/v/iDKvxXECxSD8n3Z0QeFfu74zEFzsoNGM3egZ4XRGRj9I0gfOY/E6zgPS68',
    stylesheetIntegrity: 'sha384-zrAzgRd84XQvBESFpgMsjglo0FQbW2KE2+3r0qio1lA6y5G/CHD8JWz938HuirHQ',
  };
  return sjekkHvisErIProduksjon() ? produksjonsVersjon : preprodVersjon;
};

export default props => {
  const utvidetRettVilkårAppID = 'utvidetRettApp';
  const { versjon, jsIntegrity, stylesheetIntegrity } = hentVersjonInformasjon();
  return (
    <MicroFrontend
      id={utvidetRettVilkårAppID}
      jsSrc={`/k9/microfrontend/omsorgsdager/${versjon}/app.js`}
      jsIntegrity={jsIntegrity}
      stylesheetSrc={`/k9/microfrontend/omsorgsdager/${versjon}/styles.css`}
      stylesheetIntegrity={stylesheetIntegrity}
      onReady={() => initializeUtvidetRettVilkar(utvidetRettVilkårAppID, { ...props, FormState })}
    />
  );
};
