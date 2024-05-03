import { renderWithIntl } from '@k9-sak-web/utils-test/test-utils';
import { screen } from '@testing-library/react';
import React from 'react';
import messages from '../i18n/nb_NO.json';
import ErrorMessageDetailsModal from './ErrorMessageDetailsModal';

describe('<ErrorMessageDetailsModal>', () => {
  it('skal vise feildetaljer', () => {
    const errorDetails = {
      feilmelding: 'Dette er feil',
      url: 'test',
    };
    renderWithIntl(<ErrorMessageDetailsModal showModal closeModalFn={vi.fn()} errorDetails={errorDetails} />, {
      messages,
    });

    expect(screen.getByText('Feilmelding:')).toBeInTheDocument();
    expect(screen.getByText('Url:')).toBeInTheDocument();
    expect(screen.getByText('Dette er feil')).toBeInTheDocument();
    expect(screen.getByText('test')).toBeInTheDocument();
  });
});
