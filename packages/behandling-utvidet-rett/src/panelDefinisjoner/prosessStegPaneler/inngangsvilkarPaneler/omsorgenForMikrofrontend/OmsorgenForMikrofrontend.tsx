import * as React from 'react';
import { MicroFrontend } from '@fpsak-frontend/utils';
import sjekkHvisErIProduksjon from '@fpsak-frontend/utils/src/micro-frontends/sjekkHvisErIProduksjon';
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
    KartleggePropertyTilOmsorgenForMikrofrontendKomponent(
      isReadOnly,
      submitCallback,
      behandling,
      angitteBarn,
      { aksjonspunkter, isAksjonspunktOpen },
      { vilkar, status },
      fagsaksType,
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
    versjon: '1.5.37',
    jsIntegrity: 'sha384-T9E+13YgCnqQhCnzpOXWPIZLkeY3ZyG4IPFEWnZOXNBJKvMY4hreCxt4H6ALbtCx',
    stylesheetIntegrity: 'sha384-qqVqf1BVSlTidE86KqYBuuUlaYXyhbpN1ir3hOsN2dT/Yj5jygdCrlipblJIFzKd',
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
      onReady={() => initializeOmsorgenForVilkar(omsorgenForVilkårAppID, props)}
    />
  );
};
