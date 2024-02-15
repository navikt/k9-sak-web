import { renderWithIntl } from '@fpsak-frontend/utils-test';
import { screen } from '@testing-library/react';
import React from 'react';
import messages from '../../i18n/nb_NO.json';
import TabMeny from './TabMeny';

describe('<TabMeny>', () => {
  it('skal vise tabs der Historikk er valgt og Send melding ikke er valgbar', () => {
    const tabs = [
      {
        getSvg: () => <div />,
        tooltip: 'Historikk',
        isActive: true,
        isDisabled: false,
        antallUlesteNotater: 0,
      },
      {
        getSvg: () => <div />,
        tooltip: 'Send melding',
        isActive: false,
        isDisabled: true,
        antallUlesteNotater: 0,
      },
    ];

    renderWithIntl(<TabMeny tabs={tabs} onClick={() => undefined} />, { messages });
    expect(screen.getByLabelText('Historikk')).toBeInTheDocument();
    expect(screen.getByLabelText('Historikk')).toHaveClass('active');
    expect(screen.getByLabelText('Send melding')).toBeInTheDocument();
    expect(screen.getByLabelText('Send melding')).toBeDisabled();
  });
});
