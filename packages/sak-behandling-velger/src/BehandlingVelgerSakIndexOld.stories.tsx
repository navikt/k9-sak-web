import React, { useState } from 'react';

import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import { fagsakStatus } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/FagsakStatus.js';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import relasjonsRolleType from '@fpsak-frontend/kodeverk/src/relasjonsRolleType';
import { behandlingType } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/BehandlingType.js';
import { fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import { BehandlingAppKontekst, Fagsak, Kodeverk } from '@k9-sak-web/types';
import alleKodeverk from '@k9-sak-web/gui/storybook/mocks/alleKodeverk.json';
import BehandlingVelgerSakIndex from './BehandlingVelgerSakIndex';

const behandlinger: BehandlingAppKontekst[] = [
  {
    id: 1,
    uuid: 'dummy-uuid-behandling-1',
    versjon: 2,
    type: behandlingType.FØRSTEGANGSSØKNAD, // BEHANDLING_TYPE_KODEVERK
    status: behandlingStatus.AVSLUTTET, // BEHANDLING_STATUS_KODEVERK
    sprakkode: 'NB', // SPRAAK_KODE
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
      type: 'AVSLÅTT',
    },
  },
  {
    id: 2,
    uuid: 'dummy-uuid-behandling-2',
    versjon: 2,
    type: behandlingType.FØRSTEGANGSSØKNAD, // BEHANDLING_TYPE_KODEVERK
    status: behandlingStatus.OPPRETTET, // BEHANDLING_STATUS_KODEVERK
    sprakkode: 'NB', // SPRAAK_KODE
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
      type: 'INNVILGET',
    },
  },
  {
    id: 3,
    uuid: 'dummy-uuid-behandling-3',
    versjon: 2,
    type: behandlingType.REVURDERING, // BEHANDLING_TYPE_KODEVERK
    status: behandlingStatus.OPPRETTET, // BEHANDLING_STATUS_KODEVERK
    sprakkode: 'NB', // SPRAAK_KODE
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
    type: behandlingType.FØRSTEGANGSSØKNAD, // BEHANDLING_TYPE_KODEVERK
    status: behandlingStatus.AVSLUTTET, // BEHANDLING_STATUS_KODEVERK
    sprakkode: 'NB', // SPRAAK_KODE
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
  sakstype: fagsakYtelsesType.FRISINN, // FAGSAK_YTELSE
  relasjonsRolleType: relasjonsRolleType.MOR, // empty
  status: fagsakStatus.UNDER_BEHANDLING, // FAGSAK_STATUS
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
