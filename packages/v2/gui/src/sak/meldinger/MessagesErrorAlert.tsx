import { Alert, Button } from '@navikt/ds-react';
import type { ErrorBoundaryFallbackProps } from '../../app/errorhandling/boundary/ErrorBoundary.js';
import { useQueryErrorResetBoundary } from '@tanstack/react-query';

export const MessagesErrorAlert = ({ caught, reset }: ErrorBoundaryFallbackProps) => {
  const { reset: queryReset } = useQueryErrorResetBoundary();
  const retry = () => {
    queryReset(); // Try restarting any queries gone wrong
    reset();
  };
  return (
    <Alert variant="error">
      Feil ved henting av maler. Brevsending ikke mulig
      <br />
      <small>(feil id {caught.errorId})</small>
      <br />
      <Button variant="tertiary" size="small" onClick={retry}>
        Prøv igjen
      </Button>
    </Alert>
  );
};
