import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import MenyMarkerBehandling from './MenyMarkerBehandling';

describe('<MenyMarkerBehandling', () => {
  it('skal vise inputfelt for tekst gitt at checkbox er valgt', () => {
    render(<MenyMarkerBehandling behandlingUuid='123' markerBehandling={() => null} lukkModal={jest.fn()} brukHastekøMarkering />);
    expect(screen.queryByLabelText('Kommentar')).toBe(null);
    userEvent.click(screen.getByLabelText('Marker som hastesak'));
    expect(screen.getByLabelText('Kommentar')).toBeInTheDocument();
  });
});
