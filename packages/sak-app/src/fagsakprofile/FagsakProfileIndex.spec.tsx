import { screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import { MemoryRouter } from 'react-router';

import behandlingResultatType from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import fagsakStatus from '@fpsak-frontend/kodeverk/src/fagsakStatus';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import { BehandlingAppKontekst, Fagsak } from '@k9-sak-web/types';

import { renderWithIntlAndReactQueryClient } from '@fpsak-frontend/utils-test/test-utils';
import { behandlingType } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/BehandlingType.js';
import { K9sakApiKeys, requestApi } from '../data/k9sakApi';
import { FagsakProfileIndex } from './FagsakProfileIndex';

vi.mock('react-router', async () => {
  const actual = (await vi.importActual('react-router')) as Record<string, unknown>;
  return {
    ...actual,
    useRouteMatch: () => ({ isExact: false }),
    useLocation: () => ({
      pathname: 'test',
      search: 'test',
      state: {},
      hash: 'test',
    }),
    useNavigate: () => vi.fn(),
  };
});

describe('<FagsakProfileIndex>', () => {
  const fagsak = {
    saksnummer: '123',
    sakstype: {
      kode: fagsakYtelseType.FORELDREPENGER,
      kodeverk: 'FAGSAK_YTELSE',
    },
    status: {
      kode: fagsakStatus.OPPRETTET,
      kodeverk: 'FAGSAK_STATUS',
    },
  };

  const alleKodeverk = {
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
    ],
    [kodeverkTyper.FAGSAK_STATUS]: [
      {
        kode: fagsakStatus.OPPRETTET,
        kodeverk: 'FAGSAK_STATUS',
        navn: 'Opprettet',
      },
    ],
  };

  const behandling: BehandlingAppKontekst = {
    id: 1,
    uuid: 'uuid-1',
    type: {
      kode: behandlingType.FØRSTEGANGSSØKNAD,
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

  const forstegang: BehandlingAppKontekst = {
    ...behandling,
    id: 1,
    uuid: 'uuid-1',
    behandlingsresultat: {
      type: {
        kode: behandlingResultatType.AVSLATT,
        kodeverk: 'BEHANDLING_RESULTAT_TYPE',
      },
    },
  };

  const revurdering: BehandlingAppKontekst = {
    ...behandling,
    id: 2,
    type: {
      kode: behandlingType.REVURDERING,
      kodeverk: 'BEHANDLING_TYPE',
    },
    behandlingsresultat: {
      type: {
        kode: behandlingResultatType.INNVILGET,
        kodeverk: 'BEHANDLING_RESULTAT_TYPE',
      },
    },
    uuid: 'uuid-2',
    opprettet: '2021-02-01T00:54:25.455',
  };

  const fagsakRettigheter = {
    sakSkalTilInfotrygd: true,
    behandlingTypeKanOpprettes: [],
  };

  it('skal rendre komponent og vise alle behandlinger når ingen behandling er valgt', async () => {
    requestApi.mock(K9sakApiKeys.KODEVERK, alleKodeverk);
    requestApi.mock(K9sakApiKeys.KODEVERK_TILBAKE, {});
    requestApi.mock(K9sakApiKeys.KODEVERK_KLAGE, {});
    requestApi.mock(K9sakApiKeys.KONTROLLRESULTAT, {});
    requestApi.mock(K9sakApiKeys.BEHANDLENDE_ENHETER, {});
    requestApi.mock(K9sakApiKeys.NAV_ANSATT, {});
    requestApi.mock(K9sakApiKeys.INIT_FETCH_TILBAKE, {});
    requestApi.mock(K9sakApiKeys.INIT_FETCH_KLAGE, {});
    requestApi.mock(K9sakApiKeys.SAK_BRUKER, {});
    requestApi.mock(K9sakApiKeys.LOS_HENTE_MERKNAD, {});

    renderWithIntlAndReactQueryClient(
      <MemoryRouter>
        <IntlProvider locale="nb-NO">
          <FagsakProfileIndex
            fagsak={fagsak as Fagsak}
            alleBehandlinger={[forstegang, revurdering] as BehandlingAppKontekst[]}
            harHentetBehandlinger
            oppfriskBehandlinger={vi.fn()}
            fagsakRettigheter={fagsakRettigheter}
          />
        </IntlProvider>
      </MemoryRouter>,
    );

    expect(await screen.findByRole('button', { name: 'Behandlingsmeny' })).toBeInTheDocument();
    expect(screen.queryAllByTestId('BehandlingPickerItem').length).toBe(2);
    expect(screen.getByTestId('BehandlingPicker')).toBeInTheDocument();
    expect(screen.getByText('123 - Opprettet')).toBeInTheDocument();
    expect(screen.getByText('1. Førstegangsbehandling')).toBeInTheDocument();
    expect(screen.getByText('2. Viderebehandling')).toBeInTheDocument();
  });

  it('skal ikke vise alle behandlinger når behandling er valgt', async () => {
    requestApi.mock(K9sakApiKeys.KODEVERK, alleKodeverk);
    requestApi.mock(K9sakApiKeys.KODEVERK_TILBAKE, {});
    requestApi.mock(K9sakApiKeys.KODEVERK_KLAGE, {});
    requestApi.mock(K9sakApiKeys.KONTROLLRESULTAT, {});
    requestApi.mock(K9sakApiKeys.BEHANDLENDE_ENHETER, {});
    requestApi.mock(K9sakApiKeys.NAV_ANSATT, {});
    requestApi.mock(K9sakApiKeys.INIT_FETCH_TILBAKE, {});
    requestApi.mock(K9sakApiKeys.INIT_FETCH_KLAGE, {});
    requestApi.mock(K9sakApiKeys.SAK_BRUKER, {});
    requestApi.mock(K9sakApiKeys.LOS_HENTE_MERKNAD, {});

    renderWithIntlAndReactQueryClient(
      <MemoryRouter>
        <IntlProvider locale="nb-NO">
          <FagsakProfileIndex
            fagsak={fagsak as Fagsak}
            alleBehandlinger={[forstegang, revurdering] as BehandlingAppKontekst[]}
            harHentetBehandlinger
            oppfriskBehandlinger={vi.fn()}
            behandlingId={1}
            fagsakRettigheter={fagsakRettigheter}
          />
        </IntlProvider>
      </MemoryRouter>,
    );

    expect(await screen.findByRole('button', { name: 'Behandlingsmeny' })).toBeInTheDocument();
    expect(screen.queryAllByTestId('behandlingSelected').length).toBe(1);
    expect(await screen.findByText('123 - Opprettet')).toBeInTheDocument();
    expect(screen.queryByText('Førstegangsbehandling')).toBeInTheDocument();
  });
});
