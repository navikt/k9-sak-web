import * as React from 'react';
import { MicroFrontend } from '@fpsak-frontend/utils';

const vilkarMidlertidigAlene = {
  visKomponent: 'VilkarMidlertidigAlene',
  props: {
    type: 'VilkarMidlertidigAlene',
    soknedsopplysninger: {
      årsak: 'Årsak',
      beskrivelse: 'Beskrivelse',
      periode: 'DD.MM.ÅÅÅÅ - DD.MM.ÅÅÅÅ',
    },
    onSubmit: (vilkarOppfylt, dato, begrunnelse) => console.log(vilkarOppfylt, dato, begrunnelse),
  },
};

const initializeUtvidetRettVilkar = elementId => {
  (window as any).renderMicrofrontendOmsorgsdagerApp(elementId, vilkarMidlertidigAlene);
};

const utvidetRettVilkårAppID = 'utvidetRettApp';
export default () => {
  return (
    <MicroFrontend
      id={utvidetRettVilkårAppID}
      jsSrc="/k9/microfrontend/omsorgsdager/build/1.5.17/app.js"
      jsIntegrity="sha256-q2c1bN4ihEZNwTDkLPjaQdUP7nmV22Q0mLj1NGGsmKU="
      stylesheetSrc="/k9/microfrontend/omsorgsdager/build/1.5.17/styles.css"
      stylesheetIntegrity="sha256-8r891aB/ccVgbCZIZJjDXLt+GRlbvzie1nyN/r7bxT8="
      onReady={() => initializeUtvidetRettVilkar(utvidetRettVilkårAppID)}
      onError={() => {}}
    />
  );
};
