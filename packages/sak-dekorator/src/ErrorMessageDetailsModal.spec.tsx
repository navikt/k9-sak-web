import { renderWithIntl } from '@fpsak-frontend/utils-test';
import { screen } from '@testing-library/react';
import React from 'react';
import sinon from 'sinon';
import messages from '../i18n/nb_NO.json';
import ErrorMessageDetailsModal from './ErrorMessageDetailsModal';

describe('<ErrorMessageDetailsModal>', () => {
  it('skal vise feildetaljer', () => {
    const errorDetails = {
      feilmelding: 'Dette er feil',
      url: 'test',
    };
    renderWithIntl(<ErrorMessageDetailsModal showModal closeModalFn={sinon.spy()} errorDetails={errorDetails} />, {
      messages,
    });

    expect(screen.getByText('Feilmelding:')).toBeInTheDocument();
    expect(screen.getByText('Url:')).toBeInTheDocument();
    expect(screen.getByText('Dette er feil')).toBeInTheDocument();
    expect(screen.getByText('test')).toBeInTheDocument();
  });
});
