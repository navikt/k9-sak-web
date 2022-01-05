import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import { BehandlingAppKontekst, Fagsak } from '@k9-sak-web/types';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import SupportMenySakIndex from '@fpsak-frontend/sak-support-meny';

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
    type: {
      kode: behandlingType.FORSTEGANGSSOKNAD,
      kodeverk: '',
    },
    status: {
      kode: behandlingStatus.OPPRETTET,
      kodeverk: '',
    },
  };

  const location = {
    key: '',
    pathname: '',
    search: '',
    state: {},
    hash: '',
  };

  let contextStub;
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

    const wrapper = shallow(
      <BehandlingSupportIndex
        fagsak={fagsak as Fagsak}
        alleBehandlinger={[behandling] as BehandlingAppKontekst[]}
        behandlingId={1}
        behandlingVersjon={2}
      />,
    );

    expect(wrapper.find(SupportMenySakIndex)).toHaveLength(1);
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
