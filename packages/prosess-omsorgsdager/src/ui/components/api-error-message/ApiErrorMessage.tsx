import { Alert } from '@navikt/ds-react';
import React from 'react';

interface ApiErrorMessageProps {
  response: Response;
}

const ApiErrorMessage: React.FunctionComponent<ApiErrorMessageProps> = ({ response }) => (
  <Alert size="small" variant="error">
    Det har oppstått en teknisk feil.
    <br />
    Status: {response.status} {response.statusText}
  </Alert>
);

export default ApiErrorMessage;
