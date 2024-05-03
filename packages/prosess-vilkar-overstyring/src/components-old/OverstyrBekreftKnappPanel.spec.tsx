import { renderWithIntl } from '@k9-sak-web/utils-test/test-utils';
import { screen } from '@testing-library/react';
import React from 'react';
import messages from '../../i18n/nb_NO.json';
import OverstyrBekreftKnappPanel from './OverstyrBekreftKnappPanel';

describe('<OverstyrBekreftKnappPanel>', () => {
  it('skal rendre submit-knapp når en ikke er i readonly-modus', () => {
    renderWithIntl(<OverstyrBekreftKnappPanel submitting={false} pristine={false} overrideReadOnly={false} />, {
      messages,
    });
    expect(screen.getByRole('button', { name: 'Bekreft overstyring' })).toBeInTheDocument();
  });

  it('skal ikke vise submit-knapp når en er i readonly-modus', () => {
    renderWithIntl(<OverstyrBekreftKnappPanel submitting={false} pristine={false} overrideReadOnly />, { messages });

    expect(screen.queryByRole('button', { name: 'Bekreft overstyring' })).not.toBeInTheDocument();
  });
});
