import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';

import alleKodeverkV2 from '@k9-sak-web/lib/kodeverk/mocks/alleKodeverkV2.json';

import {
  ung_kodeverk_behandling_FagsakStatus,
  ung_kodeverk_behandling_FagsakYtelseType,
} from '@navikt/ung-sak-typescript-client/types';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UngSakApiKeys, requestApi } from '../data/ungsakApi';
import FagsakSearchIndex from './FagsakSearchIndex';
import { FakeUngSakBackendClient } from './mocks/FakeUngSakBackendClient';

const { mockNavigate, mockFagsakSøk } = vi.hoisted(() => ({
  mockNavigate: vi.fn(),
  mockFagsakSøk: vi.fn(),
}));

vi.mock('react-router', async () => {
  const actual = await vi.importActual<typeof import('react-router')>('react-router');
  return { ...actual, useNavigate: () => mockNavigate };
});

vi.mock('../data/UngSakBackendClient', () => ({
  UngSakBackendClient: class {
    fagsakSøk = mockFagsakSøk;
  },
}));

const fagsak1 = {
  saksnummer: '12345',
  sakstype: ung_kodeverk_behandling_FagsakYtelseType.UNGDOMSYTELSE,
  status: ung_kodeverk_behandling_FagsakStatus.OPPRETTET,
  opprettet: '2017-02-13',
};
const fagsak2 = {
  saksnummer: '23456',
  sakstype: ung_kodeverk_behandling_FagsakYtelseType.UNGDOMSYTELSE,
  status: ung_kodeverk_behandling_FagsakStatus.OPPRETTET,
  opprettet: '2017-02-13',
};

const renderComponent = (fakeClient = new FakeUngSakBackendClient()) => {
  mockFagsakSøk.mockImplementation((searchString: string) => fakeClient.fagsakSøk(searchString));
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <FagsakSearchIndex />
      </MemoryRouter>
    </QueryClientProvider>,
  );
};

describe('<FagsakSearchIndex>', () => {
  beforeEach(() => {
    requestApi.clearAllMockData();
    requestApi.mock(UngSakApiKeys.KODEVERK, alleKodeverkV2);
    mockNavigate.mockReset();
  });

  it('viser søkeskjema uten resultater ved oppstart', () => {
    renderComponent(new FakeUngSakBackendClient());
    expect(screen.getByTestId('FagsakSearch')).toBeInTheDocument();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });

  it('viser søkeresultater for flere treff', async () => {
    renderComponent(new FakeUngSakBackendClient({ fagsaker: [fagsak1, fagsak2] }));

    await userEvent.type(screen.getByRole('textbox', { name: 'Saksnummer eller fødselsnummer/D-nummer' }), '12345');
    await userEvent.click(screen.getByRole('button', { name: 'Søk' }));

    expect(await screen.findByRole('table')).toBeInTheDocument();
    expect(screen.getAllByRole('cell', { name: '12345' })).toHaveLength(1);
    expect(screen.getAllByRole('cell', { name: '23456' })).toHaveLength(1);
  });

  it('navigerer direkte til fagsak ved ett treff', async () => {
    renderComponent(new FakeUngSakBackendClient({ fagsaker: [fagsak1] }));

    await userEvent.type(screen.getByRole('textbox', { name: 'Saksnummer eller fødselsnummer/D-nummer' }), '12345');
    await userEvent.click(screen.getByRole('button', { name: 'Søk' }));

    await vi.waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith(expect.stringContaining('12345'));
    });
  });

  it('viser ingen-treff-melding ved tomt søkeresultat', async () => {
    renderComponent(new FakeUngSakBackendClient({ fagsaker: [] }));

    await userEvent.type(screen.getByRole('textbox', { name: 'Saksnummer eller fødselsnummer/D-nummer' }), 'ukjent');
    await userEvent.click(screen.getByRole('button', { name: 'Søk' }));

    expect(await screen.findByText('Søket ga ingen treff')).toBeInTheDocument();
  });
});
