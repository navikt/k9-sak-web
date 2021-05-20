import * as React from 'react';
import { MicroFrontend } from '@fpsak-frontend/utils';
import sjekkHvisErIProduksjon from '@fpsak-frontend/utils/src/micro-frontends/sjekkHvisErIProduksjon';
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
    }),
  );
};

const hentVersjonInformasjon = () => {
  const produksjonsVersjon = {
    versjon: '1.5.40',
    jsIntegrity: 'sha384-dcM4G69O4KLmvKOBXwvUV0K0zfTFaJNo27mC8L4VaCTyalpuzO4IKy5KuuLIxQ3U',
    stylesheetIntegrity: 'sha384-LC4FE5IBLroddA6Ew0fDNUxK+oapnpHA8pFrMSZ7Q67tIbZTe8hn8P/ktKJRojwr',
  };
  const preprodVersjon = {
    versjon: '1.5.42',
    jsIntegrity: 'sha384-kEbTBWQyc6dzyhXgAPDf18waJ89qi+knpAUGpSSWrtxTmNRJ88lNDq2VGkKecfTO',
    stylesheetIntegrity: 'sha384-z3CWkmyvqam9PcRhhOUowe+0T/tRb3QTAjg2skXgGVkthjCXvN0/XDxmBwQVzDyz',
  };
  return sjekkHvisErIProduksjon() ? produksjonsVersjon : preprodVersjon;
};

export default props => {
  const omsorgenForVilkårAppID = 'omsorgenForRettApp';
  const { versjon, jsIntegrity, stylesheetIntegrity } = hentVersjonInformasjon();

  return (
    <MicroFrontend
      id={omsorgenForVilkårAppID}
      jsSrc={`/k9/microfrontend/omsorgsdager/${versjon}/app.js`}
      jsIntegrity={jsIntegrity}
      stylesheetSrc={`/k9/microfrontend/omsorgsdager/${versjon}/styles.css`}
      stylesheetIntegrity={stylesheetIntegrity}
      onReady={() => initializeOmsorgenForVilkar(omsorgenForVilkårAppID, { ...props, FormState })}
    />
  );
};
