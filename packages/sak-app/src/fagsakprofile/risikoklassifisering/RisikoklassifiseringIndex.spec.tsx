import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import RisikoklassifiseringSakIndex from '@fpsak-frontend/sak-risikoklassifisering';
import kontrollresultatKode from '@fpsak-frontend/sak-risikoklassifisering/src/kodeverk/kontrollresultatKode';
import { Fagsak, BehandlingAppKontekst } from '@k9-sak-web/types';

import * as useTrackRouteParam from '../../app/useTrackRouteParam';
import RisikoklassifiseringIndex from './RisikoklassifiseringIndex';
import { requestApi, K9sakApiKeys } from '../../data/k9sakApi';

const lagRisikoklassifisering = kode => ({
  kontrollresultat: {
    kode,
    kodeverk: 'Kontrollresultat',
  },
  medlFaresignaler: undefined,
  iayFaresignaler: undefined,
});

const fagsak = {
  saksnummer: '123456',
};

const behandling = {
  id: 1,
};

const location = {
  key: '1',
  hash: '23',
  pathname: '/test/',
  state: {},
  search: '',
};

const navAnsatt = { navn: 'Ann S. Att', kanSaksbehandle: true };

jest.mock('react-router-dom', () => ({
  ...(jest.requireActual('react-router-dom') as Record<string, unknown>),
  useHistory: () => ({
    push: jest.fn(),
  }),
  useLocation: () => ({
    hash: '23',
    pathname: '/test/',
    state: {},
    search: '',
  }),
}));

describe('<RisikoklassifiseringIndex>', () => {
  let contextStub;

  beforeEach(() => {
    contextStub = sinon.stub(useTrackRouteParam, 'default').callsFake(() => ({
      selected: true,
      location,
    }));
  });

  afterEach(() => {
    contextStub.restore();
  });

  it('skal rendere komponent', () => {
    requestApi.mock(K9sakApiKeys.NAV_ANSATT, navAnsatt);
    const wrapper = shallow(
      <RisikoklassifiseringIndex
        fagsak={fagsak as Fagsak}
        alleBehandlinger={[behandling] as BehandlingAppKontekst[]}
        kontrollresultat={lagRisikoklassifisering(kontrollresultatKode.HOY)}
        behandlingVersjon={1}
        behandlingId={1}
      />,
    );
    expect(wrapper.find(RisikoklassifiseringSakIndex)).toHaveLength(1);
  });
});
