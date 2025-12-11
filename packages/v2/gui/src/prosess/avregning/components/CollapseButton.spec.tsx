import { render, screen } from '@testing-library/react';
import { CollapseButton } from './CollapseButton';

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
    render(<CollapseButton {...props} />);

    expect(screen.getByRole('button', { name: 'Vis færre detaljer Ekspandert' })).toBeInTheDocument();
    expect(screen.getByTitle('Ekspandert')).toBeInTheDocument();
  });

  it('skal vise CollapseButton med NedChevron og tilsvarende tekst når showDetails er false', () => {
    const props = {
      ...mockProps,
      showDetails: false,
    };
    render(<CollapseButton {...props} />);
    expect(screen.getByRole('button', { name: 'Vis flere detaljer Lukket' })).toBeInTheDocument();
    expect(screen.getByTitle('Lukket')).toBeInTheDocument();
  });
});
