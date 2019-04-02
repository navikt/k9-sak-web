import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import MockAdapter from 'axios-mock-adapter';
import { expect } from 'chai';

import { ignoreRestErrors, withoutRestActions } from '@fpsak-frontend/utils-test/src/data-test-helper';
import { sakOperations } from '@fpsak-frontend/fp-behandling-felles';

import { BehandlingIdentifier } from '@fpsak-frontend/fp-felles';
import innsynBehandlingApi, { reduxRestApi } from '../data/innsynBehandlingApi';
import {
  behandlingsprosessReducer, resetBehandlingspunkter, setSelectedBehandlingspunktNavn,
  resolveProsessAksjonspunkter,
} from './duckBpInnsyn';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('Behandlingsprosess-innsyn-reducer', () => {
  let mockAxios;

  before(() => {
    mockAxios = new MockAdapter(reduxRestApi.getHttpClientApi().axiosInstance);
  });

  afterEach(() => {
    mockAxios.reset();
  });

  after(() => {
    mockAxios.restore();
  });

  it('skal returnere initial state', () => {
    expect(behandlingsprosessReducer(undefined, {})).to.eql({
      selectedBehandlingspunktNavn: undefined,
      resolveProsessAksjonspunkterStarted: false,
      resolveProsessAksjonspunkterSuccess: false,
    });
  });

  it('skal resette behandlingspunkter til opprinnelig state, men ikke selectedBehandlingspunktNavn', () => {
    const manipulertState = {
      selectedBehandlingspunktNavn: 'askjlhd',
      resolveProsessAksjonspunkterStarted: true,
      resolveProsessAksjonspunkterSuccess: true,
    };

    expect(behandlingsprosessReducer(manipulertState, resetBehandlingspunkter())).to.eql({
      selectedBehandlingspunktNavn: 'askjlhd',
      resolveProsessAksjonspunkterStarted: false,
      resolveProsessAksjonspunkterSuccess: false,
    });
  });

  it('skal sette valgt behandlingspunkt-navn', () => {
    const behandlingspunkt = setSelectedBehandlingspunktNavn('test');

    expect(behandlingsprosessReducer(undefined, behandlingspunkt)).to.eql({
      selectedBehandlingspunktNavn: 'test',
      resolveProsessAksjonspunkterStarted: false,
      resolveProsessAksjonspunkterSuccess: false,
    });
  });

  it('skal avklare aksjonspunkter', () => {
    const data = {
      resource: 'resource',
    };
    const headers = {
      location: 'status-url',
    };

    reduxRestApi.injectPaths([{
      href: '/lagre-ap',
      rel: 'bekreft-aksjonspunkt',
      type: 'POST',
    }]);

    sakOperations.withUpdateFagsakInfo(() => () => (Promise.resolve({ type: 'SET-FAGSAK-INFO' })));

    mockAxios
      .onPost(innsynBehandlingApi.SAVE_AKSJONSPUNKT.path)
      .reply(202, data, headers);
    mockAxios
      .onGet(headers.location)
      .reply(200, [{ personstatus: 'test' }]);

    const store = mockStore();
    const behandlingIdentifier = new BehandlingIdentifier('123', '456');

    return store.dispatch(resolveProsessAksjonspunkter(behandlingIdentifier, [{ id: 1 }]))
      .catch(ignoreRestErrors)
      .then(() => {
        const actions = withoutRestActions(store.getActions());
        expect(actions).to.have.length(3);

        const stateAfterFetchStarted = behandlingsprosessReducer(undefined, actions[0]);
        expect(stateAfterFetchStarted).to.eql({
          selectedBehandlingspunktNavn: undefined,
          resolveProsessAksjonspunkterStarted: true,
          resolveProsessAksjonspunkterSuccess: false,
        });

        const stateAfterFetchFinished = behandlingsprosessReducer(undefined, actions[2]);
        expect(stateAfterFetchFinished).to.eql({
          selectedBehandlingspunktNavn: undefined,
          resolveProsessAksjonspunkterStarted: false,
          resolveProsessAksjonspunkterSuccess: true,
        });
      });
  });
});
