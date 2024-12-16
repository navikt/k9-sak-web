import { K9sakApiKeys, requestApi } from '@k9-sak-web/sak-app/src/data/k9sakApi';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import MenyMarkerBehandlingV2 from './MenyMarkerBehandling';

describe('<MenyMarkerBehandling', () => {
  it('skal vise inputfelt for tekst gitt at checkbox er valgt', async () => {
    requestApi.mock(K9sakApiKeys.FEATURE_TOGGLE, [
      {
        key: 'LOS_MARKER_BEHANDLING_SUBMIT',
        value: 'true',
      },
    ]);

    render(
      <MenyMarkerBehandlingV2
        behandlingUuid="123"
        markerBehandling={() => null}
        lukkModal={vi.fn()}
        brukHastekøMarkering
        merknaderFraLos={null}
      />,
    );
    expect(screen.queryByLabelText('Kommentar')).toBe(null);
    await act(async () => {
      await userEvent.click(screen.getByLabelText('Behandlingen er hastesak'));
    });

    expect(screen.getByLabelText('Kommentar')).toBeInTheDocument();
  });
});
