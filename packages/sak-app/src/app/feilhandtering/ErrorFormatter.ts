import DefaultFormatter, { type ErrorData as ErrorDataDefault } from './DefaultFormatter';
import type ErrorMessage from './ErrorMessage';
import RestGatewayTimeoutOrNotFoundFormatter, {
  type ErrorData as ErrorDataTimeoutOrNotFound,
} from './RestGatewayTimeoutOrNotFoundFormatter';
import RestHaltedOrDelayedFormatter, {
  type ErrorData as ErrorDataHaltedOrDelayed,
} from './RestHaltedOrDelayedFormatter';
import RestTimeoutFormatter, { type ErrorData as ErrorDataRestDefault } from './RestTimeoutFormatter';

const defaultFormatter = new DefaultFormatter();
const formatters = [
  new RestTimeoutFormatter(),
  new RestHaltedOrDelayedFormatter(),
  new RestGatewayTimeoutOrNotFoundFormatter(),
  defaultFormatter,
];

type InputErrorMessage =
  | ErrorDataDefault
  | ErrorDataRestDefault
  | ErrorDataHaltedOrDelayed
  | ErrorDataTimeoutOrNotFound;

class ErrorFormatter {
  format = (errorMessages: InputErrorMessage[], crashMessage?: string): ErrorMessage[] => {
    const allErrorMessages: ErrorMessage[] = [];
    if (crashMessage) {
      allErrorMessages.push(defaultFormatter.formatString(crashMessage));
    }

    if (errorMessages.length > 0) {
      errorMessages
        .map((e: any) => {
          const formatter = formatters.find(f => f.isOfType(e.type));
          return formatter ? formatter.format(e) : undefined;
        })
        .filter(e => e != null)
        .forEach(e => allErrorMessages.push(e));
    }

    return allErrorMessages;
  };
}

export default ErrorFormatter;
