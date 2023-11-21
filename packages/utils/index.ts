export {
  range,
  flatten,
  haystack,
  isArrayEmpty,
  without,
  zip,
  makeArrayWithoutDuplicates,
  getArrayDifference,
} from './src/arrayUtils';
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
  formatDate,
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

export { findEndpointsForMicrofrontend } from './src/micro-frontends/findEndpointsForMicrofrontend';
export { httpErrorHandler } from './src/micro-frontends/httpErrorHandler';
export { findAksjonspunkt } from './src/micro-frontends/findAksjonspunkt';

export { getKodeverknavnFn, konverterKodeverkTilKode } from './src/kodeverkUtils';
export { joinNonNullStrings, safeJSONParse } from './src/stringUtils';
export type { Adresser } from './src/getAddresses';
export { default as mapVilkar } from './src/beregning/VilkarMapper';
export { default as transformBeregningValues } from './src/beregning/transformValuesBeregning';
export { default as useLocalStorage } from './src/useLocalStorageHook';
export { default as bemUtils } from './src/bemUtils';
export { isDayAfter, isSameOrBefore } from './src/date-utils/dateComparison';
export { default as CheckboxGroup } from './src/form-utils/CheckboxGroup';
export { default as Datepicker } from './src/form-utils/Datepicker';
export { default as PeriodpickerList } from './src/form-utils/PeriodpickerList';
export { default as RadioGroupPanel } from './src/form-utils/RadioGroupPanel';
export { default as YesOrNoQuestion } from './src/form-utils/YesOrNoQuestion';
export { default as TextArea } from './src/form-utils/TextArea';
export { get, post } from './src/http-utils/httpUtils';
export {
  isForbidden,
  isUnauthorized,
  handleErrorExternally,
  httpErrorShouldBeHandledExternally,
} from './src/http-utils/responseHelpers';
export { default as Period } from './src/period-utils/Period';
export { default as getPeriodDifference } from './src/period-utils/getPeriodDifference';
export { default as getHumanReadablePeriodString } from './src/period-utils/getHumanReadablePeriodString';
export { default as sortPeriodsByFomDate } from './src/period-utils/sortPeriodsByFomDate';
export { default as prettifyPeriodList } from './src/period-utils/prettifyPeriodList';
export { default as findHolesInPeriods } from './src/period-utils/findHolesInPeriods';
