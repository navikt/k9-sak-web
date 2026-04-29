import { formatDate, timeFormat } from '@k9-sak-web/lib/dateUtils/dateUtils.js';
import ErrorEventType from './errorEventType';
import ErrorMessage from './ErrorMessage';

type ErrorDataRestTimeout = {
  type: string;
  message: string;
  location: string;
};

type ErrorDataHaltedOrDelayed = {
  message: string;
  status: string;
  eta: string;
  type: string;
};

type ErrorDataGatewayTimeoutOrNotFound = {
  type: string;
  message: string;
  location: string;
};

type ErrorDataDefault = {
  feilmelding?: string;
  message?: string;
};

type InputErrorMessage =
  | ErrorDataDefault
  | ErrorDataRestTimeout
  | ErrorDataHaltedOrDelayed
  | ErrorDataGatewayTimeoutOrNotFound;

const findContextPath = (location: string): string => location.split('/')[1].toUpperCase();

/**
 * Formaterer feilmeldinger basert på type.
 * Håndterer polling-timeout, polling halted/delayed, gateway-timeout/not-found og standardfeil.
 */
export const formatErrorMessages = (errorMessages: InputErrorMessage[]): ErrorMessage[] => {
  if (errorMessages.length === 0) {
    return [];
  }

  return errorMessages
    .map((e: any) => {
      const { type } = e;

      if (type === ErrorEventType.POLLING_TIMEOUT) {
        return ErrorMessage.withMessage(`Serverkall har gått ut på tid: ${e.location ?? ''}`, {
          systemMelding: e.message,
        });
      }

      if (type === ErrorEventType.POLLING_HALTED_OR_DELAYED) {
        const { message, status, eta } = e;
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
      }

      if (type === ErrorEventType.REQUEST_GATEWAY_TIMEOUT_OR_NOT_FOUND) {
        const contextPath = e.location ? findContextPath(e.location) : '';
        return ErrorMessage.withMessage(`Får ikke kontakt med ${contextPath} (${e.location})`);
      }

      // Standard-formatering (default)
      if (typeof e === 'string') {
        return ErrorMessage.withMessage(e);
      }
      if (e.feilmelding) {
        return ErrorMessage.withMessage(e.feilmelding);
      }
      if (e.message) {
        return ErrorMessage.withMessage(e.message);
      }
      return undefined;
    })
    .filter((e): e is ErrorMessage => e != null);
};
