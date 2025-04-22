import FeatureTogglesContext from '@k9-sak-web/gui/featuretoggles/FeatureTogglesContext.js';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MenyMarkerBehandling from './MenyMarkerBehandling';
import { prodFeatureToggles } from '@k9-sak-web/gui/featuretoggles/prodFeatureToggles.js';

describe('<MenyMarkerBehandling', () => {
  it('skal vise inputfelt for tekst gitt at checkbox er valgt', async () => {
    render(
      <FeatureTogglesContext.Provider value={{ ...prodFeatureToggles, LOS_MARKER_BEHANDLING_SUBMIT: true }}>
        <MenyMarkerBehandling
          behandlingUuid="123"
          markerBehandling={() => null}
          lukkModal={vi.fn()}
          brukHastekøMarkering
          merknaderFraLos={null}
        />
      </FeatureTogglesContext.Provider>,
    );

    expect(screen.queryByLabelText('Kommentar')).toBe(null);
    await waitFor(() => expect(screen.getByLabelText('Behandlingen er hastesak')).not.toBeDisabled());
    await act(async () => {
      await userEvent.click(screen.getByLabelText('Behandlingen er hastesak'));
    });
    expect(screen.getByLabelText('Kommentar')).toBeInTheDocument();
  });
});
