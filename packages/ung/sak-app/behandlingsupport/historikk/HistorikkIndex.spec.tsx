import { kjønn } from '@k9-sak-web/backend/k9sak/kodeverk/Kjønn.js';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { UngSakApiKeys, requestApi } from '../../data/ungsakApi';
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
    requestApi.mock(UngSakApiKeys.INIT_FETCH_TILBAKE, {});
    requestApi.mock(UngSakApiKeys.KODEVERK, {});
    requestApi.mock(UngSakApiKeys.KODEVERK_TILBAKE, {});
    requestApi.mock(UngSakApiKeys.KODEVERK_KLAGE, {});
    requestApi.mock(UngSakApiKeys.HISTORY_TILBAKE, []);
    requestApi.mock(UngSakApiKeys.HISTORY_UNGSAK, [
      {
        historikkinnslagUuid: '801e6e32-e3c4-4ec2-b4c5-3f3c7d1fd47f',
        behandlingUuid: '5e0dfaff-3cf6-4877-860f-1b86b4eca51e',
        aktør: {
          type: { kode: 'VL', kodeverk: 'HISTORIKK_AKTOER' },
          ident: null,
        },
        skjermlenke: { kode: 'VEDTAK', kodeverk: 'SKJERMLENKE_TYPE' },
        opprettetTidspunkt: '2025-06-06T11:28:45.63222',
        dokumenter: [],
        tittel: null,
        linjer: [{ type: 'TEKST', tekst: 'Vedtak er fattet: Innvilget.' }],
      },
      {
        historikkinnslagUuid: 'f402c588-ef15-438f-bf07-9b4325ed63e3',
        behandlingUuid: 'b786e660-d2e0-4789-a28a-b58d34e2c3d5',
        aktør: {
          type: { kode: 'VL', kodeverk: 'HISTORIKK_AKTOER' },
          ident: null,
        },
        skjermlenke: null,
        opprettetTidspunkt: '2025-06-05T11:28:46.28268',
        dokumenter: [],
        tittel: 'Revurdering opprettet',
        linjer: [{ type: 'TEKST', tekst: 'Kontroll av registerinntekt.' }],
      },
    ]);

    render(
      <MemoryRouter>
        <HistorikkIndex saksnummer="12345" behandlingId={1} behandlingVersjon={2} kjønn={kjønn.MANN} />
      </MemoryRouter>,
    );

    expect(screen.getByText(/06.06.2025/i)).toBeInTheDocument();
    expect(screen.getByText(/05.06.2025/i)).toBeInTheDocument();
  });
});
