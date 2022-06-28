export { range, flatten, haystack, isArrayEmpty, without, zip } from './src/arrayUtils';
export {
  formatCurrencyWithKr,
  formatCurrencyNoKr,
  parseCurrencyInput,
  removeSpacesFromNumber,
} from './src/currencyUtils';
export {
  addDaysToDate,
  calcDays,
  calcDaysAndWeeks,
  calcDaysAndWeeksWithWeekends,
  dateFormat,
  findDifferenceInMonthsAndDays,
  splitWeeksAndDays,
  TIDENES_ENDE,
  timeFormat,
  getRangeOfMonths,
  visningsdato,
  isValidDate,
  convertHoursToDays,
  formatereLukketPeriode,
  formatDate
} from './src/dateUtils';
export { default as decodeHtmlEntity } from './src/decodeHtmlEntity';
export { fodselsnummerPattern, isValidFodselsnummer } from './src/fodselsnummerUtils';
export {
  ISO_DATE_FORMAT,
  DDMMYYYY_DATE_FORMAT,
  DDMMYY_DATE_FORMAT,
  HHMM_TIME_FORMAT,
  ACCEPTED_DATE_INPUT_FORMATS,
} from './src/formats';
export { default as guid } from './src/guid';
export { utledArbeidsforholdNavn } from './src/arbeidsforholdUtils';
export {
  replaceNorwegianCharacters,
  getLanguageCodeFromSprakkode,
  getLanguageFromSprakkode,
} from './src/languageUtils';
export {
  notNull,
  isObjectEmpty,
  arrayToObject,
  diff,
  isEqual,
  isEqualToOneOf,
  isObject,
  omit,
} from './src/objectUtils';
export { default as getAddresses } from './src/getAddresses';
export { parseQueryString, buildPath, formatArray, formatQueryString, parseArray } from './src/urlUtils';
export {
  ariaCheck,
  validateProsentandel,
  isUtbetalingsgradMerSamitidigUttaksprosent,
  isUkerOgDagerVidNullUtbetalningsgrad,
  isWithinOpptjeningsperiode,
  hasValidPeriod,
  hasValidPeriodIncludingOtherErrors,
  validPeriodeFomTom,
  isDatesEqual,
  dateIsAfter,
  arrayMinLength,
  hasValidValue,
  hasValidName,
  hasValidText,
  hasValidFodselsnummer,
  hasValidFodselsnummerFormat,
  dateAfterOrEqualToToday,
  dateAfterToday,
  dateBeforeOrEqualToToday,
  dateBeforeToday,
  dateRangesNotOverlapping,
  dateRangesNotOverlappingCrossTypes,
  dateAfterOrEqual,
  dateIsBefore,
  dateBeforeOrEqual,
  hasValidDate,
  hasValidSaksnummerOrFodselsnummerFormat,
  hasValidDecimal,
  hasValidInteger,
  hasValidDecimalMaxNumberOfDecimals,
  maxValue,
  minValue,
  maxValueFormatted,
  minValueFormatted,
  maxLength,
  minLength,
  requiredIfCustomFunctionIsTrue,
  requiredIfNotPristine,
  notDash,
  required,
  maxLengthOrFodselsnr,
  isArbeidsProsentVidUtsettelse100,
  isutbetalingPlusArbeidsprosentMerEn100,
  isTrekkdagerMerEnnNullUtsettelse,
  isUtbetalingMerEnnNullUtsettelse,
  hasValidOrgNumber,
  hasValidOrgNumberOrFodselsnr,
} from './src/validation/validators';

export {
  isRequiredMessage,
  sammeFodselsnummerSomSokerMessage,
  dateRangesOverlappingMessage,
  dateRangesOverlappingBetweenPeriodTypesMessage,
  invalidPeriodMessage,
  invalidDateMessage,
  invalidDecimalMessage,
  dateNotBeforeOrEqualMessage,
  dateNotAfterOrEqualMessage,
} from './src/validation/messages';

export { default as MicroFrontend } from './src/micro-frontends/MicroFrontend';
export { findEndpointsForMicrofrontend } from './src/micro-frontends/findEndpointsForMicrofrontend';
export { httpErrorHandler } from './src/micro-frontends/httpErrorHandler';
export { findAksjonspunkt } from './src/micro-frontends/findAksjonspunkt';
export type { SimpleEndpoints } from './src/micro-frontends/types/SimpleEndpoints';
export type { SimpleLink } from './src/micro-frontends/types/SimpleLink';

export { getKodeverknavnFn, konverterKodeverkTilKode } from './src/kodeverkUtils';
export { joinNonNullStrings, safeJSONParse } from './src/stringUtils';
export type { Adresser } from './src/getAddresses';
