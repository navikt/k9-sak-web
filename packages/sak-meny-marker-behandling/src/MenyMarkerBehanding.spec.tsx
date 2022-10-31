import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import MenyMarkerBehandling from './MenyMarkerBehandling';

describe('<MenyMarkerBehandling', () => {
  it('skal vise inputfelt for tekst gitt at checkbox er valgt', () => {
    render(
      <MenyMarkerBehandling
        behandlingUuid="123"
        markerBehandling={() => null}
        lukkModal={jest.fn()}
        brukHastekøMarkering
        merknaderFraLos={null}
      />,
    );
    expect(screen.queryByLabelText('Kommentar')).toBe(null);
    userEvent.click(screen.getByLabelText('Behandlingen er hastesak'));
    expect(screen.getByLabelText('Kommentar')).toBeInTheDocument();
  });
});
