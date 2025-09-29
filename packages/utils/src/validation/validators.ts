import { validateTextCharacters } from '@k9-sak-web/gui/utils/validation/validateTextCharacters.js';
import { DDMMYYYY_DATE_FORMAT } from '@k9-sak-web/lib/dateUtils/formats.js';
import moment, { Moment } from 'moment';
import { fodselsnummerPattern, isValidFodselsnummer } from '../fodselsnummerUtils';
import {
  dateNotAfterOrEqualMessage,
  dateNotBeforeOrEqualMessage,
  dateRangesOverlappingMessage,
  invalidDateMessage,
  invalidDatesInPeriodMessage,
  invalidDecimalMessage,
  invalidFodselsnummerFormatMessage,
  invalidFodselsnummerMessage,
  invalidIntegerMessage,
  invalidNumberMessage,
  invalidOrgNumberMessage,
  invalidPeriodMessage,
  invalidPeriodRangeMessage,
  invalidSaksnummerOrFodselsnummerFormatMessage,
  invalidTextMessage,
  isRequiredMessage,
  maxLengthMessage,
  maxValueMessage,
  minLengthMessage,
  minValueMessage,
  ErrorMessage,
} from './messages';
import {
  dateRangesAreSequential,
  decimalRegexWithMax,
  integerRegex,
  isEmpty,
  isoDateRegex,
  nameGyldigRegex,
  nameRegex,
  numberRegex,
  saksnummerOrFodselsnummerPattern,
  tomorrow,
  yesterday,
} from './validatorsHelper';

export type ValidationReturnType = ErrorMessage | null | undefined | string;
export const required = (value: string): ValidationReturnType => (isEmpty(value) ? isRequiredMessage() : undefined);
export const atLeastOneRequired = (value: string, otherValue: string): ValidationReturnType =>
  isEmpty(value) && isEmpty(otherValue) ? isRequiredMessage() : undefined;
export const requiredIfNotPristine = (value: string, allValues, props: { pristine: boolean }): ValidationReturnType =>
  props.pristine || !isEmpty(value) ? undefined : isRequiredMessage();
export const requiredIfCustomFunctionIsTrue =
  isRequiredFunction =>
  (value: string, allValues, props): ValidationReturnType =>
    isEmpty(value) && isRequiredFunction(allValues, props) ? isRequiredMessage() : undefined;

export const minLength =
  (length: number) =>
  (text: string): ValidationReturnType =>
    isEmpty(text) || text.toString().trim().length >= length ? null : minLengthMessage(length);
export const maxLength =
  (length: number) =>
  (text: string): ValidationReturnType =>
    isEmpty(text) || text.toString().trim().length <= length ? null : maxLengthMessage(length);

export const minValue =
  (length: number) =>
  (number: number | string): ValidationReturnType =>
    +number >= length ? null : minValueMessage(length);
export const maxValue =
  (length: number) =>
  (number: number | string): ValidationReturnType =>
    +number <= length ? null : maxValueMessage(length);

export const hasValidOrgNumber = (number: number | string): ValidationReturnType =>
  number.toString().trim().length === 9 ? null : invalidOrgNumberMessage();

const hasValidNumber = (text: string | number): ValidationReturnType =>
  isEmpty(text) || numberRegex.test(`${text}`) ? null : invalidNumberMessage(text);
const hasValidInt = (text: string | number): ValidationReturnType =>
  isEmpty(text) || integerRegex.test(`${text}`) ? null : invalidIntegerMessage(text);
const hasValidDec = (text: string | number, maxNumberOfDecimals: number = 2): ValidationReturnType =>
  isEmpty(text) || decimalRegexWithMax(maxNumberOfDecimals).test(`${text}`)
    ? null
    : invalidDecimalMessage(text, maxNumberOfDecimals);
export const hasValidInteger = (text: string | number): ValidationReturnType =>
  hasValidNumber(text) || hasValidInt(text);
export const hasValidDecimalMaxNumberOfDecimals =
  (maxNumberOfDecimals: number) =>
  (text: string): ValidationReturnType =>
    hasValidNumber(text) || hasValidDec(text, maxNumberOfDecimals);
export const hasValidDecimal = (text: string | number): ValidationReturnType =>
  hasValidNumber(text) || hasValidDec(text);

export const hasValidSaksnummerOrFodselsnummerFormat = (text: string): ValidationReturnType =>
  isEmpty(text) || saksnummerOrFodselsnummerPattern.test(text) ? null : invalidSaksnummerOrFodselsnummerFormatMessage();

export const hasValidDate = (text: string): ValidationReturnType =>
  isEmpty(text) || isoDateRegex.test(text) ? null : invalidDateMessage();
