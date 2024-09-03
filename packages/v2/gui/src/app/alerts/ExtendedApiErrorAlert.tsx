import type { ExtendedApiError } from '@k9-sak-web/backend/shared/instrumentation/ExtendedApiError.js';
import { Alert, BodyLong, Heading } from '@navikt/ds-react';
import { NavCallIdEncouragementMsg } from './NavCallIdEncouragementMsg.js';
import { K9SakApiError } from '@k9-sak-web/backend/k9sak/errorhandling/K9SakApiError.js';

export interface ExtendedApiErrorAlertProps {
  readonly error: ExtendedApiError;
  readonly onClose: () => void;
}

const GeneralErrorMsg = ({ error }: Pick<ExtendedApiErrorAlertProps, 'error'>) => (
  <>
    <Heading spacing size="small" level="3">
      Server rapporterte feil:{' '}
    </Heading>
    <BodyLong>
      {error.name} <i>({error.url})</i>
    </BodyLong>
    <BodyLong>{error.bodyFeilmelding}</BodyLong>
    <NavCallIdEncouragementMsg navCallId={error.navCallid} statusCode={error.status} />
  </>
);

const K9SakErrorMsg = ({ error }: { readonly error: K9SakApiError }) => {
  if (error.erValideringsfeil) {
    return (
      <>
        <Heading spacing size="small" level="3">
          Valideringsfeil på server:
        </Heading>
        <BodyLong>{error.errorData?.feilmelding}</BodyLong>
        <BodyLong size="small">
          Korriger inndata og prøv igjen. Meld inn i porten hvis det ikke løser problemet.&nbsp;
          <NavCallIdEncouragementMsg navCallId={error.navCallid} statusCode={error.status} />
        </BodyLong>
      </>
    );
  }
  // XXX Legg til handtering av error.erGenerellFeil etc her etter kvart
  return <GeneralErrorMsg error={error} />;
};

const ErrorMsg = ({ error }: Pick<ExtendedApiErrorAlertProps, 'error'>) => {
  if (error instanceof K9SakApiError) {
    return <K9SakErrorMsg error={error} />;
  }
  // XXX Legg til handtering av evt andre spesifikke ExtendedApiError subklasser her
  return <GeneralErrorMsg error={error} />;
};

export const ExtendedApiErrorAlert = ({ error, onClose }: ExtendedApiErrorAlertProps) => (
  <Alert size="small" variant="error" onClose={onClose} closeButton contentMaxWidth={false}>
    <ErrorMsg error={error} />
  </Alert>
);
