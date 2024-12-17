import { server } from '@k9-sak-web/gui/utils/test-helpers/mswUtils.js';
import { renderWithReactQueryClient } from '@k9-sak-web/gui/utils/test-helpers/reactQueryUtils.js';
import { act, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import MenyMarkerBehandling from './MenyMarkerBehandling';

describe('<MenyMarkerBehandling', () => {
  it('skal vise inputfelt for tekst gitt at checkbox er valgt', async () => {
    server.use(
      http.get('/k9/feature-toggle/toggles.json', () => {
        return HttpResponse.json([{ key: 'LOS_MARKER_BEHANDLING_SUBMIT', value: 'true' }]);
      }),
    );
    renderWithReactQueryClient(
      <MenyMarkerBehandling
        behandlingUuid="123"
        markerBehandling={() => null}
        lukkModal={vi.fn()}
        brukHastekøMarkering
        merknaderFraLos={null}
      />,
    );

    expect(screen.queryByLabelText('Kommentar')).toBe(null);
    await waitFor(() => expect(screen.getByLabelText('Behandlingen er hastesak')).not.toBeDisabled());
    await act(async () => {
      await userEvent.click(screen.getByLabelText('Behandlingen er hastesak'));
    });
    expect(screen.getByLabelText('Kommentar')).toBeInTheDocument();
  });
});
