import { isArray } from '../../typecheck/isArray.js';
import { isObject } from '../../typecheck/isObject.js';
import { isString } from '../../typecheck/isString.js';

type FeilDto = {
  feilkode?: string | null;
  feilmelding: string;
  feltFeil?: Array<FeltFeilDto> | null;
  type:
    | 'BEHANDLING_ENDRET_FEIL'
    | 'GENERELL_FEIL'
    | 'VALIDERINGS_FEIL'
    | 'MANGLER_TILGANG_FEIL'
    | 'TOMT_RESULTAT_FEIL'
    | null;
};

type FeltFeilDto = {
  melding: string;
  metainformasjon?: string | null;
  navn: string;
};

export type UngSakErrorData = FeilDto;

const bodyPropnames: Record<keyof UngSakErrorData, keyof UngSakErrorData> = {
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

// Sjekker at body har required props frå UngSakErrorBody
const isUngSakErrorDataKeys = (body: unknown): body is Record<keyof UngSakErrorData, unknown> =>
  isObject(body) &&
  Object.keys(body).includes(bodyPropnames.feilmelding) &&
  Object.keys(body).includes(bodyPropnames.type);

// Sjekker at v har required props frå FeltFeilDto
const isFeltFeilDtoKeys = (v: unknown): v is Record<keyof FeltFeilDto, unknown> =>
  isObject(v) && Object.keys(v).includes(feltFeilPropnames.melding) && Object.keys(v).includes(feltFeilPropnames.navn);

// Sjekker at v ser ut til å vere instans av FeltFeilDto
const isFeltFeil = (v: unknown): v is FeltFeilDto => isFeltFeilDtoKeys(v) && isString(v.navn) && isString(v.melding);

export const isUngSakErrorData = (body: unknown): body is UngSakErrorData =>
  isUngSakErrorDataKeys(body) &&
  isString(body.feilmelding) &&
  isString(body.type) &&
  (body.feilkode === undefined || body.feilkode === null || isString(body.feilkode)) &&
  (body.feltFeil === undefined ||
    body.feltFeil === null ||
    (isArray(body.feltFeil) && body.feltFeil.every(isFeltFeil)));
