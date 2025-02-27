import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';

import { RestApiErrorProvider } from '@k9-sak-web/rest-api-hooks';
import { Fagsak } from '@k9-sak-web/types';

import { fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import alleKodeverkV2 from '@k9-sak-web/lib/kodeverk/mocks/alleKodeverkV2.json';
import { K9sakApiKeys, requestApi } from '../data/k9sakApi';
import FagsakSearchIndex from './FagsakSearchIndex';

const mockNavigate = vi.fn();

vi.mock('react-router', async () => {
  const actual = await vi.importActual<typeof import('react-router')>('react-router');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('<FagsakSearchIndex>', () => {
  const fagsak: Partial<Fagsak> = {
    saksnummer: '12345',
    sakstype: fagsakYtelsesType.ENGANGSTØNAD, // FAGSAK_YTELSE
    status: {
      kode: 'OPPR',
      kodeverk: 'FAGSAK_STATUS',
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
    requestApi.mock(K9sakApiKeys.KODEVERK, alleKodeverkV2);
    requestApi.mock(K9sakApiKeys.SEARCH_FAGSAK, fagsaker);

    render(
      <MemoryRouter>
        <FagsakSearchIndex />
      </MemoryRouter>,
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
    requestApi.mock(K9sakApiKeys.KODEVERK, alleKodeverkV2);
    requestApi.mock(K9sakApiKeys.SEARCH_FAGSAK, fagsaker);

    render(
      <MemoryRouter>
        <RestApiErrorProvider>
          <FagsakSearchIndex />
        </RestApiErrorProvider>
      </MemoryRouter>,
    );

    expect(await screen.getByTestId('FagsakSearch')).toBeInTheDocument();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();

    await userEvent.type(screen.getByRole('textbox', { name: 'Saksnummer eller fødselsnummer/D-nummer' }), '12345');
    await userEvent.click(screen.getByRole('button', { name: 'Søk' }));

    const reqData = requestApi.getRequestMockData(K9sakApiKeys.SEARCH_FAGSAK);
    expect(reqData[0].params).toEqual({ searchString: '12345' });
    expect(screen.queryAllByRole('table').length).toBe(1);
    expect(screen.queryAllByRole('cell', { name: '12345' }).length).toBe(1);

    await userEvent.click(screen.getByRole('row', { name: '12345 Engangsstønad Opprettet' }));

    expect(mockNavigate.mock.calls[0][0]).toBe('/fagsak/12345/');
  });
});
