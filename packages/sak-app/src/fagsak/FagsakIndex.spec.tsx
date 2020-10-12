import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import * as useLocation from '../app/useLocation';
import FagsakGrid from './components/FagsakGrid';
import * as useTrackRouteParam from '../app/useTrackRouteParam';
import { requestApi, FpsakApiKeys } from '../data/fpsakApi';

import FagsakIndex from './FagsakIndex';

describe('<FagsakIndex>', () => {
  const location = {
    pathname: '',
    search: '',
    state: {},
    hash: '',
  };

  const fagsak = {
    saksnummer: 123456,
  };

  const behandling = {
    id: 1,
  };
  const behandling2 = {
    id: 2,
  };

  let contextStubLocation;
  let contextStub;
  beforeEach(() => {
    contextStubLocation = sinon.stub(useLocation, 'default').callsFake(() => location);
    contextStub = sinon.stub(useTrackRouteParam, 'default').callsFake(() => ({
      selected: 123456,
      location,
    }));
  });

  afterEach(() => {
    contextStubLocation.restore();
    contextStub.restore();
  });

  xit('skal hente alle behandlinger fra fpsak og fptilbake', () => {
    requestApi.mock(FpsakApiKeys.KODEVERK, {});
    requestApi.mock(FpsakApiKeys.FETCH_FAGSAK, fagsak);
    requestApi.mock(FpsakApiKeys.KODEVERK_FPTILBAKE, {});
    requestApi.mock(FpsakApiKeys.BEHANDLINGER_FPSAK, [behandling]);
    requestApi.mock(FpsakApiKeys.BEHANDLINGER_FPTILBAKE, [behandling2]);

    const wrapper = shallow(<FagsakIndex />);

    const grid = wrapper.find(FagsakGrid);
    expect(grid).to.have.length(1);

    const fagsakProfileIndex = grid.prop('profileAndNavigationContent');

    // @ts-ignore
    expect(fagsakProfileIndex.props.alleBehandlinger).to.eql([behandling, behandling2]);
  });
});
