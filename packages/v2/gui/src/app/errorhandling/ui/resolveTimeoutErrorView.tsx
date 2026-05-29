import { TimeoutError } from '@k9-sak-web/gui/app/errorhandling/legacycompat/TimeoutError.js';
import { BodyLong } from '@navikt/ds-react';
import type { ErrorViewProps } from './resolveErrorViewProps.js';
import { reloadAction } from './ErrorHandlingWizard.js';

/**
 * Utled visningstekst for TimeoutError frå rest-api (polling som har overskrede maks tal forsøk).
 * Reimplementerer legacy logikk frå formatErrorMessage for EventType.POLLING_TIMEOUT.
 */
export const resolveTimeoutErrorView = (error: TimeoutError): ErrorViewProps => ({
  error,
  title: 'Dette tok for lang tid',
  errorInfo: <BodyLong>Systemet har brukt for lang tid på å svare deg.</BodyLong>,
  fixAction: reloadAction,
});
