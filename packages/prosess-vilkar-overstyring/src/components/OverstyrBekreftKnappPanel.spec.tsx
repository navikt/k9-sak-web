import { renderWithIntl } from '@fpsak-frontend/utils-test';
import { screen } from '@testing-library/react';
import React from 'react';
import OverstyrBekreftKnappPanel from './OverstyrBekreftKnappPanel';

describe('<OverstyrBekreftKnappPanel>', () => {
  it('skal rendre submit-knapp når en ikke er i readonly-modus', () => {
    renderWithIntl(<OverstyrBekreftKnappPanel submitting={false} pristine={false} overrideReadOnly={false} />);

    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByRole('button')).not.toBeDisabled();
  });

  it('skal ikke vise submit-knapp når en er i readonly-modus', () => {
    renderWithIntl(<OverstyrBekreftKnappPanel submitting={false} pristine={false} overrideReadOnly />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
