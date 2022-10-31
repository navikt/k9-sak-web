import EventType from '@k9-sak-web/rest-api/src/requestApi/eventType';

type ErrorDispatcherArguments = { type: EventType };
type ErrorDispatcher = (args: ErrorDispatcherArguments) => void;

export const httpErrorHandler = (status: number, errorDispatcher: ErrorDispatcher, locationHeader?: string) => {
  if (status === 403) {
    errorDispatcher({ type: EventType.REQUEST_FORBIDDEN });
  } else if (status === 401) {
    if (locationHeader) {
      const currentPath = encodeURIComponent(window.location.pathname + window.location.search);
      window.location.href = `${locationHeader}?redirectTo=${currentPath}`;
    } else {
      errorDispatcher({ type: EventType.REQUEST_UNAUTHORIZED });
    }
  }
};

export default httpErrorHandler;
