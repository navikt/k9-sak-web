import { isObject } from "../../typecheck/isObject.ts";
import { isString } from "../../typecheck/isString.ts";
import { isArray } from "../../typecheck/isArray.ts";

export interface FritekstbrevDokumentdata {
  readonly tittel: string;
  readonly fritekst: string;
}

const isFritekstbrevDokumentdataKeys = (v: unknown): v is Record<keyof FritekstbrevDokumentdata, unknown> =>
  isObject(v) &&
  Object.keys(v).includes("tittel") &&
  Object.keys(v).includes("fritekst")

export const isFritekstbrevDokumentdata = (v: unknown): v is FritekstbrevDokumentdata =>
  isFritekstbrevDokumentdataKeys(v) &&
  isString(v.tittel) &&
  isString(v.fritekst)

export const isFritekstbrevDokumentdataArray = (v: unknown): v is FritekstbrevDokumentdata[] =>
  isArray(v) &&
  v.every(isFritekstbrevDokumentdata)
