import * as React from 'react';
import { MicroFrontend } from '@fpsak-frontend/utils';
import FagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import { Aksjonspunkt, Fagsak } from '@k9-sak-web/types';

// TODO Enum for omsorg och sjekk på ytelsetype for omsorgprocesstype og callback funktion
const kartleggePropertyTilMikrofrontendKomponent = (
  fagsak: Fagsak,
  isReadOnly: boolean,
  aksjonspunkter: Aksjonspunkt[],
  submitCallback,
) => {
  let objektTilMikrofrontend = {};
  switch (aksjonspunkter[0].definisjon.kode) {
    case '9002':
      objektTilMikrofrontend = {
        visKomponent: 'Omsorg',
        props: {
          behandlingsid: '123',
          stiTilEndepunkt: 'api',
          prosesstype: 'KRONISK_SYKT_BARN',
          lesemodus: isReadOnly,
        },
        onSubmit: submitCallback,
      };
      break;

    case '9013': {
      if (fagsak.sakstype.kode === FagsakYtelseType.OMSORGSPENGER_KRONISK_SYKT_BARN) {
        objektTilMikrofrontend = {
          visKomponent: 'VilkarKroniskSyktBarn',
          props: {
            behandlingsid: '123',
            stiTilEndepunkt: 'api',
            lesemodus: false,
          },
          onSubmit: submitCallback,
        };
      }
      if (fagsak.sakstype.kode === FagsakYtelseType.OMSORGSPENGER_MIDLERTIDIG_ALENE) {
        objektTilMikrofrontend = {
          visKomponent: 'VilkarMidlertidigAlene',
          props: {
            behandlingsid: '123',
            lesemodus: isReadOnly,
            stiTilEndepunkt: 'api',
          },
          onSubmit: submitCallback,
        };
      }
      break;
    }
    default:
      break;
  }

  return objektTilMikrofrontend;
};

const initializeUtvidetRettVilkar = (elementId, { isReadOnly, fagsak, aksjonspunkter, submitCallback }) => {
  (window as any).renderMicrofrontendOmsorgsdagerApp(
    elementId,
    kartleggePropertyTilMikrofrontendKomponent(fagsak, isReadOnly, aksjonspunkter, submitCallback),
  );
};

const utvidetRettVilkårAppID = 'utvidetRettApp';
export default props => (
  <MicroFrontend
    id={utvidetRettVilkårAppID}
    jsSrc="/k9/microfrontend/omsorgsdager/build/1.5.18/app.js"
    jsIntegrity="sha256-rvCWrVf5VEd57gTtLU9W1aq2992uaV13T7RpqPX8OGc="
    stylesheetSrc="/k9/microfrontend/omsorgsdager/build/1.5.18/styles.css"
    stylesheetIntegrity="sha256-RvxKdi8YliiFVLTcTtGV1rFgIQfRvI8bnq7XIuB2YLo="
    onReady={() => initializeUtvidetRettVilkar(utvidetRettVilkårAppID, props)}
    onError={() => {}}
  />
);
