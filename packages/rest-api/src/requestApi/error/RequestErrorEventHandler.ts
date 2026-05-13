import EventType from '../eventType';
import { isHandledError } from './ErrorTypes';
import TimeoutError from './TimeoutError';
import { ErrorResponse } from '../ResponseTsType';
import { AxiosError } from 'axios';
import type { NotificationEmitter } from '../NotificationEmitter.js';
import type { ErrorNotifier } from './ErrorNotifier.js';
import { blobToText, isOfTypeBlob } from '@k9-sak-web/gui/app/errorhandling/legacycompat/blobResponseHelper.js';
import { BlobResponseAxiosError } from '@k9-sak-web/gui/app/errorhandling/legacycompat/BlobResponseAxiosError.js';

const isString = (value: any): boolean => typeof value === 'string';

interface FormatedError {
  data?: string | ErrorResponse | Record<string, unknown>;
  type?: string;
  status?: number;
  isForbidden?: boolean;
  isUnauthorized?: boolean;
  is418?: boolean;
  isGatewayTimeoutOrNotFound?: boolean;
  location?: string;
}

class RequestErrorEventHandler {
  notify: NotificationEmitter;
  errorNotifier: ErrorNotifier | undefined;

  isPollingRequest: boolean;

  constructor(
    notificationEmitter: NotificationEmitter,
    isPollingRequest: boolean,
    errorNotifier: ErrorNotifier | undefined,
  ) {
    this.notify = notificationEmitter;
    this.errorNotifier = errorNotifier;
    this.isPollingRequest = isPollingRequest;
  }

  handleError = async (error: Error): Promise<void> => {
    // Ny feilrapportering:
    if (error instanceof AxiosError && isOfTypeBlob(error) && error.response?.data instanceof Blob) {
      const text = await blobToText(error.response.data);
      this.errorNotifier?.(new BlobResponseAxiosError(error, text));
    } else {
      this.errorNotifier?.(error);
    }
    // Gammal feilrapportering:
    if (error instanceof TimeoutError) {
      this.notify(EventType.POLLING_TIMEOUT, { location: error.location });
      return;
    }
    if (error instanceof AxiosError) {
      const formattedError = this.formatError(error);
      if (isOfTypeBlob(error) && formattedError.data instanceof Blob) {
        const jsonErrorString = await blobToText(formattedError.data);
        if (isString(jsonErrorString)) {
          formattedError.data = JSON.parse(jsonErrorString);
        }
      }

      if (formattedError.isGatewayTimeoutOrNotFound) {
        this.notify(
          EventType.REQUEST_GATEWAY_TIMEOUT_OR_NOT_FOUND,
          { location: formattedError.location },
          this.isPollingRequest,
        );
      } else if (formattedError.isUnauthorized) {
        this.notify(EventType.REQUEST_UNAUTHORIZED, { message: error.message }, this.isPollingRequest);
      } else if (formattedError.isForbidden) {
        this.notify(
          EventType.REQUEST_FORBIDDEN,
          formattedError.data ? formattedError.data : { message: error.message },
        );
      } else if (formattedError.is418) {
        this.notify(EventType.POLLING_HALTED_OR_DELAYED, formattedError.data);
      } else if (!error.response && error.message) {
        this.notify(EventType.REQUEST_ERROR, { message: error.message }, this.isPollingRequest);
      } else if (!isHandledError(formattedError.type)) {
        this.notify(
          EventType.REQUEST_ERROR,
          formattedError.data !== undefined ? this.getFormattedData(formattedError.data) : undefined,
          this.isPollingRequest,
        );
      }
    } else {
      this.notify(EventType.REQUEST_ERROR, { message: error.message }, this.isPollingRequest);
    }
  };

  getFormattedData = (data: string | Record<string, any>): string | Record<string, any> =>
    isString(data) ? { message: data } : data;

  findErrorData = (response: {
    data?: any;
    status?: number;
    statusText?: string;
  }): string | ErrorResponse | undefined => (response.data ? response.data : response.statusText);

  formatError = (error: AxiosError): FormatedError => {
    const response = error && error.response ? error.response : undefined;
    return {
      data: response ? this.findErrorData(response) : undefined,
      type: response && response.data ? response.data['type'] : undefined,
      status: response ? response.status : undefined,
      isForbidden: response ? response.status === 403 : undefined,
      isUnauthorized: response ? response.status === 401 : undefined,
      is418: response ? response.status === 418 : undefined,
      isGatewayTimeoutOrNotFound: response ? response.status === 504 || response.status === 404 : undefined,
      location: response && response.config ? response.config.url : undefined,
    };
  };
}

export default RequestErrorEventHandler;
