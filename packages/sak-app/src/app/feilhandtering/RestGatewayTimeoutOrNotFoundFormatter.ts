import ErrorEventType from './errorEventType';
import ErrorMessage from './ErrorMessage';
import Formatter from './Formatter';

const TIMEOUT_MESSAGE_CODE = 'Rest.ErrorMessage.GatewayTimeoutOrNotFound';

const findContextPath = (location: string): string => location.split('/')[1].toUpperCase();

export type ErrorData = {
  type: string;
  message: string;
  location: string;
};

class RestGatewayTimeoutOrNotFoundFormatter implements Formatter<ErrorData> {
  type = ErrorEventType.REQUEST_GATEWAY_TIMEOUT_OR_NOT_FOUND;

  isOfType = (type: string) => type === this.type;

  format = (errorData: ErrorData) =>
    ErrorMessage.withMessageCode(TIMEOUT_MESSAGE_CODE, {
      contextPath: errorData.location ? findContextPath(errorData.location) : '',
      location: errorData.location,
    });
}

export default RestGatewayTimeoutOrNotFoundFormatter;
