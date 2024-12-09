export { utledArbeidsforholdNavn } from './src/arbeidsforholdUtils';
export { getArrayDifference, haystack, makeArrayWithoutDuplicates, range } from './src/arrayUtils';
export {
  formatCurrencyNoKr,
  formatCurrencyWithKr,
  parseCurrencyInput,
  removeSpacesFromNumber,
} from './src/currencyUtils';
export { default as decodeHtmlEntity } from './src/decodeHtmlEntity';
export { fodselsnummerPattern, isValidFodselsnummer } from './src/fodselsnummerUtils';
export { default as getAddresses } from './src/getAddresses';
export { default as guid } from './src/guid';
export {
  getLanguageCodeFromSprakkode,
  getLanguageFromSprakkode,
  replaceNorwegianCharacters,
} from './src/languageUtils';
export { diff, isEqual, omit } from './src/objectUtils';
export { buildPath, formatQueryString, parseQueryString } from './src/urlUtils';
export {
  ariaCheck,
  dateAfterOrEqual,
  dateAfterOrEqualToToday,
  dateAfterToday,
  dateBeforeOrEqual,
  dateBeforeOrEqualToToday,
  dateBeforeToday,
  dateIsBefore,
  dateRangesNotOverlapping,
  dateRangesNotOverlappingCrossTypes,
  hasValidDate,
  hasValidDecimal,
  hasValidDecimalMaxNumberOfDecimals,
  hasValidFodselsnummer,
  hasValidFodselsnummerFormat,
  hasValidInteger,
  hasValidName,
  hasValidOrgNumber,
  hasValidOrgNumberOrFodselsnr,
  hasValidPeriod,
  hasValidSaksnummerOrFodselsnummerFormat,
  hasValidText,
  isWithinOpptjeningsperiode,
  maxLength,
  maxLengthOrFodselsnr,
  maxValue,
  maxValueFormatted,
  minLength,
  minValue,
  minValueFormatted,
  notDash,
  required,
  requiredIfCustomFunctionIsTrue,
  requiredIfNotPristine,
} from './src/validation/validators';

export {
  dateNotAfterOrEqualMessage,
  dateNotBeforeOrEqualMessage,
  dateRangesOverlappingBetweenPeriodTypesMessage,
  dateRangesOverlappingMessage,
  invalidDateMessage,
  invalidDecimalMessage,
  invalidPeriodMessage,
  isRequiredMessage,
  sammeFodselsnummerSomSokerMessage,
} from './src/validation/messages';

export { findAksjonspunkt } from './src/micro-frontends/findAksjonspunkt';
export { findEndpointsFromRels } from './src/micro-frontends/findEndpointsFromRels';
export { httpErrorHandler } from './src/micro-frontends/httpErrorHandler';

export { default as transformBeregningValues } from './src/beregning/transformValuesBeregning';
export { default as mapVilkar } from './src/beregning/VilkarMapper';
export { default as addYearsToDate } from './src/date-utils/addYearsToDate';
export { isDayAfter, isSameOrBefore } from './src/date-utils/dateComparison';
export { default as dateConstants } from './src/date-utils/dateConstants';
export { prettifyDate, prettifyDateString } from './src/date-utils/format';
export { dateStringSorter } from './src/date-utils/sort';
export type { Adresser } from './src/getAddresses';
export { get, post } from './src/http-utils/axiosHttpUtils';
export {
  handleErrorExternally,
  httpErrorShouldBeHandledExternally,
  isForbidden,
  isUnauthorized,
} from './src/http-utils/responseHelpers';
export { getKodeverknavnFn, konverterKodeverkTilKode } from './src/kodeverkUtils';
export { default as findHolesInPeriods } from './src/period-utils/findHolesInPeriods';
export { default as getHumanReadablePeriodString } from './src/period-utils/getHumanReadablePeriodString';
export { default as getPeriodDifference } from './src/period-utils/getPeriodDifference';
export { default as Period } from './src/period-utils/Period';
export { default as prettifyPeriodList } from './src/period-utils/prettifyPeriodList';
export { default as sortPeriodsByFomDate } from './src/period-utils/sortPeriodsByFomDate';
export { joinNonNullStrings, safeJSONParse } from './src/stringUtils';
export * as httpUtils from './src/http-utils/axiosHttpUtils';
