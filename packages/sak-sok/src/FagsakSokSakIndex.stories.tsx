import { action } from '@storybook/addon-actions';
import React, { useState } from 'react';

import fagsakStatus from '@fpsak-frontend/kodeverk/src/fagsakStatus';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import personstatusType from '@fpsak-frontend/kodeverk/src/personstatusType';
// eslint-disable-next-line import/no-relative-packages
import alleKodeverk from '../../storybook/stories/mocks/alleKodeverk.json';
import FagsakSokSakIndex from './FagsakSokSakIndex';

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
};

export const visMeldingerPanel = props => {
  const [visResultat, toggleResultat] = useState(false);
  return (
    <FagsakSokSakIndex
      fagsaker={visResultat ? fagsaker : []}
      searchFagsakCallback={() => toggleResultat(true)}
      selectFagsakCallback={action('button-click')}
      alleKodeverk={alleKodeverk as any}
      {...props}
    />
  );
};

visMeldingerPanel.args = {
  searchResultReceived: false,
  searchStarted: false,
};

export const visSøkDerEnIkkeHarAdgang = props => (
  <FagsakSokSakIndex
    fagsaker={[]}
    searchFagsakCallback={action('button-click')}
    selectFagsakCallback={action('button-click')}
    alleKodeverk={alleKodeverk as any}
    {...props}
  />
);

visSøkDerEnIkkeHarAdgang.args = {
  searchResultReceived: false,
  searchStarted: false,
  searchResultAccessDenied: {
    feilmelding: 'Har ikke adgang',
  },
};
