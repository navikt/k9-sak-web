import * as React from 'react';
import { MicroFrontend } from '@fpsak-frontend/utils';
import sjekkHvisErIProduksjon from '@fpsak-frontend/utils/src/micro-frontends/sjekkHvisErIProduksjon';
import KartleggePropertyTilOmsorgenForMikrofrontendKomponent from './KartleggePropertyTilOmsorgenForMikrofrontendKomponent';

const initializeOmsorgenForVilkar = (
  elementId,
  { isReadOnly, aksjonspunkter, isAksjonspunktOpen, submitCallback, behandling, status, vilkar, angitteBarn },
) => {
  (window as any).renderMicrofrontendOmsorgsdagerApp(
    elementId,
    KartleggePropertyTilOmsorgenForMikrofrontendKomponent(
      isReadOnly,
      submitCallback,
      behandling,
      angitteBarn,
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
    versjon: '1.5.33',
    jsIntegrity: 'sha384-6w75p2VXMTioGQ9Y2M/aea+FSt3/eL32xO2XIIQqvy4EjQi2iSUMzQP61HKblFyi',
    stylesheetIntegrity: 'sha384-JeMuk/8Y/Cj8/h5Qu/Uh1RpvZQAR1oOkzs3qALRVVF4exKJMFUWxhxMqAyJ6ed/a',
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
