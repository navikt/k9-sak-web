import React from 'react';
import sinon from 'sinon';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { IntlProvider } from 'react-intl';

import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import fagsakStatus from '@fpsak-frontend/kodeverk/src/fagsakStatus';
import { BehandlingAppKontekst, Fagsak } from '@k9-sak-web/types';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import kontrollresultatKode from '@fpsak-frontend/sak-risikoklassifisering/src/kodeverk/kontrollresultatKode';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import behandlingResultatType from '@fpsak-frontend/kodeverk/src/behandlingResultatType';

import { requestApi, K9sakApiKeys } from '../data/k9sakApi';
import { FagsakProfileIndex } from './FagsakProfileIndex';

const lagRisikoklassifisering = kode => ({
  kontrollresultat: {
    kode,
    kodeverk: 'Kontrollresultat',
  },
  medlFaresignaler: undefined,
  iayFaresignaler: undefined,
  status: {
    kode: aksjonspunktStatus.UTFORT,
  },
});

jest.mock('react-router-dom', () => ({
  ...(jest.requireActual('react-router-dom') as Record<string, unknown>),
  useRouteMatch: () => ({ isExact: false }),
  useLocation: () => ({
    pathname: 'test',
    search: 'test',
    state: {},
    hash: 'test',
  }),
  useNavigate: () => jest.fn(),
}));

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
            oppfriskBehandlinger={sinon.spy()}
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
            oppfriskBehandlinger={sinon.spy()}
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
