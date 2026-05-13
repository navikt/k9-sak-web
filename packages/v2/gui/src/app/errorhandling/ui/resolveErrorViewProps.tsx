import { AdditionalInfoError } from '../legacycompat/AdditionalInfoError.js';
import type { ReactNode } from 'react';
import { type ErrorHandlingWizardFixAction, reloadAction } from './ErrorHandlingWizard.js';
import { BodyLong, BodyShort, VStack } from '@navikt/ds-react';
import { ExtendedApiError } from '@k9-sak-web/backend/shared/errorhandling/ExtendedApiError.js';
import { resolveApiErrorViewProps } from './resolveApiErrorViewProps.js';
import { AuthAbortedError } from '@k9-sak-web/backend/shared/auth/AuthAbortedError.js';
import { EnterIcon } from '@navikt/aksel-icons';
import { AxiosError } from 'axios';
import { resolveAxiosErrorView } from './resolveAxiosErrorView.js';
import TimeoutError from '../legacycompat/TimeoutError.js';
import { resolveTimeoutErrorView } from './resolveTimeoutErrorView.js';

export type ErrorViewProps = Readonly<{
  title: string;
  errorInfo: ReactNode; // Element returnert her må ikkje vere for avansert. (Skal passe inn i LocalAlert, etc)
  fixAction: ErrorHandlingWizardFixAction;
}>;

// Legacy api feil blir AdditionalInfoError av og til
const additionalInfoListing = (error: AdditionalInfoError): ReactNode => {
  return (
    <VStack gap="space-4">
      {Object.entries(error.additionalInfo ?? []).map(([key, val]) => {
        return (
          <BodyLong key={key} size="small">
            <i>{key}</i>: {typeof val == 'string' ? val : String(val)}
          </BodyLong>
        );
      })}
    </VStack>
  );
};

const authAbortedViewProps = (error: AuthAbortedError): ErrorViewProps => {
  return {
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
  let title = 'Uventet feil';
  let errorInfo: ReactNode = <BodyLong>{error.message}</BodyLong>;
  let fixAction = reloadAction;

  if (error instanceof ExtendedApiError) {
    ({ title, errorInfo, fixAction } = resolveApiErrorViewProps(error));
  } else {
    const apiError = ExtendedApiError.findInError(error);
    if (apiError != null) {
      ({ title, errorInfo, fixAction } = resolveApiErrorViewProps(apiError));
    }
  }

  if (error instanceof AxiosError) {
    ({ title, errorInfo, fixAction } = resolveAxiosErrorView(error));
  }
  if (error instanceof TimeoutError) {
    ({ title, errorInfo, fixAction } = resolveTimeoutErrorView(error));
  }

  if (error instanceof AdditionalInfoError && error.additionalInfo != null) {
    errorInfo = (
      <>
        {errorInfo}
        {additionalInfoListing(error)}
      </>
    );
  }

  if (error instanceof AuthAbortedError) {
    ({ title, errorInfo, fixAction } = authAbortedViewProps(error));
  }

  return {
    title,
    errorInfo,
    fixAction,
  };
};

// Viss nokon av properties i existing ikkje er satt, utled dei med resolveErrorViewProps og returner komplett ErrorViewProps
export const resolveMissingErrorViewProps = (existing: Partial<ErrorViewProps>, error: Error): ErrorViewProps => {
  const { title, errorInfo, fixAction } = existing;
  if (title != null && errorInfo != null && fixAction != null) {
    return { title, errorInfo, fixAction };
  } else {
    const resolved = resolveErrorViewProps(error);
    return {
      title: title ?? resolved.title,
      errorInfo: errorInfo ?? resolved.errorInfo,
      fixAction: fixAction ?? resolved.fixAction,
    };
  }
};
