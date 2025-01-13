import { render, screen } from '@testing-library/react';

import ErrorMessageDetailsModal from './ErrorMessageDetailsModal';

describe('<ErrorMessageDetailsModal>', () => {
  it('skal vise feildetaljer', () => {
    const errorDetails = {
      feilmelding: 'Dette er feil',
      url: 'test',
    };
    render(<ErrorMessageDetailsModal showModal closeModalFn={vi.fn()} errorDetails={errorDetails} />, {});

    expect(screen.getByText('Feilmelding:')).toBeInTheDocument();
    expect(screen.getByText('Url:')).toBeInTheDocument();
    expect(screen.getByText('Dette er feil')).toBeInTheDocument();
    expect(screen.getByText('test')).toBeInTheDocument();
  });
});
