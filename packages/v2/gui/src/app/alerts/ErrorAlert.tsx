import { ExtendedApiError } from '@k9-sak-web/backend/shared/instrumentation/v2/ExtendedApiError.js';
import { Alert, BodyLong, Heading } from '@navikt/ds-react';
import { NavCallIdEncouragementMsg } from './NavCallIdEncouragementMsg.js';
import type { ErrorWithAlertInfo } from './AlertInfo.js';
import { ErrorIdEncouragementMsg } from './ErrorIdEncouragementMsg.js';
import GeneralAsyncError from './GeneralAsyncError.js';
import type { PropsWithChildren } from 'react';
import { SharedFeilDtoError } from '@k9-sak-web/backend/shared/errorhandling/SharedFeilDtoError.js';

export interface ErrorAlertProps {
  readonly error: ErrorWithAlertInfo;
  readonly onClose: () => void;
}

const MsgHeading = ({ children }: PropsWithChildren<NonNullable<unknown>>) => (
  <Heading spacing size="small" level="3">
    {children}
  </Heading>
);

const GeneralErrorMsg = ({ error }: { readonly error: ErrorWithAlertInfo }) => (
  <>
    <MsgHeading>Uventet feil: {error.name}</MsgHeading>
    <BodyLong>{error.message}</BodyLong>
    <ErrorIdEncouragementMsg errorId={error.errorId} errorName={error.name} />
  </>
);

const GeneralAsyncErrorMsg = ({ error }: { readonly error: GeneralAsyncError }) => (
  <>
    <MsgHeading>Bakgrunnsprosess feilet</MsgHeading>
    <BodyLong>{error.message}</BodyLong>
    <BodyLong>
      Det hjelper kanskje å{' '}
      <a href="#" onClick={() => window.location.reload()}>
        laste siden på nytt{' '}
      </a>
      og prøve igjen.
    </BodyLong>
    <ErrorIdEncouragementMsg errorId={error.errorId} errorName={error.name} />
  </>
);

const ApiErrorMsg = ({ error }: { readonly error: ExtendedApiError }) => (
  <>
    <MsgHeading>Server rapporterte feil:</MsgHeading>
    <BodyLong>
      {error.name} <i>({error.url})</i>
    </BodyLong>
    <BodyLong>{error.bodyFeilmelding}</BodyLong>
    <NavCallIdEncouragementMsg navCallId={error.navCallid} statusCode={error.status} />
  </>
);

const SharedFeilDtoErrorMsg = ({ error }: { readonly error: SharedFeilDtoError }) => {
  if (error.erValideringsfeil) {
    return (
      <>
        <MsgHeading>Valideringsfeil på server:</MsgHeading>
        <BodyLong>{error.errorData?.feilmelding}</BodyLong>
        <BodyLong size="small">
          Korriger inndata og prøv igjen. Meld inn i porten hvis det ikke løser problemet.&nbsp;
          <NavCallIdEncouragementMsg navCallId={error.navCallid} statusCode={error.status} />
        </BodyLong>
      </>
    );
  }
  // XXX Legg til handtering av error.erGenerellFeil etc her etter kvart
  return <ApiErrorMsg error={error} />;
};

const ErrorMsg = ({ error }: Pick<ErrorAlertProps, 'error'>) => {
  if (error instanceof SharedFeilDtoError) {
    return <SharedFeilDtoErrorMsg error={error} />;
  }
  // XXX Legg til handtering av evt andre spesifikke ExtendedApiError subklasser her
  if (error instanceof ExtendedApiError) {
    return <ApiErrorMsg error={error} />;
  }
  if (error instanceof GeneralAsyncError) {
    return <GeneralAsyncErrorMsg error={error} />;
  }
  // XXX Legg til handtering av evt andre spesifikke Error subklasser her
  return <GeneralErrorMsg error={error} />;
};

export const ErrorAlert = ({ error, onClose }: ErrorAlertProps) => (
  <Alert size="small" variant="error" onClose={onClose} closeButton contentMaxWidth={false}>
    <ErrorMsg error={error} />
  </Alert>
);
