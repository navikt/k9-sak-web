import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import FagsakGrid from './components/FagsakGrid';
import * as useTrackRouteParam from '../app/useTrackRouteParam';
import { requestApi, K9sakApiKeys } from '../data/k9sakApi';

import FagsakIndex from './FagsakIndex';

vi.mock('react-router-dom', async () => {
  const actual = (await vi.importActual('react-router-dom')) as Record<string, unknown>;
  return {
    ...actual,
    useLocation: () => ({
      pathname: 'test',
      search: 'test',
      state: {},
      hash: 'test',
    }),
  };
});

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
  const behandling3 = {
    id: 3,
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
        key: 'test',
      },
    }));
  });

  afterEach(() => {
    contextStub.restore();
  });

  it('skal hente alle behandlinger fra k9sak, tilbake og klage', () => {
    requestApi.mock(K9sakApiKeys.KODEVERK, {});
    requestApi.mock(K9sakApiKeys.FETCH_FAGSAK, fagsak);
    requestApi.mock(K9sakApiKeys.SAK_BRUKER, {});
    requestApi.mock(K9sakApiKeys.SAK_RETTIGHETER, {
      behandlingTypeKanOpprettes: [],
    });
    requestApi.mock(K9sakApiKeys.SAK_RETTIGHETER_TILBAKE, {
      behandlingTypeKanOpprettes: [],
    });
    requestApi.mock(K9sakApiKeys.SAK_RETTIGHETER_KLAGE, {
      behandlingTypeKanOpprettes: [],
    });
    requestApi.mock(K9sakApiKeys.INIT_FETCH_TILBAKE, {});
    requestApi.mock(K9sakApiKeys.INIT_FETCH_KLAGE, {});
    requestApi.mock(K9sakApiKeys.KODEVERK_TILBAKE, {});
    requestApi.mock(K9sakApiKeys.KODEVERK_KLAGE, {});
    requestApi.mock(K9sakApiKeys.BEHANDLINGER_K9SAK, [behandling]);
    requestApi.mock(K9sakApiKeys.BEHANDLINGER_TILBAKE, [behandling2]);
    requestApi.mock(K9sakApiKeys.BEHANDLINGER_KLAGE, [behandling3]);
    requestApi.mock(K9sakApiKeys.HENT_SAKSBEHANDLERE, {});
    requestApi.mock(K9sakApiKeys.FEATURE_TOGGLE, []);
    requestApi.mock(K9sakApiKeys.LOS_HENTE_MERKNAD, []);

    const wrapper = shallow(<FagsakIndex />);

    const grid = wrapper.find(FagsakGrid);
    expect(grid).toHaveLength(1);

    const fagsakProfileIndex = grid.prop('profileAndNavigationContent');

    // @ts-ignore
    expect(fagsakProfileIndex.props.alleBehandlinger).toEqual([behandling, behandling2, behandling3]);
  });
});
