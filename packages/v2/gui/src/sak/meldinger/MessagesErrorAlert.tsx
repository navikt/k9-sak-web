import { Alert } from '@navikt/ds-react';
import type { ErrorFallbackProps } from '../../app/feilmeldinger/ErrorBoundary.js';

export const MessagesErrorAlert = ({ sentryId }: ErrorFallbackProps) => {
  return (
    <Alert variant="error">
      Feil ved henting av maler. Brevsending ikke mulig {sentryId != null ? <small>(feil id {sentryId})</small> : null}
    </Alert>
  );
};
