import { AxiosError } from 'axios';

/**
 * Feiltyper til differensiering av framvisning i GUI
 * Skal speile FeilType.java en-til-en
 */
export enum ErrorTypes {
  MANGLER_TILGANG_FEIL = 'MANGLER_TILGANG_FEIL',
  TOMT_RESULTAT_FEIL = 'TOMT_RESULTAT_FEIL',
  BEHANDLING_ENDRET_FEIL = 'BEHANDLING_ENDRET_FEIL',
  GENERELL_FEIL = 'GENERELL_FEIL',
}

const handledErrorTypes = [ErrorTypes.MANGLER_TILGANG_FEIL];

export const getErrorResponseData = (error: Error): any =>
  error instanceof AxiosError && error.response && error.response.data ? error.response.data : error;

export const errorOfType = (error: Error, errorType: string): boolean =>
  error instanceof AxiosError && getErrorResponseData(error).type === errorType;

export const isHandledError = (errorType?: string): boolean =>
  errorType != null && handledErrorTypes.some(het => het === errorType);
