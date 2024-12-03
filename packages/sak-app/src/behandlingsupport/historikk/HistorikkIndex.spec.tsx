import HistorikkAktor from '@fpsak-frontend/kodeverk/src/historikkAktor';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { K9sakApiKeys, requestApi } from '../../data/k9sakApi';
import HistorikkIndex from './HistorikkIndex';

vi.mock('react-router', async () => {
  const actual = (await vi.importActual('react-router')) as Record<string, unknown>;
  return {
    ...actual,
    useLocation: () => ({
      pathname: 'test',
      search: 'test',
      state: {},
      hash: 'test',
    }),
  };
});

describe('<HistorikkIndex>', () => {
  it('skal slå sammen og sortere historikk for k9sak, tilbake og klage', () => {
    requestApi.mock(K9sakApiKeys.INIT_FETCH_TILBAKE, {});
    requestApi.mock(K9sakApiKeys.INIT_FETCH_KLAGE, {});
    requestApi.mock(K9sakApiKeys.KODEVERK, {});
    requestApi.mock(K9sakApiKeys.KODEVERK_TILBAKE, {});
    requestApi.mock(K9sakApiKeys.KODEVERK_KLAGE, {});
    requestApi.mock(K9sakApiKeys.HISTORY_K9SAK, [
      {
        opprettetTidspunkt: '2019-01-01',
        historikkinnslagDeler: [{ skjermlenke: '123' }],
        type: {
          kode: 'FORSLAG_VEDTAK',
        },
        aktoer: { kode: HistorikkAktor.VEDTAKSLOSNINGEN },
      },
      {
        opprettetTidspunkt: '2019-01-06',
        historikkinnslagDeler: [{ skjermlenke: '123' }],
        type: {
          kode: 'FORSLAG_VEDTAK',
        },
        aktoer: { kode: HistorikkAktor.VEDTAKSLOSNINGEN },
      },
    ]);
    requestApi.mock(K9sakApiKeys.HISTORY_TILBAKE, [
      {
        opprettetTidspunkt: '2019-01-04',
        historikkinnslagDeler: [{ skjermlenke: '123' }],
        type: {
          kode: 'FORSLAG_VEDTAK',
        },
        aktoer: { kode: HistorikkAktor.VEDTAKSLOSNINGEN },
      },
    ]);
    requestApi.mock(K9sakApiKeys.HISTORY_KLAGE, [
      {
        opprettetTidspunkt: '2018-01-04',
        historikkinnslagDeler: [{ skjermlenke: '123' }],
        type: {
          kode: 'FORSLAG_VEDTAK',
        },
        aktoer: { kode: HistorikkAktor.VEDTAKSLOSNINGEN },
      },
    ]);

    render(
      <MemoryRouter>
        <HistorikkIndex saksnummer="12345" behandlingId={1} behandlingVersjon={2} />
      </MemoryRouter>,
    );

    expect(screen.getByText(/06.01.2019/i)).toBeInTheDocument();
    expect(screen.getByText(/04.01.2019/i)).toBeInTheDocument();
    expect(screen.getByText(/01.01.2019/i)).toBeInTheDocument();
    expect(screen.getByText(/04.01.2018/i)).toBeInTheDocument();
  });
});
