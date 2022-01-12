import React, { useEffect } from 'react';
import { mount } from 'enzyme';
import sinon from 'sinon';
import { act } from 'react-dom/test-utils';

import { AbstractRequestApi } from '@k9-sak-web/rest-api';

import { RestApiErrorProvider } from '../error/RestApiErrorContext';
import { RestApiProvider } from './RestApiContext';
import getUseGlobalStateRestApi from './useGlobalStateRestApi';
import useGlobalStateRestApiData from './useGlobalStateRestApiData';

class RequestApiTestMock extends AbstractRequestApi {
  data: any;

  constructor(data) {
    super();
    this.data = data;
  }

  public startRequest = () => Promise.resolve({ payload: this.data });

  // eslint-disable-next-line class-methods-use-this
  public hasPath = () => true;

  // eslint-disable-next-line class-methods-use-this
  public injectPaths = () => { };

  // eslint-disable-next-line class-methods-use-this
  public resetCache = () => { };

  // eslint-disable-next-line class-methods-use-this
  public isMock = () => false;

  // eslint-disable-next-line class-methods-use-this
  public setAddErrorMessageHandler = () => { };

  // eslint-disable-next-line class-methods-use-this
  public setRequestPendingHandler = () => { };

  // eslint-disable-next-line class-methods-use-this
  public setLinks = () => { };

  // eslint-disable-next-line class-methods-use-this
  public mock = () => {
    throw new Error('Not Implemented');
  };

  // eslint-disable-next-line class-methods-use-this
  public setMissingPath = () => {
    throw new Error('Not Implemented');
  };

  // eslint-disable-next-line class-methods-use-this
  public getRequestMockData = () => {
    throw new Error('Not Implemented');
  };

  // eslint-disable-next-line class-methods-use-this
  public clearAllMockData = () => {
    throw new Error('Not Implemented');
  };
}

const dataHentetFraBackend = { id: 1 };

const useGlobalStateRestApi = getUseGlobalStateRestApi(new RequestApiTestMock(dataHentetFraBackend));

function TestGlobalData({ setValue }) {
  useGlobalStateRestApi('BEHANDLING');

  const data = useGlobalStateRestApiData('BEHANDLING');
  useEffect(() => {
    setValue(data);
  }, [data]);
  return null;
};

describe('<RestApiContext>', () => {
  it('skal utføre restkall og så hente data inn i komponent', async () => {
    const setValue = sinon.spy();

    await act(async () =>
      mount(
        <RestApiProvider>
          <RestApiErrorProvider>
            <TestGlobalData setValue={setValue} />
          </RestApiErrorProvider>
        </RestApiProvider>,
      ),
    );

    // Må sjekke resultatet via funksjon fordi per i dag blir ikke output fra TestGlobalData korrekt oppdatert
    expect(setValue.calledTwice).toBe(true);
    const { args } = setValue.getCalls()[1];
    expect(args).toHaveLength(1);
    expect(args[0]).toEqual(dataHentetFraBackend);
  });
});
