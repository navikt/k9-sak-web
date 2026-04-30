import { AdditionalInfoError } from '@k9-sak-web/gui/app/errorhandling/AdditionalInfoError.js';
import { EventType } from '@k9-sak-web/rest-api';

/**
 * legacy api error handling rapporterer feil som objekt med diverse properties. Ser ut til at det alltid er message prop
 * av type string for feilmelding, og type med verdi frå enum som seier noko om feiltype. Så kan det vere diverse andre
 * props. Mapper dette til AdditionalInfoError her for overgang til nytt feilhandteringsregime.
 */
export class LegacyApiError extends AdditionalInfoError {
  #type: EventType | undefined;
  constructor(
    message: string | null = null,
    type: EventType | undefined,
    errorData: Record<string, unknown> | undefined,
  ) {
    let data = structuredClone(errorData);
    let msg = message ?? 'Legacy api error';
    if (data != null) {
      if ('message' in data && typeof data.message === 'string') {
        msg = data.message;
        delete data.message;
      }
      if ('type' in data && data.type === 'REQUEST_ERROR') {
        delete data.type;
      }
      if (Object.keys(data).length == 0) {
        data = undefined;
      }
    }
    super(msg, undefined, data);
    this.#type = type;
  }

  get type() {
    return this.#type;
  }
}
