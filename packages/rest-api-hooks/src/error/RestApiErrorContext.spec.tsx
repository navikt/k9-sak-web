import { render, screen } from '@testing-library/react';
import React, { useEffect } from 'react';
import useRestApiError from './useRestApiError';
import useRestApiErrorDispatcher from './useRestApiErrorDispatcher';
import { GlobalUnhandledErrorCatcher } from '@k9-sak-web/gui/app/errorhandling/GlobalUnhandledErrorCatcher.js';

const TestErrorMessage = () => {
  const { addErrorMessage } = useRestApiErrorDispatcher();
  useEffect(() => {
    addErrorMessage({ message: 'Feilmeldingstest 1' });
    addErrorMessage({ message: 'Feilmeldingstest 2' });
  }, []);

  const feilmeldinger = useRestApiError();
  return (
    <>
      {feilmeldinger.map(feil => (
        <span key={feil.errorId}>{feil.message}</span>
      ))}
    </>
  );
};

describe('<RestApiErrorContext>', () => {
  it('skal legge til feilmelding og så hente alle i kontekst', () => {
    render(
      <GlobalUnhandledErrorCatcher>
        <TestErrorMessage />
      </GlobalUnhandledErrorCatcher>,
    );
    expect(screen.getByText('Feilmeldingstest 1')).toBeInTheDocument();
    expect(screen.getByText('Feilmeldingstest 2')).toBeInTheDocument();
  });
});
