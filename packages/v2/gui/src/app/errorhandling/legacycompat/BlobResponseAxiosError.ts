import { AxiosError } from 'axios';

/**
 * Representerer ein AxiosError der response-data opphavleg var ein Blob som har blitt lest som tekst.
 * Utvider AxiosError slik at instanceof AxiosError-sjekkar framleis fungerer.
 *
 * Held den rå response-teksten slik at nedstrøms kode kan parse den etter behov.
 */
export class BlobResponseAxiosError extends AxiosError {
  /** Rå response-tekst ekstrahert frå bloben */
  readonly responseText: string;

  constructor(original: AxiosError, responseText: string) {
    super(original.message, original.code, original.config, original.request, original.response);
    this.name = this.constructor.name;
    this.responseText = responseText;
    this.cause = original;
  }
}
