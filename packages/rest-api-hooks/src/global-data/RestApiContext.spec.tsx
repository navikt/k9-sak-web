import React, { useEffect } from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

import { AbstractRequestApi } from '@fpsak-frontend/rest-api-new';

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

  public cancelRequest = () => undefined;

  public hasPath = () => true;

  public injectPaths = () => {};

  public isMock = () => false;

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

    await mount(
      <RestApiProvider>
        <RestApiErrorProvider>
          <TestGlobalData setValue={setValue} />
        </RestApiErrorProvider>
      </RestApiProvider>,
    );

    // Må sjekke resultatet via funksjon fordi per i dag blir ikke output fra TestGlobalData korrekt oppdatert
    expect(setValue.calledTwice).to.true;
    const { args } = setValue.getCalls()[1];
    expect(args).has.length(1);
    expect(args[0]).is.eql(dataHentetFraBackend);
  });
});
