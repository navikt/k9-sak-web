import React, { useState } from 'react';
import { action } from '@storybook/addon-actions';
import { withKnobs, object, boolean } from '@storybook/addon-knobs';

import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import fagsakStatus from '@fpsak-frontend/kodeverk/src/fagsakStatus';
import personstatusType from '@fpsak-frontend/kodeverk/src/personstatusType';
import FagsakSokSakIndex from '@fpsak-frontend/sak-sok';

import { Fagsak } from '@k9-sak-web/types';
import withReduxProvider from '../../decorators/withRedux';

import alleKodeverk from '../mocks/alleKodeverk.json';

const fagsaker = [
  {
    saksnummer: '1',
    sakstype: fagsakYtelseType.FORELDREPENGER,
    relasjonsRolleType: '',
    status: fagsakStatus.OPPRETTET,
    barnFodt: '2019-01-01',
    person: {
      navn: 'Espen Utvikler',
      alder: 40,
      personnummer: '123456789',
      erKvinne: false,
      personstatusType: personstatusType.BOSATT,
    },
    opprettet: '2017-08-02T00:54:25.455',
  },
  {
    saksnummer: '2',
    sakstype: fagsakYtelseType.ENGANGSSTONAD,
    status: fagsakStatus.OPPRETTET,
    barnFodt: '2019-01-01',
    person: {
      navn: 'Espen Utvikler',
      alder: 40,
      personnummer: '123456789',
      erKvinne: false,
      personstatusType: personstatusType.BOSATT,
    },
    opprettet: '2017-08-02T00:54:25.455',
  },
];

export default {
  title: 'sak/sak-sok',
  component: FagsakSokSakIndex,
  decorators: [withKnobs, withReduxProvider],
};

export const visMeldingerPanel = () => {
  const [visResultat, toggleResultat] = useState(false);
  return (
    <FagsakSokSakIndex
      fagsaker={visResultat ? object('fagsaker', fagsaker as Fagsak[]) : []}
      searchFagsakCallback={() => toggleResultat(true)}
      searchResultReceived={boolean('searchResultReceived', false)}
      selectFagsakCallback={action('button-click')}
      searchStarted={boolean('searchStarted', false)}
      alleKodeverk={alleKodeverk as any}
    />
  );
};

export const visSøkDerEnIkkeHarAdgang = () => (
  <FagsakSokSakIndex
    fagsaker={[]}
    searchFagsakCallback={action('button-click')}
    searchResultReceived={boolean('searchResultReceived', false)}
    selectFagsakCallback={action('button-click')}
    searchStarted={boolean('searchStarted', false)}
    searchResultAccessDenied={object('searchResultAccessDenied', {
      feilmelding: 'Har ikke adgang',
    })}
    alleKodeverk={alleKodeverk as any}
  />
);
