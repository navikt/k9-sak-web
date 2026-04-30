import { formatDate, timeFormat } from '@k9-sak-web/lib/dateUtils/dateUtils.js';

/**
 * ErrorEventType
 *
 * Dette er eventer som skal spesialformateres. Eventene her speiler eventene i eventType i rest-api.
 */
export enum ErrorEventType {
  POLLING_TIMEOUT = 'POLLING_TIMEOUT',
  POLLING_HALTED_OR_DELAYED = 'POLLING_HALTED_OR_DELAYED',
  REQUEST_GATEWAY_TIMEOUT_OR_NOT_FOUND = 'REQUEST_GATEWAY_TIMEOUT_OR_NOT_FOUND',
}

export class ErrorMessage {
  text: string;

  extra?: Record<string, string>;

  static withMessage(message: string, extra?: Record<string, string>) {
    const errorMessage = new ErrorMessage();
    errorMessage.text = message;
    errorMessage.extra = extra;
    return errorMessage;
  }
}

interface InputErrorMessage {
  type?: string;
  message?: string;
  location?: string;
  status?: string;
  eta?: string;
  feilmelding?: string;
}

const findContextPath = (location: string): string => location.split('/')[1].toUpperCase();

/**
 * Formaterer én feilmelding basert på type.
 * Håndterer polling-timeout, polling halted/delayed, gateway-timeout/not-found og standardfeil.
 */
export const formatErrorMessage = (e: InputErrorMessage): ErrorMessage | undefined => {
  if (e.type === ErrorEventType.POLLING_TIMEOUT) {
    return ErrorMessage.withMessage(`Serverkall har gått ut på tid: ${e.location ?? ''}`, {
      systemMelding: e.message ?? '',
    });
  }

  if (e.type === ErrorEventType.POLLING_HALTED_OR_DELAYED) {
    const { message, status, eta } = e;
    if (status === 'HALTED') {
      return ErrorMessage.withMessage(
        'Noe feilet. Feilen kan være forbigående. Prøv å behandle saken litt senere. Om feilen oppstår igjen, meld den inn via porten.',
        { systemMelding: message ?? '' },
      );
    }
    if (status === 'DELAYED') {
      return ErrorMessage.withMessage(
        `Saksbehandlingsløsningen venter på et annet system som har nedetid nå. Du trenger ikke melde inn en feil, men prøv igjen ${formatDate(eta ?? '')} kl. ${timeFormat(eta ?? '')}.`,
        { systemMelding: message ?? '' },
      );
    }
    return undefined;
  }

  if (e.type === ErrorEventType.REQUEST_GATEWAY_TIMEOUT_OR_NOT_FOUND) {
    const contextPath = e.location ? findContextPath(e.location) : '';
    return ErrorMessage.withMessage(`Får ikke kontakt med ${contextPath} (${e.location})`);
  }

  // Standard-formatering (default)
  if (e.feilmelding) {
    return ErrorMessage.withMessage(e.feilmelding);
  }
  if (e.message) {
    return ErrorMessage.withMessage(e.message);
  }
  return undefined;
};
