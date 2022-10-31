/* eslint-disable class-methods-use-this */
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

  public hasPath = () => true;

  public injectPaths = () => { };

  public resetCache = () => { };

  public isMock = () => false;

  public setAddErrorMessageHandler = () => { };

  public setRequestPendingHandler = () => { };

  public setLinks = () => { };

  public mock = () => {
    throw new Error('Not Implemented');
  };

  public setMissingPath = () => {
    throw new Error('Not Implemented');
  };

  public getRequestMockData = () => {
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
    const setValue = sinon.spy();

    await act(async () => {
      mount(
        <RestApiProvider>
          <RestApiErrorProvider>
            <TestGlobalData setValue={setValue} />
          </RestApiErrorProvider>
        </RestApiProvider>,
      );
    });

    // Må sjekke resultatet via funksjon fordi per i dag blir ikke output fra TestGlobalData korrekt oppdatert
    expect(setValue.calledTwice).toBe(true);
    const { args } = setValue.getCalls()[1];
    expect(args).toHaveLength(1);
    expect(args[0]).toEqual(dataHentetFraBackend);
  });
});
