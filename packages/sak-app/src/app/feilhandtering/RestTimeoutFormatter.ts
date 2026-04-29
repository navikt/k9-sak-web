import ErrorEventType from './errorEventType';
import ErrorMessage from './ErrorMessage';
import Formatter from './Formatter';

export type ErrorData = {
  type: string;
  message: string;
  location: string;
};

class RestTimeoutFormatter implements Formatter<ErrorData> {
  type = ErrorEventType.POLLING_TIMEOUT;

  isOfType = (type: string) => type === this.type;

  format = (errorData: ErrorData) =>
    ErrorMessage.withMessage(`Serverkall har gått ut på tid: ${errorData.location ?? ''}`, {
      systemMelding: errorData.message,
    });
}

export default RestTimeoutFormatter;
