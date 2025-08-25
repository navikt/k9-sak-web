import {
  type k9_klage_kontrakt_FeilDto as FeilDto,
  type k9_klage_kontrakt_FeltFeilDto as FeltFeilDto,
} from '../generated/types.js';
import { isObject } from '../../typecheck/isObject.js';
import { isString } from '../../typecheck/isString.js';
import { isArray } from '../../typecheck/isArray.js';

export type K9KlageErrorData = FeilDto;

const bodyPropnames: Record<keyof K9KlageErrorData, keyof K9KlageErrorData> = {
  feilmelding: 'feilmelding',
  type: 'type',
  feltFeil: 'feltFeil',
};

const feltFeilPropnames: Record<keyof FeltFeilDto, keyof FeltFeilDto> = {
  navn: 'navn',
  melding: 'melding',
  metainformasjon: 'metainformasjon',
};

// Sjekker at body har required props frå K9KlageErrorBody
const isK9KlageErrorDataKeys = (body: unknown): body is Record<keyof K9KlageErrorData, unknown> =>
  isObject(body) &&
  Object.keys(body).includes(bodyPropnames.feilmelding) &&
  Object.keys(body).includes(bodyPropnames.type);

// Sjekker at v har required props frå FeltFeilDto
const isFeltFeilDtoKeys = (v: unknown): v is Record<keyof FeltFeilDto, unknown> =>
  isObject(v) && Object.keys(v).includes(feltFeilPropnames.melding) && Object.keys(v).includes(feltFeilPropnames.navn);

// Sjekker at v ser ut til å vere instans av FeltFeilDto
const isFeltFeil = (v: unknown): v is FeltFeilDto => isFeltFeilDtoKeys(v) && isString(v.navn) && isString(v.melding);

export const isK9KlageErrorData = (body: unknown): body is K9KlageErrorData =>
  isK9KlageErrorDataKeys(body) &&
  isString(body.feilmelding) &&
  isString(body.type) &&
  (body.feltFeil === undefined ||
    body.feltFeil === null ||
    (isArray(body.feltFeil) && body.feltFeil.every(isFeltFeil)));
