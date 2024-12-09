import { validateTextCharacters } from '@k9-sak-web/gui/utils/validation/validateTextCharacters.js';
import { DDMMYYYY_DATE_FORMAT } from '@k9-sak-web/lib/dateUtils/formats.js';
import moment, { Moment } from 'moment';
import { removeSpacesFromNumber } from '../currencyUtils';
import { fodselsnummerPattern, isValidFodselsnummer } from '../fodselsnummerUtils';
import {
  dateNotAfterOrEqualMessage,
  dateNotBeforeOrEqualMessage,
  dateRangesOverlappingBetweenPeriodTypesMessage,
  dateRangesOverlappingMessage,
  invalidDateMessage,
  invalidDatesInPeriodMessage,
  invalidDecimalMessage,
  invalidFodselsnummerFormatMessage,
  invalidFodselsnummerMessage,
  invalidIntegerMessage,
  invalidNumberMessage,
  invalidOrgNumberMessage,
  invalidOrgNumberOrFodselsnrMessage,
  invalidPeriodMessage,
  invalidPeriodRangeMessage,
  invalidSaksnummerOrFodselsnummerFormatMessage,
  invalidTextMessage,
  isRequiredMessage,
  maxLengthMessage,
  maxLengthOrFodselsnrMessage,
  maxValueMessage,
  minLengthMessage,
  minValueMessage,
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

export const maxLengthOrFodselsnr = (length: number) => (text: string) =>
  isEmpty(text) || text.toString().trim().length <= length ? null : maxLengthOrFodselsnrMessage(length);
export const required = (value: string) => (isEmpty(value) ? isRequiredMessage() : undefined);
export const atLeastOneRequired = (value: string, otherValue: string) =>
  isEmpty(value) && isEmpty(otherValue) ? isRequiredMessage() : undefined;
export const notDash = (value: string) => (value === '-' ? isRequiredMessage() : undefined);
export const requiredIfNotPristine = (value: string, allValues, props: { pristine: boolean }) =>
  props.pristine || !isEmpty(value) ? undefined : isRequiredMessage();
export const requiredIfCustomFunctionIsTrue = isRequiredFunction => (value: string, allValues, props) =>
  isEmpty(value) && isRequiredFunction(allValues, props) ? isRequiredMessage() : undefined;

export const minLength = (length: number) => (text: string) =>
  isEmpty(text) || text.toString().trim().length >= length ? null : minLengthMessage(length);
export const maxLength = (length: number) => (text: string) =>
  isEmpty(text) || text.toString().trim().length <= length ? null : maxLengthMessage(length);

export const minValue = (length: number) => (number: number | string) =>
  +number >= length ? null : minValueMessage(length);
export const maxValue = (length: number) => (number: number | string) =>
  +number <= length ? null : maxValueMessage(length);

export const minValueFormatted = (min: number) => (number: number) =>
  removeSpacesFromNumber(number) >= min ? null : minValueMessage(min);
export const maxValueFormatted = (max: number) => (number: number) =>
  removeSpacesFromNumber(number) <= max ? null : maxValueMessage(max);

export const hasValidOrgNumber = (number: number | string) =>
  number.toString().trim().length === 9 ? null : invalidOrgNumberMessage();
export const hasValidOrgNumberOrFodselsnr = (number: number) =>
  number.toString().trim().length === 9 || number.toString().trim().length === 11
    ? null
    : invalidOrgNumberOrFodselsnrMessage();

const hasValidNumber = (text: string | number) =>
  isEmpty(text) || numberRegex.test(`${text}`) ? null : invalidNumberMessage(text);
const hasValidInt = (text: string | number) =>
  isEmpty(text) || integerRegex.test(`${text}`) ? null : invalidIntegerMessage(text);
const hasValidDec = (text: string | number, maxNumberOfDecimals: number = 2) =>
  isEmpty(text) || decimalRegexWithMax(maxNumberOfDecimals).test(`${text}`)
    ? null
    : invalidDecimalMessage(text, maxNumberOfDecimals);
export const hasValidInteger = (text: string | number) => hasValidNumber(text) || hasValidInt(text);
export const hasValidDecimalMaxNumberOfDecimals = (maxNumberOfDecimals: number) => (text: string) =>
  hasValidNumber(text) || hasValidDec(text, maxNumberOfDecimals);
export const hasValidDecimal = (text: string | number) => hasValidNumber(text) || hasValidDec(text);

export const hasValidSaksnummerOrFodselsnummerFormat = (text: string) =>
  isEmpty(text) || saksnummerOrFodselsnummerPattern.test(text) ? null : invalidSaksnummerOrFodselsnummerFormatMessage();

export const hasValidDate = (text: string) => (isEmpty(text) || isoDateRegex.test(text) ? null : invalidDateMessage());
const getBeforeErrorMessage = (latest: string | Moment | Date, customErrorMessage: (date: string) => string) => {
  const date = moment(latest).format(DDMMYYYY_DATE_FORMAT);
  return customErrorMessage ? customErrorMessage(date) : dateNotBeforeOrEqualMessage(date);
};
export const dateBeforeOrEqual =
  (latest: string | Moment | Date, customErrorMessageFunction: (date: string) => string = undefined) =>
  (text: string) =>
    isEmpty(text) || moment(text).isSameOrBefore(moment(latest).startOf('day'))
      ? null
      : getBeforeErrorMessage(latest, customErrorMessageFunction);
const getAfterErrorMessage = (earliest: string | Moment | Date, customErrorMessage: (date: string) => any) => {
  const date = moment(earliest).format(DDMMYYYY_DATE_FORMAT);
  return customErrorMessage ? customErrorMessage(date) : dateNotAfterOrEqualMessage(date);
};
export const dateAfterOrEqual =
  (earliest: string | Moment | Date, customErrorMessageFunction?: (date: string) => string) =>
  (text: string | Moment) =>
    isEmpty(text) || moment(text).isSameOrAfter(moment(earliest).startOf('day'))
      ? null
      : getAfterErrorMessage(earliest, customErrorMessageFunction);
export const dateIsBefore =
  (dateToCheckAgainst: string, errorMessageFunction: (date: string) => { id?: string; dato?: string }[]) =>
  (inputDate: string) =>
    isEmpty(inputDate) || moment(inputDate).isBefore(moment(dateToCheckAgainst).startOf('day'))
      ? null
      : errorMessageFunction(moment(dateToCheckAgainst).format(DDMMYYYY_DATE_FORMAT));

export const dateRangesNotOverlapping = (ranges: Array<string[]>) =>
  dateRangesAreSequential(ranges) ? null : dateRangesOverlappingMessage();
export const dateRangesNotOverlappingCrossTypes = (ranges: Array<string[]>) =>
  dateRangesAreSequential(ranges) ? null : dateRangesOverlappingBetweenPeriodTypesMessage();

export const dateBeforeToday = (text: string) => dateBeforeOrEqual(yesterday())(text);
export const dateBeforeOrEqualToToday = (text: string) => dateBeforeOrEqual(moment().startOf('day'))(text);
export const dateAfterToday = (text: string) => dateAfterOrEqual(tomorrow())(text);
export const dateAfterOrEqualToToday = (text: string) => dateAfterOrEqual(moment().startOf('day'))(text);

export const hasValidFodselsnummerFormat = (text: string) =>
  !fodselsnummerPattern.test(text) ? invalidFodselsnummerFormatMessage() : null;
export const hasValidFodselsnummer = (text: string) =>
  !isValidFodselsnummer(text) ? invalidFodselsnummerMessage() : null;

export const hasValidText = (text: string) => {
  if (text === undefined || text === null) {
    return null;
  }
  const { invalidCharacters } = validateTextCharacters(text);
  if (invalidCharacters?.length > 0) {
    const invalidCharacterString: string = invalidCharacters
      .map(invalidChar => invalidChar.replace(/[\t]/, 'Tabulatortegn'))
      .join('');
    return invalidTextMessage(invalidCharacterString);
  }
  return null;
};

export const hasValidName = (text: string) => {
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
