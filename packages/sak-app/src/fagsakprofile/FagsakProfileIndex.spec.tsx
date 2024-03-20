import { render, screen } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { MemoryRouter } from 'react-router-dom';

import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import behandlingResultatType from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import fagsakStatus from '@fpsak-frontend/kodeverk/src/fagsakStatus';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import kontrollresultatKode from '@fpsak-frontend/sak-risikoklassifisering/src/kodeverk/kontrollresultatKode';
import { BehandlingAppKontekst, Fagsak } from '@k9-sak-web/types';

import { K9sakApiKeys, requestApi } from '../data/k9sakApi';
import { FagsakProfileIndex } from './FagsakProfileIndex';

const lagRisikoklassifisering = kode => ({
  kontrollresultat: kode,
  medlFaresignaler: undefined,
  iayFaresignaler: undefined,
  status: aksjonspunktStatus.UTFORT,
});

vi.mock('react-router-dom', async () => {
  const actual = (await vi.importActual('react-router-dom')) as Record<string, unknown>;
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
    sakstype: fagsakYtelseType.FORELDREPENGER,
    status: fagsakStatus.OPPRETTET,
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
    ],
    [kodeverkTyper.FAGSAK_STATUS]: [
      {
        kode: fagsakStatus.OPPRETTET,
        kodeverk: 'FAGSAK_STATUS',
        navn: 'Opprettet',
      },
    ],
  };

  const behandling = {
    type: behandlingType.FORSTEGANGSSOKNAD,
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

  const forstegang: BehandlingAppKontekst = {
    ...behandling,
    id: 1,
    uuid: 'uuid-1',
    behandlingsresultat: {
      type: behandlingResultatType.AVSLATT,
    },
  };

  const revurdering: BehandlingAppKontekst = {
    ...behandling,
    id: 2,
    type: behandlingType.REVURDERING,
    behandlingsresultat: {
      type: behandlingResultatType.INNVILGET,
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
    requestApi.mock(K9sakApiKeys.RISIKO_AKSJONSPUNKT, lagRisikoklassifisering(kontrollresultatKode.UDEFINERT));
    requestApi.mock(K9sakApiKeys.KONTROLLRESULTAT, {});
    requestApi.mock(K9sakApiKeys.BEHANDLENDE_ENHETER, {});
    requestApi.mock(K9sakApiKeys.NAV_ANSATT, {});
    requestApi.mock(K9sakApiKeys.INIT_FETCH_TILBAKE, {});
    requestApi.mock(K9sakApiKeys.INIT_FETCH_KLAGE, {});
    requestApi.mock(K9sakApiKeys.FEATURE_TOGGLE, [{ key: 'BEHANDLINGSVELGER_NY', value: 'true' }]);
    requestApi.mock(K9sakApiKeys.SAK_BRUKER, {});
    requestApi.mock(K9sakApiKeys.LOS_HENTE_MERKNAD, {});

    render(
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
    requestApi.mock(K9sakApiKeys.RISIKO_AKSJONSPUNKT, lagRisikoklassifisering(kontrollresultatKode.UDEFINERT));
    requestApi.mock(K9sakApiKeys.KONTROLLRESULTAT, {});
    requestApi.mock(K9sakApiKeys.BEHANDLENDE_ENHETER, {});
    requestApi.mock(K9sakApiKeys.NAV_ANSATT, {});
    requestApi.mock(K9sakApiKeys.INIT_FETCH_TILBAKE, {});
    requestApi.mock(K9sakApiKeys.INIT_FETCH_KLAGE, {});
    requestApi.mock(K9sakApiKeys.FEATURE_TOGGLE, [{ key: 'BEHANDLINGSVELGER_NY', value: 'true' }]);
    requestApi.mock(K9sakApiKeys.SAK_BRUKER, {});
    requestApi.mock(K9sakApiKeys.LOS_HENTE_MERKNAD, {});

    render(
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
