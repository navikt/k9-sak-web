import * as React from 'react';
import { MicroFrontend } from '@fpsak-frontend/utils';
import sjekkHvisErIProduksjon from '@fpsak-frontend/utils/src/micro-frontends/enviromentUtils';
import KartleggePropertyTilOmsorgenForMikrofrontendKomponent from './KartleggePropertyTilOmsorgenForMikrofrontendKomponent';

const initializeOmsorgenForVilkar = (
  elementId,
  { vedtakFattetAksjonspunkt, isReadOnly, aksjonspunkter, vilkar, isAksjonspunktOpen, submitCallback, angitteBarn },
) => {
  (window as any).renderMicrofrontendOmsorgsdagerApp(
    elementId,
    KartleggePropertyTilOmsorgenForMikrofrontendKomponent(
      vedtakFattetAksjonspunkt,
      isReadOnly,
      aksjonspunkter,
      vilkar,
      isAksjonspunktOpen,
      submitCallback,
      angitteBarn,
    ),
  );
};

const hentVersjonInformasjon = () => {
  const produksjonsVersjon = {
    versjon: '1.5.23',
    jsIntegrity: 'sha384-dj63ZcJMh5ahToAx/PxIy/z62/XQeYOhWMyTqH2rEiNcWPtJETcO+1K4YbeYVU9q',
    stylesheetIntegrity: 'sha384-s7NpvoZYFA4hqjZz3fcDywhn8ToSND1O1xwyGj6g2Z0brU/DDoFHAekre+XmKrw+',
  };
  const preprodVersjon = {
    versjon: '1.5.23',
    jsIntegrity: 'sha384-dj63ZcJMh5ahToAx/PxIy/z62/XQeYOhWMyTqH2rEiNcWPtJETcO+1K4YbeYVU9q',
    stylesheetIntegrity: 'sha384-s7NpvoZYFA4hqjZz3fcDywhn8ToSND1O1xwyGj6g2Z0brU/DDoFHAekre+XmKrw+',
  };
  return sjekkHvisErIProduksjon ? produksjonsVersjon : preprodVersjon;
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
      onReady={() => initializeOmsorgenForVilkar(omsorgenForVilkårAppID, props)}
    />
  );
};

