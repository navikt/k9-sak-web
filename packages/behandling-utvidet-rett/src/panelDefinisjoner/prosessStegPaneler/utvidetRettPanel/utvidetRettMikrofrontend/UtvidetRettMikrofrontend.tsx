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
    versjon: '1.5.31',
    jsIntegrity: 'sha384-W82OJHtVisUsjDb6TCA8Su4xfKFZm2y5dwErq7VDYqwfOEDHY2SKjg1oEjHZUuv2',
    stylesheetIntegrity: 'sha384-JeMuk/8Y/Cj8/h5Qu/Uh1RpvZQAR1oOkzs3qALRVVF4exKJMFUWxhxMqAyJ6ed/a',
  };
  const preprodVersjon = {
    versjon: '1.5.35',
    jsIntegrity: 'sha384-TdE6YDAxYiUf9MfJNhK37w3zwIryNa7MPOuigM6VrM8MBkZlzfpno/GKR/A2LUMx',
    stylesheetIntegrity: 'sha384-qqVqf1BVSlTidE86KqYBuuUlaYXyhbpN1ir3hOsN2dT/Yj5jygdCrlipblJIFzKd',
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
      onReady={() => initializeUtvidetRettVilkar(utvidetRettVilkårAppID, props)}
    />
  );
};
