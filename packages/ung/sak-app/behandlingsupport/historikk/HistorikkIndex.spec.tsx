import HistorikkAktor from '@fpsak-frontend/kodeverk/src/historikkAktor';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { UngSakApiKeys, requestApi } from '../../data/ungsakApi';
import HistorikkIndex from './HistorikkIndex';

vi.mock('react-router-dom', async () => {
  const actual = (await vi.importActual('react-router-dom')) as Record<string, unknown>;
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
    requestApi.mock(UngSakApiKeys.KODEVERK, {});
    requestApi.mock(UngSakApiKeys.HISTORY_K9SAK, [
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

    render(
      <MemoryRouter>
        <HistorikkIndex saksnummer="12345" behandlingId={1} behandlingVersjon={2} />
      </MemoryRouter>,
    );

    expect(screen.getByText(/06.01.2019/i)).toBeInTheDocument();
    expect(screen.getByText(/01.01.2019/i)).toBeInTheDocument();
  });
});
