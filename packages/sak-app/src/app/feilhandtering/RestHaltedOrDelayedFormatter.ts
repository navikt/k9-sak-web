import { formatDate, timeFormat } from '@k9-sak-web/lib/dateUtils/dateUtils.js';
import ErrorEventType from './errorEventType';
import ErrorMessage from './ErrorMessage';
import Formatter from './Formatter';

export type ErrorData = {
  message: string;
  status: string;
  eta: string;
  type: string;
};

class RestHaltedOrDelayedFormatter implements Formatter<ErrorData> {
  type = ErrorEventType.POLLING_HALTED_OR_DELAYED;

  isOfType = (type: string) => type === this.type;

  format = (errorData: ErrorData) => {
    const { message, status, eta } = errorData;
    if (status === 'HALTED') {
      return ErrorMessage.withMessage(
        'Noe feilet. Feilen kan være forbigående. Prøv å behandle saken litt senere. Om feilen oppstår igjen, meld den inn via porten.',
        { systemMelding: message },
      );
    }
    if (status === 'DELAYED') {
      return ErrorMessage.withMessage(
        `Saksbehandlingsløsningen venter på et annet system som har nedetid nå. Du trenger ikke melde inn en feil, men prøv igjen ${formatDate(eta)} kl. ${timeFormat(eta)}.`,
        { systemMelding: message },
      );
    }
    return undefined;
  };
}

export default RestHaltedOrDelayedFormatter;
