import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';

import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import fagsakStatus from '@fpsak-frontend/kodeverk/src/fagsakStatus';
import { fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import { BehandlingAppKontekst, Fagsak } from '@k9-sak-web/types';

import { VergeBehandlingmenyValg } from '@k9-sak-web/sak-app/src/behandling/behandlingRettigheterTsType';
import { UngSakApiKeys, requestApi } from '../data/ungsakApi';
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
  sakstype: fagsakYtelsesType.FORELDREPENGER, // BEHANDLING_TYPE
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

vi.mock('react-router', async () => {
  const actual = (await vi.importActual('react-router')) as Record<string, unknown>;
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
          // @ts-expect-error: Skal endres til behandlingPåVent når det er gjort i ung-sak
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
    expect(screen.queryByText('Sett behandlingen på vent')).not.toBeInTheDocument();
    expect(screen.queryByText('Henlegg behandlingen og avslutt')).not.toBeInTheDocument();
    expect(screen.queryByText('Endre behandlende enhet')).not.toBeInTheDocument();
    // expect(screen.queryByText('Marker behandling')).not.toBeVisible();
    expect(screen.queryByText('Opprett ny behandling')).not.toBeInTheDocument();
    expect(screen.queryByText('Opprett verge/fullmektig')).not.toBeInTheDocument();

    /**
     * Åpne behandlingsmenyen
     */
    await act(async () => {
      await userEvent.click(knapp);
    });

    expect(screen.queryByText('Fortsett behandlingen')).toBeNull();
    expect(screen.getByRole('menuitem', { name: 'Sett behandlingen på vent' })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Henlegg behandlingen og avslutt' })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Endre behandlende enhet' })).toBeInTheDocument();
    // expect(screen.queryByRole('button', { name: 'Marker behandling' })).toBeVisible();
    expect(screen.getByRole('menuitem', { name: 'Opprett ny behandling' })).toBeInTheDocument();
  });
});
