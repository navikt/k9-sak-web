import React, { useState } from 'react';
import { withKnobs, object, number, boolean } from '@storybook/addon-knobs';

import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import BehandlingVelgerSakIndex from '@k9-sak-web/sak-behandling-velger';
import { Behandling, Kodeverk, Fagsak } from '@k9-sak-web/types';

import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import relasjonsRolleType from '@fpsak-frontend/kodeverk/src/relasjonsRolleType';
import fagsakStatus from '@fpsak-frontend/kodeverk/src/fagsakStatus';
import alleKodeverk from '../mocks/alleKodeverk.json';
import withReduxAndRouterProvider from '../../decorators/withReduxAndRouter';

const BEHANDLING_TYPE_KODEVERK = 'BEHANDLING_TYPE';
const BEHANDLING_STATUS_KODEVERK = 'BEHANDLING_STATUS';

const behandlinger = [
  {
    id: 1,
    versjon: 2,
    type: {
      kode: behandlingType.FORSTEGANGSSOKNAD,
      kodeverk: BEHANDLING_TYPE_KODEVERK,
    },
    status: {
      kode: behandlingStatus.AVSLUTTET,
      kodeverk: BEHANDLING_STATUS_KODEVERK,
    },
    sprakkode: {
      kode: 'NB',
      kodeverk: '',
    },
    opprettet: '2017-08-02T00:54:25.455',
    avsluttet: '2017-08-03T00:54:25.455',
    endret: '2017-08-03T00:54:25.455',
    behandlendeEnhetId: '4812',
    behandlendeEnhetNavn: 'NAV Familie- og pensjonsytelser Bergen',
    links: [],
    gjeldendeVedtak: false,
    behandlingPaaVent: false,
    behandlingHenlagt: false,
    behandlingKoet: false,
    toTrinnsBehandling: false,
    behandlingÅrsaker: [],
    behandlingsresultat: {
      type: 'AVSLÅTT',
    },
  },
  {
    id: 2,
    versjon: 2,
    type: {
      kode: behandlingType.DOKUMENTINNSYN,
      kodeverk: BEHANDLING_TYPE_KODEVERK,
    },
    status: {
      kode: behandlingStatus.OPPRETTET,
      kodeverk: BEHANDLING_STATUS_KODEVERK,
    },
    sprakkode: {
      kode: 'NB',
      kodeverk: '',
    },
    opprettet: '2017-08-02T00:54:25.455',
    avsluttet: '2017-08-03T00:54:25.455',
    endret: '2017-08-03T00:54:25.455',
    behandlendeEnhetId: '4812',
    behandlendeEnhetNavn: 'NAV Familie- og pensjonsytelser Bergen',
    links: [],
    gjeldendeVedtak: true,
    behandlingPaaVent: false,
    behandlingHenlagt: false,
    behandlingKoet: false,
    toTrinnsBehandling: false,
    behandlingArsaker: [],
    behandlingsresultat: {
      type: 'INNVILGET',
    },
  },
  {
    id: 3,
    versjon: 2,
    type: {
      kode: behandlingType.REVURDERING,
      kodeverk: BEHANDLING_TYPE_KODEVERK,
    },
    status: {
      kode: behandlingStatus.OPPRETTET,
      kodeverk: BEHANDLING_STATUS_KODEVERK,
    },
    sprakkode: {
      kode: 'NB',
      kodeverk: '',
    },
    opprettet: '2017-08-02T00:54:25.455',
    behandlendeEnhetId: '4812',
    behandlendeEnhetNavn: 'NAV Familie- og pensjonsytelser Bergen',
    links: [],
    gjeldendeVedtak: false,
    behandlingPaaVent: false,
    behandlingHenlagt: false,
    behandlingKoet: false,
    toTrinnsBehandling: false,
    behandlingArsaker: [],
  },
  {
    id: 4,
    versjon: 2,
    type: {
      kode: behandlingType.FORSTEGANGSSOKNAD,
      kodeverk: BEHANDLING_TYPE_KODEVERK,
    },
    status: {
      kode: behandlingStatus.AVSLUTTET,
      kodeverk: BEHANDLING_STATUS_KODEVERK,
    },
    sprakkode: {
      kode: 'NB',
      kodeverk: '',
    },
    opprettet: '2017-08-02T00:54:25.455',
    avsluttet: '2017-08-03T00:54:25.455',
    endret: '2017-08-03T00:54:25.455',
    behandlendeEnhetId: '4812',
    behandlendeEnhetNavn: 'NAV Familie- og pensjonsytelser Bergen',
    links: [],
    gjeldendeVedtak: false,
    behandlingPaaVent: false,
    behandlingHenlagt: false,
    behandlingKoet: false,
    toTrinnsBehandling: false,
    behandlingArsaker: [],
    behandlingsresultat: {
      type: 'HENLAGT_SØKNAD_TRUKKET',
    },
  },
];

const locationMock = {
  pathname: 'test',
  search: 'test',
  state: {},
  hash: 'test',
  key: '',
};

const fagsak = {
  saksnummer: '35425245',
  sakstype: {
    kode: fagsakYtelseType.FRISINN,
    kodeverk: '',
  },
  relasjonsRolleType: {
    kode: relasjonsRolleType.MOR,
    kodeverk: '',
  },
  status: {
    kode: fagsakStatus.UNDER_BEHANDLING,
    kodeverk: '',
  },
  barnFodt: '2020-01-01',
  opprettet: '2020-01-01',
  endret: '2020-01-01',
  antallBarn: 1,
  kanRevurderingOpprettes: false,
  skalBehandlesAvInfotrygd: false,
  dekningsgrad: 100,
} as Fagsak;

const getKodeverkFn = (kodeverk: Kodeverk) => {
  const kodeverkType = kodeverkTyper[kodeverk.kodeverk];
  const kodeverkForType = alleKodeverk[kodeverkType];
  return kodeverkForType.find(k => k.kode === kodeverk.kode);
};

export default {
  title: 'sak/sak-behandling-velger-old',
  component: BehandlingVelgerSakIndex,
  decorators: [withKnobs, withReduxAndRouterProvider],
};

export const visPanelForValgAvBehandlinger = () => {
  const [visAlle, toggleVisAlle] = useState(false);
  return (
    <div style={{ width: '600px' }}>
      <BehandlingVelgerSakIndex
        behandlinger={object('behandlinger', behandlinger as Behandling[])}
        getBehandlingLocation={() => locationMock}
        noExistingBehandlinger={boolean('noExistingBehandlinger', false)}
        behandlingId={number('behandlingId', 1)}
        showAll={visAlle}
        toggleShowAll={() => toggleVisAlle(!visAlle)}
        getKodeverkFn={getKodeverkFn}
        fagsak={fagsak}
        createLocationForSkjermlenke={() => locationMock}
      />
    </div>
  );
};
