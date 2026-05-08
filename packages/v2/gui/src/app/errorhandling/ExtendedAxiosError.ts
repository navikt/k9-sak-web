import { AxiosError } from 'axios';
import { type AlertInfo, makeErrorId } from './AlertInfo.js';

/**
 * Brukast når ein kaster feil frå legacy kode som bruker axios klient, og har fått AxiosError tilbake frå serverkall, for å legge på errorId.
 * <p>
 *   Fjernast så fort vi ikkje har behov for den lenger.
 * </p>
 */
export class ExtendedAxiosError extends AxiosError implements AlertInfo {
  public readonly errorId = makeErrorId();

  constructor(error: AxiosError) {
    super(error.message, error.code, error.config, error.request, error.response);
    // Bevar opphavleg stack trace og cause-kjede
    this.cause = error;
    if (error.stack != null) {
      this.stack = error.stack;
    }
  }
}
