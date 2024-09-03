import type { Linker } from './Linker.js';
import { isString } from '../../typecheck/isString.js';
import { isArray } from '../../typecheck/isArray.js';
import { isBoolean } from '../../typecheck/isBoolean.js';
import { isObject } from '../../typecheck/isObject.js';
import type { Mottaker } from './Mottaker.js';

/**
 * Matcher k9-formidling Template data class i MalController.kt
 *
 * XXX: Vurder å hente denne inn gjennom openapi generering via k9-sak K9FormidlingKodeverkWeb istadenfor å deklarere den her
 */
export interface Template {
  readonly navn: string;
  readonly mottakere: Mottaker[];
  readonly linker: Linker[];
  readonly støtterFritekst: boolean;
  readonly støtterTittelOgFritekst: boolean;
  readonly kode: string;
  readonly støtterTredjepartsmottaker: boolean;
}

type TemplateKeys = keyof Template;

type TemplateWithUnknownValues = Record<TemplateKeys, unknown>;

const templateKeys: TemplateKeys[] = [
  'navn',
  'mottakere',
  'linker',
  'støtterFritekst',
  'støtterTittelOgFritekst',
  'kode',
  'støtterTredjepartsmottaker',
];

const isTemplateWithUnknownValues = (v: unknown): v is TemplateWithUnknownValues =>
  isObject(v) && templateKeys.every(tk => Object.keys(v).includes(tk));

const isMottakerKeys = (v: unknown): v is Record<keyof Omit<Mottaker, 'utilgjengelig'>, unknown> =>
  isObject(v) && Object.keys(v).includes('id') && Object.keys(v).includes('type');

export const isMottaker = (v: Record<keyof Omit<Mottaker, 'utilgjengelig'>, unknown>): v is Mottaker =>
  isString(v.type) && isString(v.id);

export const isTemplate = (v: unknown): v is Template =>
  isTemplateWithUnknownValues(v) &&
  isString(v.navn) &&
  isMottakerKeys(v.mottakere) &&
  isMottaker(v.mottakere) &&
  isArray(v.linker) &&
  isBoolean(v.støtterFritekst) &&
  isBoolean(v.støtterTittelOgFritekst) &&
  isString(v.kode) &&
  isBoolean(v.støtterTredjepartsmottaker);
