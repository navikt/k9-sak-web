import React from 'react';
import { MemoryRouter } from 'react-router';
import { render, screen } from '@testing-library/react';
import { fagsakStatus } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/FagsakStatus.js';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import { BehandlingAppKontekst } from '@k9-sak-web/types';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import { behandlingType } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/BehandlingType.js';

import * as useTrackRouteParam from '../app/useTrackRouteParam';
import { K9sakApiKeys, requestApi } from '../data/k9sakApi';
import FagsakIndex from './FagsakIndex';

vi.mock('react-router-dom', async () => {
  const actual = (await vi.importActual('react-router-dom')) as Record<string, unknown>;
  return {
    ...actual,
    useLocation: () => ({
      pathname: 'test',
      search: 'test',
      state: {},
      hash: 'test',
    }),
  };
});

describe('<FagsakIndex>', () => {
  const kodeverk = {
    [kodeverkTyper.BEHANDLING_STATUS]: [
      {
        kode: behandlingStatus.OPPRETTET,
        kodeverk: 'BEHANDLING_STATUS',
        navn: 'Opprettet',
      },
    ],
    [kodeverkTyper.BEHANDLING_TYPE]: [
      {
        kode: behandlingType.FØRSTEGANGSSØKNAD,
        kodeverk: 'BEHANDLING_TYPE',
        navn: 'Førstegangsbehandling',
      },
      {
        kode: behandlingType.REVURDERING,
        kodeverk: 'BEHANDLING_TYPE',
        navn: 'Revurdering',
      },
    ],
    [kodeverkTyper.BEHANDLING_RESULTAT_TYPE]: [
      {
        kode: 'INNVILGET',
        navn: 'Innvilget',
        kodeverk: 'BEHANDLING_RESULTAT_TYPE',
      },
      {
        kode: 'AVSLÅTT',
        navn: 'Avslått',
        kodeverk: 'BEHANDLING_RESULTAT_TYPE',
      },
    ],
    [kodeverkTyper.FAGSAK_YTELSE]: [
      {
        kode: fagsakYtelseType.FORELDREPENGER,
        kodeverk: 'FAGSAK_YTELSE',
        navn: 'Foreldrepenger',
      },
      {
        kode: fagsakYtelseType.PLEIEPENGER,
        navn: 'Pleiepenger sykt barn',
        kodeverk: 'FAGSAK_YTELSE',
      },
    ],
    [kodeverkTyper.FAGSAK_STATUS]: [
      {
        kode: fagsakStatus.OPPRETTET,
        kodeverk: 'FAGSAK_STATUS',
        navn: 'Opprettet',
      },
    ],
  };
  const fagsak = {
    saksnummer: 123456,
    status: fagsakStatus.OPPRETTET,
    sakstype: fagsakYtelseType.PLEIEPENGER,
  };

  const behandling: BehandlingAppKontekst = {
    id: 1,
    uuid: '1',
    type: behandlingType.FØRSTEGANGSSØKNAD,
    status: behandlingStatus.AVSLUTTET,
    links: [],
    behandlendeEnhetId: 'test',
    behandlendeEnhetNavn: 'NAV Viken',
    opprettet: '2020-02-01T00:54:25.455',
    versjon: 1,
    behandlingPaaVent: false,
    behandlingHenlagt: false,
    gjeldendeVedtak: true,
    sprakkode: undefined,
    behandlingKoet: undefined,
    toTrinnsBehandling: undefined,
    behandlingÅrsaker: undefined,
  };
  const behandling2: BehandlingAppKontekst = {
    id: 2,
    uuid: '2',
    type: behandlingType.FØRSTEGANGSSØKNAD,
    status: behandlingStatus.AVSLUTTET,
    links: [],
    behandlendeEnhetId: 'test',
    behandlendeEnhetNavn: 'NAV Viken',
    opprettet: '2020-02-01T00:54:25.455',
    versjon: 1,
    behandlingPaaVent: false,
    behandlingHenlagt: false,
    gjeldendeVedtak: true,
    sprakkode: undefined,
    behandlingKoet: undefined,
    toTrinnsBehandling: undefined,
    behandlingÅrsaker: undefined,
  };
  const behandling3: BehandlingAppKontekst = {
    id: 3,
    uuid: '3',
    type: behandlingType.FØRSTEGANGSSØKNAD,
    status: behandlingStatus.AVSLUTTET,
    links: [],
    behandlendeEnhetId: 'test',
    behandlendeEnhetNavn: 'NAV Viken',
    opprettet: '2020-02-01T00:54:25.455',
    versjon: 1,
    behandlingPaaVent: false,
    behandlingHenlagt: false,
    gjeldendeVedtak: true,
    sprakkode: undefined,
    behandlingKoet: undefined,
    toTrinnsBehandling: undefined,
    behandlingÅrsaker: undefined,
  };

  beforeEach(() => {
    vi.spyOn(useTrackRouteParam, 'default').mockImplementation(() => ({
      selected: 123456,
      location: {
        pathname: 'test',
        search: 'test',
        state: {},
        hash: 'test',
        key: 'test',
      },
    }));
  });

  it('skal hente alle behandlinger fra k9sak, tilbake og klage', () => {
    requestApi.mock(K9sakApiKeys.KODEVERK, kodeverk);
    requestApi.mock(K9sakApiKeys.FETCH_FAGSAK, fagsak);
    requestApi.mock(K9sakApiKeys.SAK_BRUKER, {});
    requestApi.mock(K9sakApiKeys.SAK_RETTIGHETER, {
      behandlingTypeKanOpprettes: [],
    });
    requestApi.mock(K9sakApiKeys.SAK_RETTIGHETER_TILBAKE, {
      behandlingTypeKanOpprettes: [],
    });
    requestApi.mock(K9sakApiKeys.SAK_RETTIGHETER_KLAGE, {
      behandlingTypeKanOpprettes: [],
    });
    requestApi.mock(K9sakApiKeys.INIT_FETCH_TILBAKE, {});
    requestApi.mock(K9sakApiKeys.INIT_FETCH_KLAGE, {});
    requestApi.mock(K9sakApiKeys.KODEVERK_TILBAKE, kodeverk);
    requestApi.mock(K9sakApiKeys.KODEVERK_KLAGE, kodeverk);
    requestApi.mock(K9sakApiKeys.BEHANDLINGER_K9SAK, [behandling]);
    requestApi.mock(K9sakApiKeys.BEHANDLINGER_TILBAKE, [behandling2]);
    requestApi.mock(K9sakApiKeys.BEHANDLINGER_KLAGE, [behandling3]);
    requestApi.mock(K9sakApiKeys.HENT_SAKSBEHANDLERE, {});
    requestApi.mock(K9sakApiKeys.FEATURE_TOGGLE, []);
    requestApi.mock(K9sakApiKeys.LOS_HENTE_MERKNAD, []);
    requestApi.mock(K9sakApiKeys.NAV_ANSATT, {});
    requestApi.mock(K9sakApiKeys.RISIKO_AKSJONSPUNKT, {});
    requestApi.mock(K9sakApiKeys.KONTROLLRESULTAT, {});
    requestApi.mock(K9sakApiKeys.BEHANDLENDE_ENHETER, {});

    render(
      <MemoryRouter>
        <FagsakIndex />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole('heading', { name: '1. Førstegangsbehandling (automatisk behandlet)' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: '2. Førstegangsbehandling (automatisk behandlet)' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: '3. Førstegangsbehandling (automatisk behandlet)' }),
    ).toBeInTheDocument();
  });
});
