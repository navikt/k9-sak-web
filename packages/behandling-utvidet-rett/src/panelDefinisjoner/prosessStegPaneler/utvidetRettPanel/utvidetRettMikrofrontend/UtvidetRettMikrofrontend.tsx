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
    versjon: '1.5.25',
    jsIntegrity: 'sha384-QEtSsaqYq1p4LvBJL7teyK3owigDKoL8YqacOzt8iWEs/luugnTdy1Vs2obZgyHl',
    stylesheetIntegrity: 'sha384-8hP7XTKTOvV+B+ay0KKB/qG6sH0BIzHiYVMNXITSdudshPpPyjcsIsxXdDgYpLns',
  };
  const preprodVersjon = {
    versjon: '1.5.25',
    jsIntegrity: 'sha384-QEtSsaqYq1p4LvBJL7teyK3owigDKoL8YqacOzt8iWEs/luugnTdy1Vs2obZgyHl',
    stylesheetIntegrity: 'sha384-8hP7XTKTOvV+B+ay0KKB/qG6sH0BIzHiYVMNXITSdudshPpPyjcsIsxXdDgYpLns',
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
