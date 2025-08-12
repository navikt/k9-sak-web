import {
  type sak_kontrakt_FeilDto as FeilDto,
  type sak_kontrakt_FeltFeilDto as FeltFeilDto,
} from '@navikt/k9-sak-typescript-client';
import { isObject } from '../../typecheck/isObject.js';
import { isString } from '../../typecheck/isString.js';
import { isArray } from '../../typecheck/isArray.js';

export type K9SakErrorData = FeilDto;

const bodyPropnames: Record<keyof K9SakErrorData, keyof K9SakErrorData> = {
  feilmelding: 'feilmelding',
  type: 'type',
  feilkode: 'feilkode',
  feltFeil: 'feltFeil',
};

const feltFeilPropnames: Record<keyof FeltFeilDto, keyof FeltFeilDto> = {
  navn: 'navn',
  melding: 'melding',
  metainformasjon: 'metainformasjon',
};

// Sjekker at body har required props frå K9SakErrorBody
const isK9SakErrorDataKeys = (body: unknown): body is Record<keyof K9SakErrorData, unknown> =>
  isObject(body) &&
  Object.keys(body).includes(bodyPropnames.feilmelding) &&
  Object.keys(body).includes(bodyPropnames.type);

// Sjekker at v har required props frå FeltFeilDto
const isFeltFeilDtoKeys = (v: unknown): v is Record<keyof FeltFeilDto, unknown> =>
  isObject(v) && Object.keys(v).includes(feltFeilPropnames.melding) && Object.keys(v).includes(feltFeilPropnames.navn);

// Sjekker at v ser ut til å vere instans av FeltFeilDto
const isFeltFeil = (v: unknown): v is FeltFeilDto => isFeltFeilDtoKeys(v) && isString(v.navn) && isString(v.melding);

export const isK9SakErrorData = (body: unknown): body is K9SakErrorData =>
  isK9SakErrorDataKeys(body) &&
  isString(body.feilmelding) &&
  isString(body.type) &&
  (body.feilkode === undefined || body.feilkode === null || isString(body.feilkode)) &&
  (body.feltFeil === undefined ||
    body.feltFeil === null ||
    (isArray(body.feltFeil) && body.feltFeil.every(isFeltFeil)));
