import FeatureTogglesContext from '@k9-sak-web/gui/utils/featureToggles/FeatureTogglesContext.js';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MenyMarkerBehandlingV2 from './MenyMarkerBehandling';

describe('<MenyMarkerBehandling', () => {
  it('skal vise inputfelt for tekst gitt at checkbox er valgt', async () => {
    render(
      <FeatureTogglesContext.Provider value={{ LOS_MARKER_BEHANDLING_SUBMIT: true }}>
        <MenyMarkerBehandlingV2
          behandlingUuid="123"
          markerBehandling={vi.fn()}
          lukkModal={vi.fn()}
          brukHastekøMarkering
          merknaderFraLos={{}}
        />
      </FeatureTogglesContext.Provider>,
    );
    expect(screen.queryByLabelText('Kommentar')).toBe(null);
    await act(async () => {
      await userEvent.click(screen.getByLabelText('Behandlingen er hastesak'));
    });

    expect(screen.getByLabelText('Kommentar')).toBeInTheDocument();
  });
});
