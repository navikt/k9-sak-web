import * as React from 'react';
import { MicroFrontend } from '@fpsak-frontend/utils';
import sjekkHvisErIProduksjon from '@fpsak-frontend/utils/src/micro-frontends/sjekkHvisErIProduksjon';
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
    versjon: '1.5.28',
    jsIntegrity: 'sha384-hHFYOcum1J9U/5dNOouYiTlcPhv4bF/SBVvlyri9YHsSWNFD2HrK9NxUkqUPjorm',
    stylesheetIntegrity: 'sha384-nOive4WXPnmw2xQVp8/QTvtAK7TXATPusVCVtVCJa9SYQmBDdn/7WmwEHJJCJWSF',
  };
  const preprodVersjon = {
    versjon: '1.5.28',
    jsIntegrity: 'sha384-hHFYOcum1J9U/5dNOouYiTlcPhv4bF/SBVvlyri9YHsSWNFD2HrK9NxUkqUPjorm',
    stylesheetIntegrity: 'sha384-nOive4WXPnmw2xQVp8/QTvtAK7TXATPusVCVtVCJa9SYQmBDdn/7WmwEHJJCJWSF',
  };
  return sjekkHvisErIProduksjon ? produksjonsVersjon : preprodVersjon;
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
      onReady={() => initializeUtvidetRettVilkar(utvidetRettVilkårAppID, props)}
    />
  );
};
