import { renderWithIntl } from '@fpsak-frontend/utils-test/test-utils';
import { screen } from '@testing-library/react';

import React from 'react';
import messages from '../../i18n/nb_NO.json';
import AvregningSummary from './AvregningSummary';

describe('<AvregningSummary>', () => {
  const mockProps = {
    fom: '2018-01-01',
    tom: '2018-07-07',
    feilutbetaling: 15000,
    etterbetaling: 0,
    inntrekk: 20000,
  };

  it('skal vise AvregningSummary', () => {
    const props = {
      ...mockProps,
      ingenPerioderMedAvvik: false,
    };
    renderWithIntl(<AvregningSummary {...props} />, { messages });

    expect(screen.getByText('01.01.2018 - 07.07.2018')).toBeInTheDocument();
    expect(screen.getByText('Etterbetaling:')).toBeInTheDocument();
    expect(screen.getByText('Feilutbetaling:')).toBeInTheDocument();
    expect(screen.getByText('Inntrekk:')).toBeInTheDocument();
  });

  it('skal vise melding ingen perioder med avvik', () => {
    const props = {
      ...mockProps,
      ingenPerioderMedAvvik: true,
    };
    renderWithIntl(<AvregningSummary {...props} />, { messages });
    expect(screen.getByText('Bruker')).toBeInTheDocument();
    expect(screen.getByText('Ingen periode med avvik')).toBeInTheDocument();
  });
});
