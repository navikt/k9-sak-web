import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { reduxForm, reducer as formReducer } from 'redux-form';
import { Provider } from 'react-redux';
import { combineReducers, createStore } from 'redux';

import { Fagsak } from '@k9-sak-web/types';
import { RestApiErrorProvider } from '@k9-sak-web/rest-api-hooks';

import { requestApi, K9sakApiKeys } from '../data/k9sakApi';
import FagsakSearchIndex from './FagsakSearchIndex';

const mockNavigate = vi.fn();
const MockForm = reduxForm({ form: 'mock' })(({ children }) => <div>{children}</div>);

jest.mock('react-router-dom', () => ({
  ...(jest.requireActual('react-router-dom') as Record<string, unknown>),
  useNavigate: () => mockNavigate,
}));

describe('<FagsakSearchIndex>', () => {
  const fagsak: Partial<Fagsak> = {
    saksnummer: '12345',
    sakstype: {
      kode: 'ES',
      kodeverk: 'test',
    },
    status: {
      kode: 'OPPR',
      kodeverk: 'test',
    },
    barnFodt: '10.10.2017',
    antallBarn: 1,
    opprettet: '13‎.‎02‎.‎2017‎ ‎09‎:‎54‎:‎22',
    dekningsgrad: 100,
  };
  const fagsak2: Partial<Fagsak> = {
    ...fagsak,
    saksnummer: '23456',
  };
  const fagsaker = [fagsak, fagsak2];

  it('skal søke opp fagsaker', async () => {
    requestApi.mock(K9sakApiKeys.KODEVERK, {});
    requestApi.mock(K9sakApiKeys.SEARCH_FAGSAK, fagsaker);

    render(
      <Provider store={createStore(combineReducers({ form: formReducer }))}>
        <MockForm>
          <MemoryRouter>
            <FagsakSearchIndex />
          </MemoryRouter>
        </MockForm>
      </Provider>,
    );

    expect(await screen.getByTestId('FagsakSearch')).toBeInTheDocument();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();

    userEvent.type(screen.getByRole('textbox', { name: 'Saksnummer eller fødselsnummer/D-nummer' }), '12345');
    userEvent.click(await screen.getByRole('button', { name: 'Søk' }));

    const reqData = requestApi.getRequestMockData(K9sakApiKeys.SEARCH_FAGSAK);
    expect(reqData[0].params).toEqual({ searchString: '12345' });
    expect(screen.queryAllByRole('table').length).toBe(1);
    expect(screen.queryAllByRole('cell', { name: '12345' }).length).toBe(1);
    expect(screen.queryAllByRole('cell', { name: '23456' }).length).toBe(1);
  });

  it('skal gå til valgt fagsak', async () => {
    requestApi.mock(K9sakApiKeys.KODEVERK, {});
    requestApi.mock(K9sakApiKeys.SEARCH_FAGSAK, fagsaker);

    render(
      <Provider store={createStore(combineReducers({ form: formReducer }))}>
        <MockForm>
          <MemoryRouter>
            <RestApiErrorProvider>
              <FagsakSearchIndex />
            </RestApiErrorProvider>
          </MemoryRouter>
        </MockForm>
      </Provider>,
    );

    expect(await screen.getByTestId('FagsakSearch')).toBeInTheDocument();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();

    userEvent.type(screen.getByRole('textbox', { name: 'Saksnummer eller fødselsnummer/D-nummer' }), '12345');
    userEvent.click(await screen.getByRole('button', { name: 'Søk' }));

    const reqData = requestApi.getRequestMockData(K9sakApiKeys.SEARCH_FAGSAK);
    expect(reqData[0].params).toEqual({ searchString: '12345' });
    expect(screen.queryAllByRole('table').length).toBe(1);
    expect(screen.queryAllByRole('cell', { name: '12345' }).length).toBe(1);

    userEvent.click(screen.getByRole('row', { name: '12345' }));

    expect(mockNavigate.mock.calls[0][0]).toBe('/fagsak/12345/');
  });
});
