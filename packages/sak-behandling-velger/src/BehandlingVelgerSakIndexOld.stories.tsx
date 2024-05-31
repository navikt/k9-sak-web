import React, { useState } from 'react';

import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import fagsakStatus from '@fpsak-frontend/kodeverk/src/fagsakStatus';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import relasjonsRolleType from '@fpsak-frontend/kodeverk/src/relasjonsRolleType';
import { behandlingType } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/BehandlingType.js';
import { fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import { BehandlingAppKontekst, Fagsak, Kodeverk } from '@k9-sak-web/types';
import alleKodeverk from '@k9-sak-web/gui/storybook/mocks/alleKodeverk.json';
import BehandlingVelgerSakIndex from './BehandlingVelgerSakIndex';

const BEHANDLING_TYPE_KODEVERK = 'BEHANDLING_TYPE';
const BEHANDLING_STATUS_KODEVERK = 'BEHANDLING_STATUS';

const behandlinger: BehandlingAppKontekst[] = [
  {
    id: 1,
    uuid: 'dummy-uuid-behandling-1',
    versjon: 2,
    type: {
      kode: behandlingType.FØRSTEGANGSSØKNAD,
      kodeverk: BEHANDLING_TYPE_KODEVERK,
    },
    status: {
      kode: behandlingStatus.AVSLUTTET,
      kodeverk: BEHANDLING_STATUS_KODEVERK,
    },
    sprakkode: {
      kode: 'NB',
      kodeverk: 'SPRAAK_KODE',
    },
    opprettet: '2017-08-02T00:54:25.455',
    avsluttet: '2017-08-03T00:54:25.455',
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
    uuid: 'dummy-uuid-behandling-2',
    versjon: 2,
    type: {
      kode: behandlingType.FØRSTEGANGSSØKNAD,
      kodeverk: BEHANDLING_TYPE_KODEVERK,
    },
    status: {
      kode: behandlingStatus.OPPRETTET,
      kodeverk: BEHANDLING_STATUS_KODEVERK,
    },
    sprakkode: {
      kode: 'NB',
      kodeverk: 'SPRAAK_KODE',
    },
    opprettet: '2017-08-02T00:54:25.455',
    avsluttet: '2017-08-03T00:54:25.455',
    behandlendeEnhetId: '4812',
    behandlendeEnhetNavn: 'NAV Familie- og pensjonsytelser Bergen',
    links: [],
    gjeldendeVedtak: true,
    behandlingPaaVent: false,
    behandlingHenlagt: false,
    behandlingKoet: false,
    toTrinnsBehandling: false,
    behandlingÅrsaker: [],
    behandlingsresultat: {
      type: {
        kode: 'INNVILGET',
        kodeverk: 'BEHANDLING_RESULTAT_TYPE',
      },
    },
  },
  {
    id: 3,
    uuid: 'dummy-uuid-behandling-3',
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
      kodeverk: 'SPRAAK_KODE',
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
    behandlingÅrsaker: [],
  },
  {
    id: 4,
    uuid: 'dummy-uuid-behandling-4',
    versjon: 2,
    type: {
      kode: behandlingType.FØRSTEGANGSSØKNAD,
      kodeverk: BEHANDLING_TYPE_KODEVERK,
    },
    status: {
      kode: behandlingStatus.AVSLUTTET,
      kodeverk: BEHANDLING_STATUS_KODEVERK,
    },
    sprakkode: {
      kode: 'NB',
      kodeverk: 'SPRAAK_KODE',
    },
    opprettet: '2017-08-02T00:54:25.455',
    avsluttet: '2017-08-03T00:54:25.455',
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
  key: '',
};

const fagsak = {
  saksnummer: '35425245',
  sakstype: {
    kode: fagsakYtelsesType.FRISINN,
    kodeverk: 'FAGSAK_YTELSE',
  },
  relasjonsRolleType: {
    kode: relasjonsRolleType.MOR,
    kodeverk: '',
  },
  status: {
    kode: fagsakStatus.UNDER_BEHANDLING,
    kodeverk: 'FAGSAK_STATUS',
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

/**
 * Dette er den gamle behandlingsvelgeren. Brukes fremdeles for Frisinn og Omsorgspenger
 */

export default {
  title: 'sak/sak-behandling-velger-old',
  component: BehandlingVelgerSakIndex,
};

export const visPanelForValgAvBehandlinger = props => {
  const [visAlle, toggleVisAlle] = useState(false);
  return (
    <div style={{ width: '600px' }}>
      <BehandlingVelgerSakIndex
        behandlinger={behandlinger}
        getBehandlingLocation={() => locationMock}
        noExistingBehandlinger={false}
        behandlingId={1}
        showAll={visAlle}
        toggleShowAll={() => toggleVisAlle(!visAlle)}
        getKodeverkFn={getKodeverkFn}
        fagsak={fagsak}
        createLocationForSkjermlenke={() => locationMock}
        {...props}
      />
    </div>
  );
};

visPanelForValgAvBehandlinger.args = {
  behandlinger,
  noExistingBehandlinger: false,
  behandlingId: 1,
};
