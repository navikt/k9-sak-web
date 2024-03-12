import { renderWithIntl } from '@fpsak-frontend/utils-test/test-utils';
import { screen } from '@testing-library/react';
import React from 'react';
import messages from '../../i18n/nb_NO.json';
import CollapseButton from './CollapseButton';

describe('<CollapseButton>', () => {
  const mockProps = {
    toggleDetails: vi.fn(),
    mottakerIndex: 1,
  };
  it('skal vise CollapseButton med OppChevron og tilsvarende tekst når showDetails er true', () => {
    const props = {
      ...mockProps,
      showDetails: true,
    };
    const { container } = renderWithIntl(<CollapseButton {...props} />, { messages });

    expect(screen.getByRole('button', { name: 'Vis færre detaljer' })).toBeInTheDocument();
    expect(container.getElementsByClassName('chevron--opp').length).toBe(1);
  });

  it('skal vise CollapseButton med NedChevron og tilsvarende tekst når showDetails er false', () => {
    const props = {
      ...mockProps,
      showDetails: false,
    };
    const { container } = renderWithIntl(<CollapseButton {...props} />, { messages });
    expect(screen.getByRole('button', { name: 'Vis flere detaljer' })).toBeInTheDocument();
    expect(container.getElementsByClassName('chevron--ned').length).toBe(1);
  });
});
