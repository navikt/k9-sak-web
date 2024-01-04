import { AlertStripeFeil } from 'nav-frontend-alertstriper';
import React from 'react';

interface ApiErrorMessageProps {
  response: Response;
}

const ApiErrorMessage: React.FunctionComponent<ApiErrorMessageProps> = ({ response }) => (
  <AlertStripeFeil>
    Det har oppstått en teknisk feil.
    <br />
    Status: {response.status} {response.statusText}
  </AlertStripeFeil>
);

export default ApiErrorMessage;