const getBeforeErrorMessage = (
  latest: string | Moment | Date,
  customErrorMessage: ((date: string) => string) | undefined,
) => {
  const date = moment(latest).format(DDMMYYYY_DATE_FORMAT);
  return customErrorMessage ? customErrorMessage(date) : dateNotBeforeOrEqualMessage(date);
};
export const dateBeforeOrEqual =
  (latest: string | Moment | Date, customErrorMessageFunction?: (date: string) => string) =>
  (text: string): ValidationReturnType =>
    isEmpty(text) || moment(text).isSameOrBefore(moment(latest).startOf('day'))
      ? null
      : getBeforeErrorMessage(latest, customErrorMessageFunction);
const getAfterErrorMessage = (earliest: string | Moment | Date, customErrorMessage?: (date: string) => string) => {
  const date = moment(earliest).format(DDMMYYYY_DATE_FORMAT);
  return customErrorMessage ? customErrorMessage(date) : dateNotAfterOrEqualMessage(date);
};
export const dateAfterOrEqual =
  (earliest: string | Moment | Date, customErrorMessageFunction?: (date: string) => string) =>
  (text: string | Moment): ValidationReturnType =>
    isEmpty(text) || moment(text).isSameOrAfter(moment(earliest).startOf('day'))
      ? null
      : getAfterErrorMessage(earliest, customErrorMessageFunction);

export const dateRangesNotOverlapping = (ranges: Array<string[]>): ValidationReturnType =>
  dateRangesAreSequential(ranges) ? null : dateRangesOverlappingMessage();

export const dateBeforeToday = (text: string): ValidationReturnType => dateBeforeOrEqual(yesterday())(text);
export const dateBeforeOrEqualToToday = (text: string): ValidationReturnType =>
  dateBeforeOrEqual(moment().startOf('day'))(text);
export const dateAfterToday = (text: string): ValidationReturnType => dateAfterOrEqual(tomorrow())(text);
export const dateAfterOrEqualToToday = (text: string): ValidationReturnType =>
  dateAfterOrEqual(moment().startOf('day'))(text);

export const hasValidFodselsnummerFormat = (text: string): ValidationReturnType =>
  !fodselsnummerPattern.test(text) ? invalidFodselsnummerFormatMessage() : null;
export const hasValidFodselsnummer = (text: string): ValidationReturnType =>
  !isValidFodselsnummer(text) ? invalidFodselsnummerMessage() : null;

export const hasValidText = (text: string): ValidationReturnType => {
  if (text === undefined || text === null) {
    return null;
  }
  const { invalidCharacters } = validateTextCharacters(text);
  if (invalidCharacters && invalidCharacters?.length > 0) {
    const invalidCharacterString = invalidCharacters
      .map(invalidChar => invalidChar.replace(/[\t]/, 'Tabulatortegn'))
      .join('');
    return invalidTextMessage(invalidCharacterString);
  }
  return null;
};

export const hasValidName = (text: string): ValidationReturnType => {
  if (!nameRegex.test(text)) {
    const illegalChars = text.replace(nameGyldigRegex, '');
    return invalidTextMessage(illegalChars.replace(/[\t]/g, 'Tabulatortegn'));
  }
  return null;
};

export const hasValidPeriod = (fomDate: string, tomDate: string) => {
  if (isEmpty(fomDate) && isEmpty(tomDate)) {
    return null;
  }
  if (!isoDateRegex.test(fomDate) || !isoDateRegex.test(tomDate)) {
    return invalidDatesInPeriodMessage();
  }
  return moment(fomDate).isSameOrBefore(moment(tomDate).startOf('day')) ? null : invalidPeriodMessage();
};

export const isWithinOpptjeningsperiode =
  (fomDateLimit: string, tomDateLimit: string) => (fom: string, tom: string) => {
    const isBefore = moment(fom).isBefore(moment(fomDateLimit));
    const isAfter = moment(tom).isAfter(moment(tomDateLimit));
    return isBefore || isAfter ? invalidPeriodRangeMessage() : null;
  };

export const ariaCheck = () => {
  let errors;
  setTimeout(() => {
    if (document.getElementsByClassName('skjemaelement__feilmelding').length > 0) {
      errors = document.getElementsByClassName('skjemaelement__feilmelding');
    } else if (document.getElementsByClassName('alertstripe--advarsel')) {
      errors = document.getElementsByClassName('alertstripe--advarsel');
    }
    if (errors && errors.length > 0) {
      const ariaNavTab = document.createAttribute('tabindex');
      ariaNavTab.value = '-1';
      const firstError = errors[0];
      firstError.setAttributeNode(ariaNavTab);
      const element = document.activeElement as HTMLElement;
      element.blur();
      firstError.focus();
    }
  }, 300);
};
