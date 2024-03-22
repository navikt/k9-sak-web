import { MottakerDto } from "@navikt/k9-sak-typescript-client";
import { Linker } from "./Linker.js";
import { isString } from "../../typecheck/isString.js";
import { isArray } from "../../typecheck/isArray.js";
import { isBoolean } from "../../typecheck/isBoolean.js";
import { isObject } from "../../typecheck/isObject.js";

/**
 * Matcher k9-formidling Template data class i MalController.kt
 */
export interface Template {
  readonly navn: string
  readonly mottakere: MottakerDto[]
  readonly linker: Linker[]
  readonly støtterFritekst: boolean
  readonly støtterTittelOgFritekst: boolean
  readonly kode: string
  readonly støtterTredjepartsmottaker: boolean
}


type TemplateKeys = keyof Template

type TemplateWithUnknownValues = Record<TemplateKeys, unknown>

const templateKeys: TemplateKeys[] = ["navn", "mottakere", "linker", "støtterFritekst", "støtterTittelOgFritekst", "kode", "støtterTredjepartsmottaker"]

const isTemplateWithUnknownValues = (v: unknown): v is TemplateWithUnknownValues =>
  isObject(v)  &&
  templateKeys.every(tk => Object.keys(v).includes(tk))

const isMottakerDtoKeys = (v: unknown): v is Record<keyof MottakerDto, unknown> =>
  isObject(v) &&
  Object.keys(v).includes("id") &&
  Object.keys(v).includes("type")

export const isMottakerDto = (v: Record<keyof MottakerDto, unknown>): v is MottakerDto => isString(v.type) && isString(v.id)

export const isTemplate = (v: unknown): v is Template =>
  isTemplateWithUnknownValues(v) &&
  isString(v.navn) &&
  isMottakerDtoKeys(v.mottakere) &&
  isMottakerDto(v.mottakere) &&
  isArray(v.linker) &&
  isBoolean(v.støtterFritekst) &&
  isBoolean(v.støtterTittelOgFritekst) &&
  isString(v.kode) &&
  isBoolean(v.støtterTredjepartsmottaker)
