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
    versjon: '1.5.37',
    jsIntegrity: 'sha384-T9E+13YgCnqQhCnzpOXWPIZLkeY3ZyG4IPFEWnZOXNBJKvMY4hreCxt4H6ALbtCx',
    stylesheetIntegrity: 'sha384-qqVqf1BVSlTidE86KqYBuuUlaYXyhbpN1ir3hOsN2dT/Yj5jygdCrlipblJIFzKd',
  };
  const preprodVersjon = {
    versjon: '1.5.39',
    jsIntegrity: 'sha384-f/xfINbIZNTeWEY7QCr1ns9MaKy18oF7bqDpGDhK7U/59hwPJ7co8hUDqOHxL3GG',
    stylesheetIntegrity: 'sha384-LC4FE5IBLroddA6Ew0fDNUxK+oapnpHA8pFrMSZ7Q67tIbZTe8hn8P/ktKJRojwr',
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
