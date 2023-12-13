import { AlertStripeFeil, AlertStripeSuksess } from 'nav-frontend-alertstriper';
import React from 'react';
import ApiErrorMessage from '../api-error-message/ApiErrorMessage';
import styles from './apiResponseMessage.css';

interface ApiResponseMessageProps {
  response: Response;
}

const ApiResponseMessage: React.FunctionComponent<ApiResponseMessageProps> = ({ response }) => {
  const hentResponsBasertPåStatus = () => {
    if (response !== null) {
      switch (response.status) {
        case 200:
          return <AlertStripeSuksess>Vedtaket er løst.</AlertStripeSuksess>;
        case 409:
          return (
            <AlertStripeFeil>
              Vedtaket har en annen status enn <i>foreslått</i>.
            </AlertStripeFeil>
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
