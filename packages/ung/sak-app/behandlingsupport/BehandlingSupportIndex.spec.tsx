import { screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import { BehandlingAppKontekst, Fagsak } from '@k9-sak-web/types';

import { renderWithIntlAndReactQueryClient } from '@fpsak-frontend/utils-test/test-utils';
import { VergeBehandlingmenyValg } from '@k9-sak-web/sak-app/src/behandling/behandlingRettigheterTsType';
import { UngSakApiKeys, requestApi } from '../data/ungsakApi';
import BehandlingSupportIndex, { hentSynligePaneler, hentValgbarePaneler } from './BehandlingSupportIndex';

describe('<BehandlingSupportIndex>', () => {
  const fagsak = {
    saksnummer: '123',
  };

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

  const behandling = {
    id: 1,
    type: {
      kode: behandlingType.FORSTEGANGSSOKNAD,
      kodeverk: '',
    },
    status: {
      kode: behandlingStatus.OPPRETTET,
      kodeverk: '',
    },
  };

  it('skal vise godkjennings-panelet', () => {
    requestApi.mock(UngSakApiKeys.NAV_ANSATT, navAnsatt);
    requestApi.mock(UngSakApiKeys.INIT_FETCH_TILBAKE, {});
    requestApi.mock(UngSakApiKeys.INIT_FETCH_KLAGE, {});
    requestApi.mock(UngSakApiKeys.KODEVERK, {});
    requestApi.mock(UngSakApiKeys.KODEVERK_TILBAKE, {});
    requestApi.mock(UngSakApiKeys.KODEVERK_KLAGE, {});
    requestApi.mock(UngSakApiKeys.HISTORY_UNGSAK, []);
    requestApi.mock(UngSakApiKeys.HISTORY_TILBAKE, []);
    requestApi.mock(UngSakApiKeys.HISTORY_KLAGE, []);

    renderWithIntlAndReactQueryClient(
      <MemoryRouter>
        <BehandlingSupportIndex
          fagsak={fagsak as Fagsak}
          alleBehandlinger={[behandling] as BehandlingAppKontekst[]}
          behandlingId={1}
          behandlingVersjon={2}
          navAnsatt={navAnsatt}
        />
      </MemoryRouter>,
    );

    expect(screen.getAllByRole('tab').length).toBe(4);
  });

  describe('hentSynligePaneler', () => {
    it('skal kunne aksessere alle support-paneler', () => {
      const behandlingRettigheter = {
        behandlingFraBeslutter: true,
        behandlingKanSendeMelding: true,
        behandlingTilGodkjenning: true,
        behandlingKanBytteEnhet: true,
        behandlingKanHenlegges: true,
        behandlingKanGjenopptas: false,
        behandlingKanOpnesForEndringer: true,
        behandlingKanSettesPaVent: true,
        vergeBehandlingsmeny: VergeBehandlingmenyValg.OPPRETT,
      };

      const accessiblePanels = hentSynligePaneler(behandlingRettigheter);

      expect(accessiblePanels).toEqual([
        'TIL_BESLUTTER',
        'FRA_BESLUTTER',
        'HISTORIKK',
        'MELDINGER',
        'DOKUMENTER',
        'NOTATER',
      ]);
    });

    it('skal kunne aksessere kun supportpanelene som alltid vises; historikk og dokumenter', () => {
      const behandlingRettigheter = {
        behandlingFraBeslutter: false,
        behandlingKanSendeMelding: false,
        behandlingTilGodkjenning: false,
        behandlingKanBytteEnhet: true,
        behandlingKanHenlegges: true,
        behandlingKanGjenopptas: false,
        behandlingKanOpnesForEndringer: false,
        behandlingKanSettesPaVent: true,
        vergeBehandlingsmeny: VergeBehandlingmenyValg.OPPRETT,
      };

      const accessiblePanels = hentSynligePaneler(behandlingRettigheter);

      expect(accessiblePanels).toEqual(['HISTORIKK', 'MELDINGER', 'DOKUMENTER', 'NOTATER']);
    });
  });

  describe('hentValgbarePaneler', () => {
    it('skal vise alle support-panelene som valgbare', () => {
      const accessibleSupportPanels = ['TIL_BESLUTTER', 'FRA_BESLUTTER', 'HISTORIKK', 'MELDINGER', 'DOKUMENTER'];

      const behandlingRettigheter = {
        behandlingFraBeslutter: true,
        behandlingKanSendeMelding: true,
        behandlingTilGodkjenning: false,
        behandlingKanBytteEnhet: true,
        behandlingKanHenlegges: true,
        behandlingKanGjenopptas: false,
        behandlingKanOpnesForEndringer: true,
        behandlingKanSettesPaVent: true,
        vergeBehandlingsmeny: VergeBehandlingmenyValg.OPPRETT,
      };

      const enabledPanels = hentValgbarePaneler(accessibleSupportPanels, behandlingRettigheter);

      expect(enabledPanels).toEqual(['TIL_BESLUTTER', 'FRA_BESLUTTER', 'HISTORIKK', 'MELDINGER', 'DOKUMENTER']);
    });
  });
});
