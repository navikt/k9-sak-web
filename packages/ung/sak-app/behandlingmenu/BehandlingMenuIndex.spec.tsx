import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import fagsakStatus from '@fpsak-frontend/kodeverk/src/fagsakStatus';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import { BehandlingAppKontekst, Fagsak } from '@k9-sak-web/types';

import { VergeBehandlingmenyValg } from '@k9-sak-web/sak-app/src/behandling/behandlingRettigheterTsType';
import { requestApi, UngSakApiKeys } from '../data/ungsakApi';
import { BehandlingMenuIndex } from './BehandlingMenuIndex';

const navAnsatt = {
  brukernavn: 'Test',
  kanBehandleKode6: false,
  kanBehandleKode7: false,
  kanBehandleKodeEgenAnsatt: false,
  kanBeslutte: true,
  kanOverstyre: false,
  kanSaksbehandle: true,
  kanVeilede: false,
  navn: 'Test',
};

const fagsak = {
  saksnummer: '123',
  sakstype: {
    kode: fagsakYtelseType.FORELDREPENGER,
    kodeverk: 'BEHANDLING_TYPE',
  },
  status: {
    kode: fagsakStatus.UNDER_BEHANDLING,
    kodeverk: '',
  },
  skalBehandlesAvInfotrygd: false,
};

const alleBehandlinger = [
  {
    id: 1,
    versjon: 2,
    uuid: '423223',
    behandlingKoet: false,
    behandlingPaaVent: false,
    kanHenleggeBehandling: true,
    type: {
      kode: behandlingType.REVURDERING,
      kodeverk: 'BEHANDLING_TYPE',
    },
    status: {
      kode: behandlingStatus.BEHANDLING_UTREDES,
      kodeverk: 'BEHANDLING_STATUS',
    },
    behandlendeEnhetId: '2323',
    behandlendeEnhetNavn: 'NAV Viken',
  },
];

vi.mock('react-router-dom', async () => {
  const actual = (await vi.importActual('react-router-dom')) as Record<string, unknown>;
  return {
    ...actual,
    useHistory: () => ({
      push: vi.fn(),
    }),
    useLocation: () => ({
      pathname: 'test',
      search: 'test',
      state: {},
      hash: 'test',
    }),
  };
});

describe('BehandlingMenuIndex', () => {
  it('skal vise meny der alle menyhandlinger er synlige', async () => {
    requestApi.mock(UngSakApiKeys.INIT_FETCH_TILBAKE, {});
    requestApi.mock(UngSakApiKeys.INIT_FETCH_KLAGE, {});
    requestApi.mock(UngSakApiKeys.NAV_ANSATT, navAnsatt);
    requestApi.mock(UngSakApiKeys.BEHANDLENDE_ENHETER, []);
    requestApi.mock(UngSakApiKeys.FEATURE_TOGGLE, []);
    requestApi.mock(UngSakApiKeys.SAK_BRUKER, []);
    requestApi.mock(UngSakApiKeys.KODEVERK, {});
    requestApi.mock(UngSakApiKeys.KODEVERK_TILBAKE, {});
    requestApi.mock(UngSakApiKeys.KODEVERK_KLAGE, {});
    requestApi.mock(UngSakApiKeys.KAN_TILBAKEKREVING_OPPRETTES, false);
    requestApi.mock(UngSakApiKeys.KAN_TILBAKEKREVING_REVURDERING_OPPRETTES, false);
    requestApi.mock(UngSakApiKeys.LOS_HENTE_MERKNAD, false);

    const sakRettigheter = {
      sakSkalTilInfotrygd: false,
      behandlingTypeKanOpprettes: [],
    };

    const behandlingRettigheter = {
      behandlingFraBeslutter: false,
      behandlingKanSendeMelding: true,
      behandlingTilGodkjenning: false,
      behandlingKanBytteEnhet: true,
      behandlingKanHenlegges: true,
      behandlingKanGjenopptas: false,
      behandlingKanOpnesForEndringer: true,
      behandlingKanSettesPaVent: true,
      vergeBehandlingsmeny: VergeBehandlingmenyValg.OPPRETT,
    };

    render(
      <MemoryRouter>
        <BehandlingMenuIndex
          fagsak={fagsak as Fagsak}
          alleBehandlinger={alleBehandlinger as BehandlingAppKontekst[]}
          behandlingId={1}
          behandlingVersjon={2}
          oppfriskBehandlinger={vi.fn()}
          behandlingRettigheter={behandlingRettigheter}
          sakRettigheter={sakRettigheter}
          behandlendeEnheter={[
            {
              enhetId: 'TEST',
              enhetNavn: 'TEST',
            },
          ]}
        />
      </MemoryRouter>,
    );

    const knapp = await screen.findByRole('button', { name: 'Behandlingsmeny' });
    expect(await knapp).not.toBeNull();

    expect(screen.queryByText('Fortsett behandlingen')).toBeNull();
    expect(screen.queryByText('Sett behandlingen på vent')).not.toBeVisible();
    expect(screen.queryByText('Henlegg behandlingen og avslutt')).not.toBeVisible();
    expect(screen.queryByText('Endre behandlende enhet')).not.toBeVisible();
    // expect(screen.queryByText('Marker behandling')).not.toBeVisible();
    expect(screen.queryByText('Opprett ny behandling')).not.toBeVisible();
    expect(screen.queryByText('Opprett verge/fullmektig')).not.toBeVisible();

    /**
     * Åpne behandlingsmenyen
     */
    await act(async () => {
      await userEvent.click(knapp);
    });

    expect(screen.queryByText('Fortsett behandlingen')).toBeNull();
    expect(screen.queryByRole('button', { name: 'Sett behandlingen på vent' })).toBeVisible();
    expect(screen.queryByRole('button', { name: 'Henlegg behandlingen og avslutt' })).toBeVisible();
    expect(screen.queryByRole('button', { name: 'Endre behandlende enhet' })).toBeVisible();
    // expect(screen.queryByRole('button', { name: 'Marker behandling' })).toBeVisible();
    expect(screen.queryByRole('button', { name: 'Opprett ny behandling' })).toBeVisible();
    expect(screen.queryByRole('button', { name: 'Opprett verge/fullmektig' })).toBeVisible();
  });
});
