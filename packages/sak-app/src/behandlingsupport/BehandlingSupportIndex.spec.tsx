import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import { Fagsak } from '@k9-sak-web/types';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import SupportMenySakIndex from '@fpsak-frontend/sak-support-meny';

import * as useTrackRouteParam from '../app/useTrackRouteParam';
import BehandlingSupportIndex, { getAccessibleSupportPanels, getEnabledSupportPanels } from './BehandlingSupportIndex';
import BehandlingAppKontekst from '../behandling/behandlingAppKontekstTsType';
import { requestApi, FpsakApiKeys } from '../data/fpsakApi';

describe('<BehandlingSupportIndex>', () => {
  const fagsak = {
    saksnummer: 123,
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
    requestApi.mock(FpsakApiKeys.NAV_ANSATT, navAnsatt);

    const wrapper = shallow(
      <BehandlingSupportIndex
        fagsak={fagsak as Fagsak}
        alleBehandlinger={[behandling] as BehandlingAppKontekst[]}
        behandlingId={1}
        behandlingVersjon={2}
      />,
    );

    expect(wrapper.find(SupportMenySakIndex)).to.have.length(1);
  });

  describe('getAccessibleSupportPanels', () => {
    it('skal kunne aksessere alle support-paneler', () => {
      const returnIsRelevant = true;
      const approvalIsRelevant = true;
      const rettigheter = {
        sendMeldingAccess: {
          isEnabled: true,
          employeeHasAccess: true,
        },
        godkjenningsFaneAccess: {
          isEnabled: true,
          employeeHasAccess: true,
        },
        fraBeslutterFaneAccess: {
          isEnabled: true,
          employeeHasAccess: true,
        },
      };

      const accessiblePanels = getAccessibleSupportPanels(returnIsRelevant, approvalIsRelevant, rettigheter);

      expect(accessiblePanels).is.eql(['godkjenning', 'frabeslutter', 'historikk', 'sendmelding', 'dokumenter']);
    });

    it('skal kunne aksessere kun supportpanelene som alltid vises; historikk og dokumenter', () => {
      const returnIsRelevant = false;
      const approvalIsRelevant = false;
      const rettigheter = {
        sendMeldingAccess: {
          isEnabled: false,
          employeeHasAccess: false,
        },
        godkjenningsFaneAccess: {
          isEnabled: false,
          employeeHasAccess: false,
        },
        fraBeslutterFaneAccess: {
          isEnabled: false,
          employeeHasAccess: false,
        },
      };

      const accessiblePanels = getAccessibleSupportPanels(returnIsRelevant, approvalIsRelevant, rettigheter);

      expect(accessiblePanels).is.eql(['historikk', 'dokumenter']);
    });
  });

  describe('getEnabledSupportPanels', () => {
    it('skal vise alle support-panelene som trykkbare', () => {
      const accessibleSupportPanels = ['godkjenning', 'frabeslutter', 'historikk', 'sendmelding', 'dokumenter'];
      const sendMessageIsRelevant = true;
      const rettigheter = {
        sendMeldingAccess: {
          isEnabled: true,
          employeeHasAccess: true,
        },
        godkjenningsFaneAccess: {
          isEnabled: true,
          employeeHasAccess: true,
        },
        fraBeslutterFaneAccess: {
          isEnabled: true,
          employeeHasAccess: true,
        },
      };

      const enabledPanels = getEnabledSupportPanels(accessibleSupportPanels, sendMessageIsRelevant, rettigheter);

      expect(enabledPanels).is.eql(accessibleSupportPanels);
    });

    it('skal kun vise historikk og dokument-panelene som trykkbare', () => {
      const accessibleSupportPanels = ['godkjenning', 'frabeslutter', 'historikk', 'sendmelding', 'dokumenter'];
      const sendMessageIsRelevant = false;
      const rettigheter = {
        sendMeldingAccess: {
          isEnabled: false,
          employeeHasAccess: false,
        },
        godkjenningsFaneAccess: {
          isEnabled: false,
          employeeHasAccess: false,
        },
        fraBeslutterFaneAccess: {
          isEnabled: false,
          employeeHasAccess: false,
        },
      };

      const enabledPanels = getEnabledSupportPanels(accessibleSupportPanels, sendMessageIsRelevant, rettigheter);

      expect(enabledPanels).is.eql(['historikk', 'dokumenter']);
    });
  });
});
