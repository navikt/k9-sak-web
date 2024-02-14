import { renderWithIntl } from '@fpsak-frontend/utils-test';
import { screen } from '@testing-library/react';
import React from 'react';
import messages from '../i18n/nb_NO.json';
import DataFetchPendingModal from './DataFetchPendingModal';

describe('<DataFetchPendingModal>', () => {
  it('skal rendre modal når timer er gått ut', async () => {
    renderWithIntl(<DataFetchPendingModal pendingMessage="test" />, { messages });
    expect(
      await screen.findByText('Løsningen jobber med behandlingen...', undefined, {
        timeout: 3000,
      }),
    ).toBeInTheDocument();
  });

  it('skal ikke rendre modal før timer har gått ut', () => {
    renderWithIntl(<DataFetchPendingModal pendingMessage="test" />, { messages });
    expect(screen.queryByText('Løsningen jobber med behandlingen...', undefined)).not.toBeInTheDocument();
  });
});
