import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import fagsakStatus from '@fpsak-frontend/kodeverk/src/fagsakStatus';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import { renderWithIntlAndReactQueryClient } from '@fpsak-frontend/utils-test/test-utils';
import { screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { vi } from 'vitest';
import type useTrackRouteParam from '../app/useTrackRouteParam.js';
import { UngSakApiKeys, requestApi } from '../data/ungsakApi';
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

vi.mock('../app/useTrackRouteParam', (): { default: typeof useTrackRouteParam<number> } => ({
  default: () => ({
    selected: 123456,
    location: {
      pathname: 'test',
      search: 'test',
      state: {},
      hash: 'test',
      key: 'test',
    },
  }),
}));

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
        kode: behandlingType.FORSTEGANGSSOKNAD,
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
    status: {
      kode: fagsakStatus.OPPRETTET,
      kodeverk: 'FAGSAK_STATUS',
    },
    sakstype: {
      kode: fagsakYtelseType.PLEIEPENGER,
      kodeverk: 'FAGSAK_YTELSE',
    },
  };

  const behandling = {
    id: 1,
    type: {
      kode: behandlingType.FORSTEGANGSSOKNAD,
      kodeverk: 'BEHANDLING_TYPE',
    },
    status: {
      kode: behandlingStatus.AVSLUTTET,
      kodeverk: 'BEHANDLING_STATUS',
    },
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

  it('skal hente alle behandlinger fra ungsak, tilbake og klage', () => {
    requestApi.mock(UngSakApiKeys.KODEVERK, kodeverk);
    requestApi.mock(UngSakApiKeys.FETCH_FAGSAK, fagsak);
    requestApi.mock(UngSakApiKeys.SAK_BRUKER, {});
    requestApi.mock(UngSakApiKeys.SAK_RETTIGHETER, {
      behandlingTypeKanOpprettes: [],
    });
    requestApi.mock(UngSakApiKeys.BEHANDLINGER_UNGSAK, [behandling]);
    requestApi.mock(UngSakApiKeys.HENT_SAKSBEHANDLERE, {});
    requestApi.mock(UngSakApiKeys.FEATURE_TOGGLE, []);
    requestApi.mock(UngSakApiKeys.LOS_HENTE_MERKNAD, []);
    requestApi.mock(UngSakApiKeys.NAV_ANSATT, {});
    requestApi.mock(UngSakApiKeys.KONTROLLRESULTAT, {});
    requestApi.mock(UngSakApiKeys.BEHANDLENDE_ENHETER, {});

    renderWithIntlAndReactQueryClient(
      <MemoryRouter>
        <FagsakIndex />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole('heading', { name: '1. Førstegangsbehandling (automatisk behandlet)' }),
    ).toBeInTheDocument();
  });
});
