import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

import RisikoklassifiseringSakIndex from '@fpsak-frontend/sak-risikoklassifisering';
import kontrollresultatKode from '@fpsak-frontend/sak-risikoklassifisering/src/kodeverk/kontrollresultatKode';
import { Fagsak, Behandling } from '@k9-sak-web/types';

import * as useHistory from '../../app/useHistory';
import * as useLocation from '../../app/useLocation';
import * as useTrackRouteParam from '../../app/useTrackRouteParam';
import RisikoklassifiseringIndex from './RisikoklassifiseringIndex';
import { requestApi, FpsakApiKeys } from '../../data/fpsakApi';

const lagRisikoklassifisering = kode => ({
  kontrollresultat: {
    kode,
    kodeverk: 'Kontrollresultat',
  },
  medlFaresignaler: undefined,
  iayFaresignaler: undefined,
});

const fagsak = {
  saksnummer: 123456,
};

const behandling = {
  id: 1,
};

const location = {
  hash: '23',
  pathname: '/test/',
  state: {},
  search: '',
};

const navAnsatt = { navn: 'Ann S. Att', kanSaksbehandle: true };

describe('<RisikoklassifiseringIndex>', () => {
  let contextStub;
  let contextStubHistory;
  let contextStubLocation;

  beforeEach(() => {
    contextStub = sinon.stub(useTrackRouteParam, 'default').callsFake(() => ({
      selected: true,
      location,
    }));
    // @ts-ignore
    contextStubHistory = sinon.stub(useHistory, 'default').callsFake(() => ({ push: sinon.spy() }));
    contextStubLocation = sinon.stub(useLocation, 'default').callsFake(() => location);
  });

  afterEach(() => {
    contextStub.restore();
    contextStubHistory.restore();
    contextStubLocation.restore();
  });

  it('skal rendere komponent', () => {
    requestApi.mock(FpsakApiKeys.NAV_ANSATT, navAnsatt);
    const wrapper = shallow(
      <RisikoklassifiseringIndex
        fagsak={fagsak as Fagsak}
        alleBehandlinger={[behandling] as Behandling[]}
        kontrollresultat={lagRisikoklassifisering(kontrollresultatKode.HOY)}
        behandlingVersjon={1}
        behandlingId={1}
      />,
    );
    expect(wrapper.find(RisikoklassifiseringSakIndex)).has.length(1);
  });
});
