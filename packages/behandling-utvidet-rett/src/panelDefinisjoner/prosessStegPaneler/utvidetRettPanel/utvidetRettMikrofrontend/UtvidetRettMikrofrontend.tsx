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
    versjon: '1.5.40',
    jsIntegrity: 'sha384-dcM4G69O4KLmvKOBXwvUV0K0zfTFaJNo27mC8L4VaCTyalpuzO4IKy5KuuLIxQ3U',
    stylesheetIntegrity: 'sha384-LC4FE5IBLroddA6Ew0fDNUxK+oapnpHA8pFrMSZ7Q67tIbZTe8hn8P/ktKJRojwr',
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
