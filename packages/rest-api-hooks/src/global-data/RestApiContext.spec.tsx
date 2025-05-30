/* eslint-disable class-methods-use-this */
import { AbstractRequestApi } from '@k9-sak-web/rest-api';
import { render } from '@testing-library/react';
import React, { useEffect, act } from 'react';
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

  public hasPath = () => true;

  public injectPaths = () => {};

  public resetCache = () => {};

  public isMock = () => false;

  public setAddErrorMessageHandler = () => {};

  public setRequestPendingHandler = () => {};

  public setLinks = () => {};

  public mock = () => {
    throw new Error('Not Implemented');
  };

  public setMissingPath = () => {
    throw new Error('Not Implemented');
  };

  public getRequestMockData = () => {
    throw new Error('Not Implemented');
  };

  public clearMockData = () => {
    throw new Error('Not Implemented');
  };

  public clearAllMockData = () => {
    throw new Error('Not Implemented');
  };
}

const dataHentetFraBackend = { id: 1 };

const useGlobalStateRestApi = getUseGlobalStateRestApi(new RequestApiTestMock(dataHentetFraBackend));

const TestGlobalData = ({ setValue }) => {
  useGlobalStateRestApi('BEHANDLING');

  const data = useGlobalStateRestApiData('BEHANDLING');
  useEffect(() => {
    setValue(data);
  }, [data]);
  return null;
};

describe('<RestApiContext>', () => {
  it('skal utføre restkall og så hente data inn i komponent', async () => {
    const setValue = vi.fn();

    await act(async () => {
      render(
        <RestApiProvider>
          <RestApiErrorProvider>
            <TestGlobalData setValue={setValue} />
          </RestApiErrorProvider>
        </RestApiProvider>,
      );
    });

    // Må sjekke resultatet via funksjon fordi per i dag blir ikke output fra TestGlobalData korrekt oppdatert
    expect(setValue.mock.calls.length).toBe(2);
    const args = setValue.mock.calls[1];
    expect(args).toHaveLength(1);
    expect(args[0]).toEqual(dataHentetFraBackend);
  });
});
