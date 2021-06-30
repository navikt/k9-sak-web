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
    versjon: '2.0.6',
    jsIntegrity: 'sha384-/hMQ3cBTBSD1W8UFKndpCYgu+VSlhaqMkGqjXJ+QNKMqNtY0r+TCHl2T2/4ezGMs',
    stylesheetIntegrity: 'sha384-zrAzgRd84XQvBESFpgMsjglo0FQbW2KE2+3r0qio1lA6y5G/CHD8JWz938HuirHQ',
  };
  const preprodVersjon = {
    versjon: '2.0.8',
    jsIntegrity: 'sha384-O13ewZExZDDOsJ1U4zYyIN4c0u8bVjhQO4S1RVFIPp6QQUtvjtfrI6cCkH31fLc/',
    stylesheetIntegrity: 'sha384-LhX+SFf72IcEUijL6Yzb8yPmzX2f1ES1ePAp13IiFMktOTbDWPXsiorPXeS4/xhI',
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
