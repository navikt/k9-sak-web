import { Alert, Button } from '@navikt/ds-react';
import type { ErrorBoundaryFallbackProps } from '../../app/errorhandling/boundary/ErrorBoundary.js';
import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import { sentryReportedErrorIdLookup } from '../../app/errorhandling/sentry.js';

export const MessagesErrorAlert = ({ error, reset }: ErrorBoundaryFallbackProps) => {
  const { reset: queryReset } = useQueryErrorResetBoundary();
  const retry = () => {
    queryReset(); // Try restarting any queries gone wrong
    reset();
  };
  const sentryId = sentryReportedErrorIdLookup.get(error) ?? '';
  return (
    <Alert variant="error">
      Feil ved henting av maler. Brevsending ikke mulig
      <br />
      <small>(sentry id {sentryId})</small>
      <br />
      <Button variant="tertiary" size="small" onClick={retry}>
        Prøv igjen
      </Button>
    </Alert>
  );
};
