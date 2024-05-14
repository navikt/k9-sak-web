import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { combineReducers, createStore } from 'redux';
import { reducer as formReducer } from 'redux-form';

import { RestApiErrorProvider } from '@k9-sak-web/rest-api-hooks';
import { Fagsak } from '@k9-sak-web/types';

import { K9sakApiKeys, requestApi } from '../data/k9sakApi';
import FagsakSearchIndex from './FagsakSearchIndex';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('<FagsakSearchIndex>', () => {
  const fagsak: Partial<Fagsak> = {
    saksnummer: '12345',
    sakstype: 'ES',
    status: 'OPPR',
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
        <MemoryRouter>
          <FagsakSearchIndex />
        </MemoryRouter>
      </Provider>,
    );

    expect(screen.getByTestId('FagsakSearch')).toBeInTheDocument();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();

    await userEvent.type(screen.getByRole('textbox', { name: 'Saksnummer eller fødselsnummer/D-nummer' }), '12345');
    await userEvent.click(screen.getByRole('button', { name: 'Søk' }));

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
        <MemoryRouter>
          <RestApiErrorProvider>
            <FagsakSearchIndex />
          </RestApiErrorProvider>
        </MemoryRouter>
      </Provider>,
    );

    expect(await screen.getByTestId('FagsakSearch')).toBeInTheDocument();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();

    await userEvent.type(screen.getByRole('textbox', { name: 'Saksnummer eller fødselsnummer/D-nummer' }), '12345');
    await userEvent.click(screen.getByRole('button', { name: 'Søk' }));

    const reqData = requestApi.getRequestMockData(K9sakApiKeys.SEARCH_FAGSAK);
    expect(reqData[0].params).toEqual({ searchString: '12345' });
    expect(screen.queryAllByRole('table').length).toBe(1);
    expect(screen.queryAllByRole('cell', { name: '12345' }).length).toBe(1);

    await userEvent.click(screen.getByRole('row', { name: '12345' }));

    expect(mockNavigate.mock.calls[0][0]).toBe('/fagsak/12345/');
  });
});
