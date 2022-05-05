import HeaderWithErrorPanel from '@fpsak-frontend/sak-dekorator';
import { intlMock, shallowWithIntl } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import * as useRestApiError from '@k9-sak-web/rest-api-hooks/src/error/useRestApiError';
import EventType from '@k9-sak-web/rest-api/src/requestApi/eventType';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import sinon from 'sinon';
import { K9sakApiKeys, requestApi } from '../../data/k9sakApi';
import Dekorator from './Dekorator';

const navAnsatt = {
  brukernavn: 'Test',
  kanBehandleKode6: false,
  kanBehandleKode7: false,
  kanBehandleKodeEgenAnsatt: false,
  kanBeslutte: true,
  kanOverstyre: false,
  kanSaksbehandle: true,
  kanVeilede: false,
  navn: 'Test',
};

const linkMock = {
  href: 'test',
  rel: 'test',
  requestPayload: 'test',
  type: 'test',
};

const initFetch = {
  links: [linkMock],
  toggleLinks: [linkMock],
  sakLinks: [linkMock],
};

let contextStubHistory;
afterEach(() => {
  if (contextStubHistory) {
    contextStubHistory.restore();
  }
});

describe('<Dekorator>', () => {
  it('skal vise søkeskjermbildet, men ikke systemstatuser', () => {
    requestApi.mock(K9sakApiKeys.NAV_ANSATT, navAnsatt);

    const wrapper = shallowWithIntl(
      <MemoryRouter initialEntries={['/test']}>
        <Dekorator.WrappedComponent
          intl={intlMock}
          queryStrings={{}}
          setSiteHeight={sinon.spy()}
          initFetch={initFetch}
        />
        ,
      </MemoryRouter>,
    );
    const header = wrapper.find(HeaderWithErrorPanel);
    expect(header.length).toBe(1);
  });

  it('skal vise feilmeldinger', () => {
    requestApi.mock(K9sakApiKeys.NAV_ANSATT, navAnsatt);

    contextStubHistory = sinon.stub(useRestApiError, 'default').returns([
      {
        type: EventType.REQUEST_ERROR,
        feilmelding: 'Dette er en feilmelding',
      },
    ]);

    const wrapper = shallowWithIntl(
      <Dekorator.WrappedComponent
        intl={intlMock}
        queryStrings={{}}
        setSiteHeight={sinon.spy()}
        initFetch={initFetch}
      />,
    );
    const header = wrapper.find(HeaderWithErrorPanel);
    expect(header.prop('errorMessages')).toEqual([
      {
        message: 'Dette er en feilmelding',
        additionalInfo: undefined,
      },
    ]);
  });
});
