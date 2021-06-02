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
    versjon: '2.0.0',
    jsIntegrity: 'sha384-ReIyiqOV9PXxKcq4qrZfXUR6Vo+91Sq91HVN4vgennfoUX9YmP+5fzMl04ARgLZt',
    stylesheetIntegrity: 'sha384-uHiStnPr4IBhdFpEf302JpS6rkdApNMTNFEeSrdvH6pO6SECF9ftxSm37xftCF7O',
  };
  const preprodVersjon = {
    versjon: '2.0.1',
    jsIntegrity: 'sha384-al0pSgn+Pi1A7hMFOo6m1MJtxtvX1DFfwnx9roazqYQ+x4aA77UiNaCvupwM34wC',
    stylesheetIntegrity: 'sha384-uHiStnPr4IBhdFpEf302JpS6rkdApNMTNFEeSrdvH6pO6SECF9ftxSm37xftCF7O',
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
