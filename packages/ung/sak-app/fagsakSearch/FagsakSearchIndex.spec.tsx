import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';

import alleKodeverkV2 from '@k9-sak-web/lib/kodeverk/mocks/alleKodeverkV2.json';

import {
  ung_kodeverk_behandling_FagsakStatus,
  ung_kodeverk_behandling_FagsakYtelseType,
} from '@navikt/ung-sak-typescript-client/types';
import { QueryClientProvider } from '@tanstack/react-query';
import { UngSakApiKeys, requestApi } from '../data/ungsakApi';
import FagsakSearchIndex from './FagsakSearchIndex';
import { FakeUngSakBackendClient } from './mocks/FakeUngSakBackendClient';
import { createQueryClient } from '@k9-sak-web/gui/shared/query/queryClient.js';

const { mockNavigate, mockFagsakSøk, mockIsAktivitetspenger } = vi.hoisted(() => ({
  mockNavigate: vi.fn(),
  mockFagsakSøk: vi.fn(),
  mockIsAktivitetspenger: vi.fn(() => false),
}));

vi.mock('@k9-sak-web/gui/utils/urlUtils.js', async () => {
  const actual = await vi.importActual<typeof import('@k9-sak-web/gui/utils/urlUtils.js')>(
    '@k9-sak-web/gui/utils/urlUtils.js',
  );
  return { ...actual, isAktivitetspenger: mockIsAktivitetspenger };
});

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
const aktivitetspengerFagsak = {
  saksnummer: '34567',
  sakstype: ung_kodeverk_behandling_FagsakYtelseType.AKTIVITETSPENGER,
  status: ung_kodeverk_behandling_FagsakStatus.OPPRETTET,
  opprettet: '2017-02-13',
};

const renderComponent = (fakeClient = new FakeUngSakBackendClient()) => {
  mockFagsakSøk.mockImplementation((searchString: string) => fakeClient.fagsakSøk(searchString));
  const queryClient = createQueryClient({ queries: { retry: false } });
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
    mockIsAktivitetspenger.mockReturnValue(false);
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

  it('viser bare ungdomsytelsesaker i ungdomsytelse-appen', async () => {
    renderComponent(new FakeUngSakBackendClient({ fagsaker: [fagsak1, fagsak2, aktivitetspengerFagsak] }));

    await userEvent.type(screen.getByRole('textbox', { name: 'Saksnummer eller fødselsnummer/D-nummer' }), '12345');
    await userEvent.click(screen.getByRole('button', { name: 'Søk' }));

    expect(await screen.findByRole('table')).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: '12345' })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: '23456' })).toBeInTheDocument();
    expect(screen.queryByRole('cell', { name: '34567' })).not.toBeInTheDocument();
  });

  it('viser bare aktivitetspengesaker i aktivitetspenger-appen og navigerer ved ett treff', async () => {
    mockIsAktivitetspenger.mockReturnValue(true);
    renderComponent(new FakeUngSakBackendClient({ fagsaker: [fagsak1, aktivitetspengerFagsak] }));

    await userEvent.type(screen.getByRole('textbox', { name: 'Saksnummer eller fødselsnummer/D-nummer' }), '34567');
    await userEvent.click(screen.getByRole('button', { name: 'Søk' }));

    await vi.waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith(expect.stringContaining('34567'));
    });
  });

  it('viser ingen-treff-melding når ingen saker har riktig sakstype', async () => {
    mockIsAktivitetspenger.mockReturnValue(true);
    renderComponent(new FakeUngSakBackendClient({ fagsaker: [fagsak1] }));

    await userEvent.type(screen.getByRole('textbox', { name: 'Saksnummer eller fødselsnummer/D-nummer' }), '12345');
    await userEvent.click(screen.getByRole('button', { name: 'Søk' }));

    expect(await screen.findByText('Søket ga ingen treff')).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
