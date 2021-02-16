import * as React from 'react';
import { MicroFrontend } from '@fpsak-frontend/utils';

const inputMocks = {
  korrigerePerioder: {
    visKomponent: 'KorrigerePerioder',
    props: {
      lesemodus: true,
    },
  },
  vilkarKroniskSyktBarn: {
    visKomponent: 'VilkarKroniskSyktBarn',
    props: {
      behandlingsid: '123',
      stiTilEndepunkt: 'api',
      lesemodus: false,
    },
  },
  vilkarMidlertidigAlene: {
    visKomponent: 'VilkarMidlertidigAlene',
    props: {
      behandlingsid: '123',
      lesemodus: false,
      stiTilEndepunkt: 'api',
    },
  },
  omsorg: {
    visKomponent: 'Omsorg',
    props: {
      behandlingsid: '123',
      stiTilEndepunkt: 'api',
      prosesstype: 'KRONISK_SYKT_BARN',
      lesemodus: true,
    },
  },
};

const initializeUtvidetRettVilkar = elementId => {
  (window as any).renderMicrofrontendOmsorgsdagerApp(elementId, inputMocks.omsorg);
};

const utvidetRettVilkårAppID = 'utvidetRettApp';
export default () => (
  <MicroFrontend
    id={utvidetRettVilkårAppID}
    jsSrc="/k9/microfrontend/omsorgsdager/build/1.5.18/app.js"
    jsIntegrity="sha256-rvCWrVf5VEd57gTtLU9W1aq2992uaV13T7RpqPX8OGc="
    stylesheetSrc="/k9/microfrontend/omsorgsdager/build/1.5.18/styles.css"
    stylesheetIntegrity="sha256-RvxKdi8YliiFVLTcTtGV1rFgIQfRvI8bnq7XIuB2YLo="
    onReady={() => initializeUtvidetRettVilkar(utvidetRettVilkårAppID)}
    onError={() => {}}
  />
);
