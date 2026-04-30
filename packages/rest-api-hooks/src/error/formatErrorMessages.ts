import { formatDate, timeFormat } from '@k9-sak-web/lib/dateUtils/dateUtils.js';
import { EventType } from '@k9-sak-web/rest-api';

export class ErrorMessage {
  text: string;

  extra?: Record<string, string>;

  type?: EventType;

  static withMessage(message: string, eventType: EventType | undefined, extra?: Record<string, string>) {
    const errorMessage = new ErrorMessage();
    errorMessage.type = eventType;
    errorMessage.text = message;
    errorMessage.extra = extra;
    return errorMessage;
  }
}

interface InputErrorMessage {
  type?: EventType;
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
  if (e.type === EventType.POLLING_TIMEOUT) {
    return ErrorMessage.withMessage(`Serverkall har gått ut på tid: ${e.location ?? ''}`, e.type, {
      systemMelding: e.message ?? '',
    });
  }

  if (e.type === EventType.POLLING_HALTED_OR_DELAYED) {
    const { message, status, eta } = e;
    if (status === 'HALTED') {
      return ErrorMessage.withMessage(
        'Noe feilet. Feilen kan være forbigående. Prøv å behandle saken litt senere. Om feilen oppstår igjen, meld den inn via porten.',
        e.type,
        { systemMelding: message ?? '' },
      );
    }
    if (status === 'DELAYED') {
      return ErrorMessage.withMessage(
        `Saksbehandlingsløsningen venter på et annet system som har nedetid nå. Du trenger ikke melde inn en feil, men prøv igjen ${formatDate(eta ?? '')} kl. ${timeFormat(eta ?? '')}.`,
        e.type,
        { systemMelding: message ?? '' },
      );
    }
    return undefined;
  }

  if (e.type === EventType.REQUEST_GATEWAY_TIMEOUT_OR_NOT_FOUND) {
    const contextPath = e.location ? findContextPath(e.location) : '';
    return ErrorMessage.withMessage(`Får ikke kontakt med ${contextPath} (${e.location})`, e.type);
  }

  // Standard-formatering (default)
  if (e.feilmelding) {
    return ErrorMessage.withMessage(e.feilmelding, e.type);
  }
  if (e.message) {
    return ErrorMessage.withMessage(e.message, e.type);
  }
  return undefined;
};
