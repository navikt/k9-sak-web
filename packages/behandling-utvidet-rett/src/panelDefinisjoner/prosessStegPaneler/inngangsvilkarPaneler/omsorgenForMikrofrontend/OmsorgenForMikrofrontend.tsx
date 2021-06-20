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
    versjon: '2.0.3',
    jsIntegrity: 'sha384-CGmeSJmx0S1O01lIOT2yZ2lcIvwEUPyud8xxVuUomL7CwUh9JcAjkrym8ZerExsX',
    stylesheetIntegrity: 'sha384-3iUtet323prriMT769mdhUmWxrtoD2sTbqMwOZV0tKNwjCvRz+tNgmCtOq2Poocv',
  };
  const preprodVersjon = {
    versjon: '2.0.3',
    jsIntegrity: 'sha384-CGmeSJmx0S1O01lIOT2yZ2lcIvwEUPyud8xxVuUomL7CwUh9JcAjkrym8ZerExsX',
    stylesheetIntegrity: 'sha384-3iUtet323prriMT769mdhUmWxrtoD2sTbqMwOZV0tKNwjCvRz+tNgmCtOq2Poocv',
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
