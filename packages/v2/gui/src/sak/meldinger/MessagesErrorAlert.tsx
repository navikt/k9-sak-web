import { Alert, Button } from '@navikt/ds-react';
import type { ErrorFallbackProps } from '../../app/feilmeldinger/ErrorBoundary.js';
import { useQueryErrorResetBoundary } from '@tanstack/react-query';

export const MessagesErrorAlert = ({ sentryId, reset }: ErrorFallbackProps) => {
  const { reset: queryReset } = useQueryErrorResetBoundary();
  const retry = () => {
    queryReset(); // Try restarting any queries gone wrong
    reset();
  };
  return (
    <Alert variant="error">
      Feil ved henting av maler. Brevsending ikke mulig
      {sentryId != null ? (
        <>
          <br />
          <small>(feil id {sentryId})</small>
        </>
      ) : null}
      <br />
      <Button variant="tertiary" size="small" onClick={retry}>
        Prøv igjen
      </Button>
    </Alert>
  );
};
