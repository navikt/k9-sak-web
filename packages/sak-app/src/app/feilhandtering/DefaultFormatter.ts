import ErrorMessage from './ErrorMessage';
import Formatter from './Formatter';

export type ErrorData = {
  feilmelding?: string;
  message?: string;
};

class DefaultFormatter implements Formatter<ErrorData> {
  isOfType = () => true;

  formatString = (errorData: string): ErrorMessage => ErrorMessage.withMessage(errorData);

  format = (errorData: ErrorData | string) => {
    if (typeof errorData === 'string') {
      return ErrorMessage.withMessage(errorData);
    }
    if (errorData.feilmelding) {
      return ErrorMessage.withMessage(errorData.feilmelding);
    }
    if (errorData.message) {
      return ErrorMessage.withMessage(errorData.message);
    }
    return undefined;
  };
}

export default DefaultFormatter;
