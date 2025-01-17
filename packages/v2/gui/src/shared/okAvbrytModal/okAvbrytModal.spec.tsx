import { render, screen } from '@testing-library/react';
import OkAvbrytModal from './OkAvbrytModal';

describe('<OkAvbrytModal>', () => {
  it('skal rendre modal', () => {
    render(<OkAvbrytModal okButtonText="OK" showModal cancel={vi.fn()} submit={vi.fn()} />);

    expect(screen.getByRole('dialog', { name: 'Bekreft eller avbryt' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'OK' })).toBeInTheDocument();
  });
});
