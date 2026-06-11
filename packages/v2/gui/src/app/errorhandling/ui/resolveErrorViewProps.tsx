import type { ReactNode } from 'react';
import { type ErrorFixAction, reloadAction } from './ErrorFixAction.js';
import { BodyLong, BodyShort } from '@navikt/ds-react';
import { ExtendedApiError } from '@k9-sak-web/backend/shared/errorhandling/ExtendedApiError.js';
import { resolveApiErrorViewProps } from './resolveApiErrorViewProps.js';
import { AuthAbortedError } from '@k9-sak-web/backend/shared/auth/AuthAbortedError.js';
import { EnterIcon } from '@navikt/aksel-icons';
import { AxiosError } from 'axios';
import { resolveAxiosErrorView } from './resolveAxiosErrorView.js';
import TimeoutError from '../legacycompat/TimeoutError.js';
import { resolveTimeoutErrorView } from './resolveTimeoutErrorView.js';
import { AppError } from '../AppError.js';

export type ErrorViewProps = Readonly<{
  error: Error;
  title: string;
  errorInfo: ReactNode; // Element returnert her må ikkje vere for avansert. (Skal passe inn i LocalAlert, etc)
  fixAction: ErrorFixAction;
}>;

const authAbortedViewProps = (error: AuthAbortedError): ErrorViewProps => {
  return {
    error,
    title: 'Innlogging avbrutt',
    errorInfo: (
      <>
        <BodyLong>Automatisk innlogging ble avbrutt før den var fullført.</BodyLong>
        <BodyShort>Mulige årsaker:</BodyShort>
        <ul>
          <li>Du lukket popupvinduet før innlogging var ferdig</li>
          <li>Nettleser blokkerte automatisk åpning av popup vinduet for innlogging</li>
          <li>Teknisk feil i autentiseringsflyt</li>
        </ul>
      </>
    ),
    fixAction: {
      label: 'Logg inn',
      icon: <EnterIcon />,
      info: (
        <BodyShort>
          Hvis du ønsker å logge inn, prøv på nytt med <i>Logg inn</i> knappen.
        </BodyShort>
      ),
      href: `${error.retryURL ?? '/'}`,
    },
  };
};

// Utleder tekst og handling for å hjelpe bruker handtere ulike feil som kan oppstå.
// Returverdi passer inn i diverse gui komponenter for visning av feil.
export const resolveErrorViewProps = (error: Error): ErrorViewProps => {
  if (error instanceof ExtendedApiError) {
    return resolveApiErrorViewProps(error);
  }

  const apiError = ExtendedApiError.findInError(error);
  if (apiError != null) {
    return { ...resolveApiErrorViewProps(apiError), error };
  }

  if (error instanceof AxiosError) {
    return resolveAxiosErrorView(error);
  }
  if (error instanceof TimeoutError) {
    return resolveTimeoutErrorView(error);
  }
  if (error instanceof AuthAbortedError) {
    return authAbortedViewProps(error);
  }
  let title = 'Uventet feil';
  if (error instanceof AppError && error.title != null) {
    title = error.title;
  } else if (error.message.length < 40) {
    title = error.message;
  }

  return {
    error,
    title,
    errorInfo: <BodyLong>{error.message}</BodyLong>,
    fixAction: reloadAction,
  };
};
