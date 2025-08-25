import {
  k9_sak_kontrakt_FeilType,
  type k9_sak_kontrakt_FeilDto,
  type k9_sak_kontrakt_FeltFeilDto,
} from '@k9-sak-web/backend/k9sak/generated/types.js';
import {
  k9_klage_kontrakt_FeilType,
  type k9_klage_kontrakt_FeilDto,
  type k9_klage_kontrakt_FeltFeilDto,
} from '@k9-sak-web/backend/k9klage/generated/types.js';
import {
  ung_sak_kontrakt_FeilType,
  type ung_sak_kontrakt_FeilDto,
  type ung_sak_kontrakt_FeltFeilDto,
} from '@k9-sak-web/backend/ungsak/generated/types.js';
import { isObject } from '../../typecheck/isObject.js';
import { isString } from '../../typecheck/isString.js';
import { isArray } from '../../typecheck/isArray.js';

export type FeilTypeValuesUnion = k9_sak_kontrakt_FeilType | k9_klage_kontrakt_FeilType | ung_sak_kontrakt_FeilType;
// Type som representerer enum objekt med det som er felles FeilType enum for alle backends som genererer typer.
type FeilTypeObjectUnion = Record<
  | keyof typeof k9_sak_kontrakt_FeilType
  | keyof typeof k9_klage_kontrakt_FeilType
  | keyof typeof ung_sak_kontrakt_FeilType,
  FeilTypeValuesUnion
>;
export type FeilDtoUnion =
  | k9_sak_kontrakt_FeilDto
  | (k9_klage_kontrakt_FeilDto & { feilkode: undefined })
  | ung_sak_kontrakt_FeilDto;
export type FeltFeilDtoUnion =
  | k9_sak_kontrakt_FeltFeilDto
  | k9_klage_kontrakt_FeltFeilDto
  | ung_sak_kontrakt_FeltFeilDto;

const bodyPropnames: Record<keyof FeilDtoUnion, keyof FeilDtoUnion> = {
  feilmelding: 'feilmelding',
  type: 'type',
  feilkode: 'feilkode',
  feltFeil: 'feltFeil',
};

const feltFeilPropnames: Record<keyof FeltFeilDtoUnion, keyof FeltFeilDtoUnion> = {
  navn: 'navn',
  melding: 'melding',
  metainformasjon: 'metainformasjon',
};

// Bruker k9_sak_kontrakt_FeilType som felles type for alle backends, verifiserer at den er i synk med alle:
export const feilTypeUnion = k9_sak_kontrakt_FeilType satisfies FeilTypeObjectUnion;
export const feilTypeUnionValues = Object.values(feilTypeUnion);

const isFeilTypeUnion = (v: unknown): v is FeilTypeValuesUnion => feilTypeUnionValues.some(ok => ok === v);

const isFeilDtoKeys = (body: unknown): body is Record<keyof FeilDtoUnion, unknown> =>
  isObject(body) &&
  Object.keys(body).includes(bodyPropnames.feilmelding) &&
  Object.keys(body).includes(bodyPropnames.type);

const isFeltFeilDtoKeys = (v: unknown): v is FeltFeilDtoUnion =>
  isObject(v) && Object.keys(v).includes(feltFeilPropnames.melding) && Object.keys(v).includes(feltFeilPropnames.navn);

const isFeltFeil = (v: unknown): v is FeltFeilDtoUnion =>
  isFeltFeilDtoKeys(v) && isString(v.navn) && isString(v.melding);

export const isFeilDtoUnion = (body: unknown): body is FeilDtoUnion =>
  isFeilDtoKeys(body) &&
  isString(body.feilmelding) &&
  isFeilTypeUnion(body.type) &&
  (body.feilkode == null || isString(body.feilkode)) &&
  (body.feltFeil == null || (isArray(body.feltFeil) && body.feltFeil.every(isFeltFeil)));
