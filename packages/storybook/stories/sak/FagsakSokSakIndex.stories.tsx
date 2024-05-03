import { action } from '@storybook/addon-actions';
import { boolean, object, withKnobs } from '@storybook/addon-knobs';
import React, { useState } from 'react';

import fagsakStatus from '@k9-sak-web/kodeverk/src/fagsakStatus';
import fagsakYtelseType from '@k9-sak-web/kodeverk/src/fagsakYtelseType';
import personstatusType from '@k9-sak-web/kodeverk/src/personstatusType';
import FagsakSokSakIndex from '@k9-sak-web/sak-sok';

import { Fagsak } from '@k9-sak-web/types';
import withReduxProvider from '../../decorators/withRedux';

import alleKodeverk from '../mocks/alleKodeverk.json';

const FAGSAK_STATUS_KODEVERK = 'FAGSAK_STATUS';
const FAGSAK_YTELSE_KODEVERK = 'FAGSAK_YTELSE';
const PERSONSTATUS_TYPE_KODEVERK = 'PERSONSTATUS_TYPE';

const fagsaker = [
  {
    saksnummer: '1',
    sakstype: {
      kode: fagsakYtelseType.FORELDREPENGER,
      kodeverk: FAGSAK_YTELSE_KODEVERK,
    },
    relasjonsRolleType: {
      kode: '',
      kodeverk: '',
    },
    status: {
      kode: fagsakStatus.OPPRETTET,
      kodeverk: FAGSAK_STATUS_KODEVERK,
    },
    barnFodt: '2019-01-01',
    person: {
      navn: 'Espen Utvikler',
      alder: 40,
      personnummer: '123456789',
      erKvinne: false,
      personstatusType: {
        kode: personstatusType.BOSATT,
        kodeverk: PERSONSTATUS_TYPE_KODEVERK,
      },
    },
    opprettet: '2017-08-02T00:54:25.455',
  },
  {
    saksnummer: '2',
    sakstype: {
      kode: fagsakYtelseType.ENGANGSSTONAD,
      kodeverk: FAGSAK_YTELSE_KODEVERK,
    },
    status: {
      kode: fagsakStatus.OPPRETTET,
      kodeverk: FAGSAK_STATUS_KODEVERK,
    },
    barnFodt: '2019-01-01',
    person: {
      navn: 'Espen Utvikler',
      alder: 40,
      personnummer: '123456789',
      erKvinne: false,
      personstatusType: {
        kode: personstatusType.BOSATT,
        kodeverk: PERSONSTATUS_TYPE_KODEVERK,
      },
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
