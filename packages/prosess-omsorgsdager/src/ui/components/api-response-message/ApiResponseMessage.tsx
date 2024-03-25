import { Alert } from '@navikt/ds-react';
import React from 'react';
import ApiErrorMessage from '../api-error-message/ApiErrorMessage';
import styles from './apiResponseMessage.module.css';

interface ApiResponseMessageProps {
  response: Response;
}

const ApiResponseMessage: React.FunctionComponent<ApiResponseMessageProps> = ({ response }) => {
  const hentResponsBasertPåStatus = () => {
    if (response !== null) {
      switch (response.status) {
        case 200:
          return (
            <Alert size="small" variant="success">
              Vedtaket er løst.
            </Alert>
          );
        case 409:
          return (
            <Alert size="small" variant="error">
              Vedtaket har en annen status enn <i>foreslått</i>.
            </Alert>
          );
        default:
          return <ApiErrorMessage response={response} />;
      }
    }
    return null;
  };

  return <div className={styles.apiResponseMessage}>{hentResponsBasertPåStatus()}</div>;
};

export default ApiResponseMessage;
