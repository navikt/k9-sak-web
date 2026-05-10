import { FrontendError } from '../FrontendError.js';

export type AdditionalInfo = Readonly<Record<string, unknown>>;

/**
 * Brukast i legacy api kode som mapper spesielle koder returnert for å vise utfyllande info om feil som har oppstått.
 */
export class AdditionalInfoError extends FrontendError {
  public readonly additionalInfo: AdditionalInfo | undefined;

  constructor(message: string, cause?: Error, additionalInfo?: AdditionalInfo) {
    super(message, cause);
    this.name = this.constructor.name;
    this.additionalInfo = additionalInfo;
  }
}
