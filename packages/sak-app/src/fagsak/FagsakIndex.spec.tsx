import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import FagsakGrid from './components/FagsakGrid';
import * as useTrackRouteParam from '../app/useTrackRouteParam';
import { requestApi, K9sakApiKeys } from '../data/k9sakApi';

import FagsakIndex from './FagsakIndex';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    pathname: 'test',
    search: 'test',
    state: {},
    hash: 'test',
  }),
}));

describe('<FagsakIndex>', () => {
  const fagsak = {
    saksnummer: 123456,
  };

  const behandling = {
    id: 1,
  };
  const behandling2 = {
    id: 2,
  };

  let contextStub;
  beforeEach(() => {
    contextStub = sinon.stub(useTrackRouteParam, 'default').callsFake(() => ({
      selected: 123456,
      location: {
        pathname: 'test',
        search: 'test',
        state: {},
        hash: 'test',
      },
    }));
  });

  afterEach(() => {
    contextStub.restore();
  });

  it('skal hente alle behandlinger fra fpsak og fptilbake', () => {
    requestApi.mock(K9sakApiKeys.KODEVERK, {});
    requestApi.mock(K9sakApiKeys.FETCH_FAGSAK, fagsak);
    requestApi.mock(K9sakApiKeys.SAK_BRUKER, {});
    requestApi.mock(K9sakApiKeys.SAK_RETTIGHETER, {
      behandlingTypeKanOpprettes: [],
    });
    requestApi.mock(K9sakApiKeys.SAK_RETTIGHETER_TILBAKE, {
      behandlingTypeKanOpprettes: [],
    });
    requestApi.mock(K9sakApiKeys.INIT_FETCH_TILBAKE, {});
    requestApi.mock(K9sakApiKeys.KODEVERK_TILBAKE, {});
    requestApi.mock(K9sakApiKeys.BEHANDLINGER_K9SAK, [behandling]);
    requestApi.mock(K9sakApiKeys.BEHANDLINGER_TILBAKE, [behandling2]);

    const wrapper = shallow(<FagsakIndex />);

    const grid = wrapper.find(FagsakGrid);
    expect(grid).toHaveLength(1);

    const fagsakProfileIndex = grid.prop('profileAndNavigationContent');

    // @ts-ignore
    expect(fagsakProfileIndex.props.alleBehandlinger).toEqual([behandling, behandling2]);
  });
});
