import React from 'react';
import sinon, { SinonStub } from 'sinon';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { BehandlingAppKontekst, Fagsak } from '@k9-sak-web/types';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';

import { VergeBehandlingmenyValg } from '../behandling/behandlingRettigheterTsType';
import * as useTrackRouteParam from '../app/useTrackRouteParam';
import BehandlingSupportIndex, { hentSynligePaneler, hentValgbarePaneler } from './BehandlingSupportIndex';
import { requestApi, K9sakApiKeys } from '../data/k9sakApi';

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
    type: behandlingType.FORSTEGANGSSOKNAD,
    status: behandlingStatus.OPPRETTET,
  };

  const location = { pathname: '', search: '', state: {}, hash: '', key: '' };

  let contextStub: SinonStub;
  beforeEach(() => {
    contextStub = sinon.stub(useTrackRouteParam, 'default').callsFake(() => ({
      selected: 123456,
      location,
    }));
  });

  afterEach(() => {
    contextStub.restore();
  });

  it('skal vise godkjennings-panelet', () => {
    requestApi.mock(K9sakApiKeys.NAV_ANSATT, navAnsatt);
    requestApi.mock(K9sakApiKeys.INIT_FETCH_TILBAKE, {});
    requestApi.mock(K9sakApiKeys.INIT_FETCH_KLAGE, {});
    requestApi.mock(K9sakApiKeys.KODEVERK, {});
    requestApi.mock(K9sakApiKeys.KODEVERK_TILBAKE, {});
    requestApi.mock(K9sakApiKeys.KODEVERK_KLAGE, {});
    requestApi.mock(K9sakApiKeys.HISTORY_K9SAK, []);
    requestApi.mock(K9sakApiKeys.HISTORY_TILBAKE, []);
    requestApi.mock(K9sakApiKeys.HISTORY_KLAGE, []);

    render(
      <MemoryRouter>
        <BehandlingSupportIndex
          fagsak={fagsak as Fagsak}
          alleBehandlinger={[behandling] as BehandlingAppKontekst[]}
          behandlingId={1}
          behandlingVersjon={2}
        />
      </MemoryRouter>
    );

    expect(screen.queryAllByTestId('TabMenyKnapp').length).toBe(3);
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

      expect(accessiblePanels).toEqual(['TIL_BESLUTTER', 'FRA_BESLUTTER', 'HISTORIKK', 'MELDINGER', 'DOKUMENTER']);
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

      expect(accessiblePanels).toEqual(['HISTORIKK', 'MELDINGER', 'DOKUMENTER']);
    });
  });

  describe('hentValgbarePaneler', () => {
    it('skal vise alle support-panelene som valgbare', () => {
      const accessibleSupportPanels = ['TIL_BESLUTTER', 'FRA_BESLUTTER', 'HISTORIKK', 'MELDINGER', 'DOKUMENTER'];
      const sendMessageIsRelevant = true;

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

      const enabledPanels = hentValgbarePaneler(accessibleSupportPanels, sendMessageIsRelevant, behandlingRettigheter);

      expect(enabledPanels).toEqual(['TIL_BESLUTTER', 'FRA_BESLUTTER', 'HISTORIKK', 'MELDINGER', 'DOKUMENTER']);
    });

    it('skal ikke vise meldingspanel som valgbart', () => {
      const accessibleSupportPanels = ['TIL_BESLUTTER', 'FRA_BESLUTTER', 'HISTORIKK', 'MELDINGER', 'DOKUMENTER'];
      const sendMessageIsRelevant = false;
      const behandlingRettigheter = {
        behandlingFraBeslutter: false,
        behandlingKanSendeMelding: false,
        behandlingTilGodkjenning: false,
        behandlingKanBytteEnhet: true,
        behandlingKanHenlegges: true,
        behandlingKanGjenopptas: false,
        behandlingKanOpnesForEndringer: true,
        behandlingKanSettesPaVent: true,
        vergeBehandlingsmeny: VergeBehandlingmenyValg.OPPRETT,
      };

      const enabledPanels = hentValgbarePaneler(accessibleSupportPanels, sendMessageIsRelevant, behandlingRettigheter);

      expect(enabledPanels).toEqual(['TIL_BESLUTTER', 'FRA_BESLUTTER', 'HISTORIKK', 'DOKUMENTER']);
    });
  });
});
