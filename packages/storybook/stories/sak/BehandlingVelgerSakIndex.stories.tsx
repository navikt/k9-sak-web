import React, { useState } from 'react';
import { withKnobs, object, number, boolean } from '@storybook/addon-knobs';

import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import BehandlingVelgerSakIndex from '@k9-sak-web/sak-behandling-velger';
import { Behandling, Kodeverk } from '@k9-sak-web/types';

import withReduxAndRouterProvider from '../../decorators/withReduxAndRouter';

import alleKodeverk from '../mocks/alleKodeverk.json';

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
      type: {
        kode: 'AVSLÅTT',
        kodeverk: 'BEHANDLING_RESULTAT_TYPE',
      },
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
      type: {
        kode: 'INNVILGET',
        kodeverk: 'BEHANDLING_RESULTAT_TYPE',
      },
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
      type: {
        kode: 'HENLAGT_SØKNAD_TRUKKET',
        kodeverk: 'BEHANDLING_RESULTAT_TYPE',
      },
    },
  },
];

const locationMock = {
  pathname: 'test',
  search: 'test',
  state: {},
  hash: 'test',
};

const getKodeverkFn = (kodeverk: Kodeverk) => {
  const kodeverkType = kodeverkTyper[kodeverk.kodeverk];
  const kodeverkForType = alleKodeverk[kodeverkType];
  return kodeverkForType.find(k => k.kode === kodeverk.kode);
};

export default {
  title: 'sak/sak-behandling-velger',
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
      />
    </div>
  );
};
