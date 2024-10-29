import { render, screen } from '@testing-library/react';
import OverstyrBekreftKnappPanel from './OverstyrBekreftKnappPanel';

describe('<OverstyrBekreftKnappPanel>', () => {
  it('skal rendre submit-knapp når en ikke er i readonly-modus', () => {
    render(<OverstyrBekreftKnappPanel submitting={false} pristine={false} overrideReadOnly={false} />);

    expect(screen.getByRole('button', { name: 'Bekreft overstyring' })).toBeInTheDocument();
  });

  it('skal ikke vise submit-knapp når en er i readonly-modus', () => {
    render(<OverstyrBekreftKnappPanel submitting={false} pristine={false} overrideReadOnly />);
    expect(screen.queryByRole('button', { name: 'Bekreft overstyring' })).not.toBeInTheDocument();
  });
});
