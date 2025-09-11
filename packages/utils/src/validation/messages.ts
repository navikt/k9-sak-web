type ErrorMessageNoArgument = [{ id: string }]
type ErrorMessageWithArgument = [{ id: string }, { [key: string]: number | string }];

export type ErrorMessage = ErrorMessageNoArgument | ErrorMessageWithArgument;

export const isRequiredMessage = (): ErrorMessageNoArgument => [{ id: 'ValidationMessage.NotEmpty' }];
export const minLengthMessage = (length: number): ErrorMessageWithArgument => [
  { id: 'ValidationMessage.MinLength' },
  { length },
];
export const maxLengthMessage = (length: number): ErrorMessageWithArgument => [
  { id: 'ValidationMessage.MaxLength' },
  { length },
];
export const minValueMessage = (length: number): ErrorMessageWithArgument => [
  { id: 'ValidationMessage.MinValue' },
  { length },
];
export const maxValueMessage = (length: number): ErrorMessageWithArgument => [
  { id: 'ValidationMessage.MaxValue' },
  { length },
];
export const invalidDateMessage = (): ErrorMessage => [{ id: 'ValidationMessage.InvalidDate' }];
export const invalidIntegerMessage = (text: string | number): ErrorMessageWithArgument => [
  { id: 'ValidationMessage.InvalidInteger' },
  { text },
];
export const invalidDecimalMessage = (text: string | number, maxNumberOfDecimals: number): ErrorMessageWithArgument => [
  { id: 'ValidationMessage.InvalidDecimal' },
  { text, maxNumberOfDecimals },
];
export const dateNotBeforeOrEqualMessage = (limit: string): ErrorMessageWithArgument => [
  { id: 'ValidationMessage.DateNotBeforeOrEqual' },
  { limit },
];
export const dateNotAfterOrEqualMessage = (limit: string): ErrorMessageWithArgument => [
  { id: 'ValidationMessage.DateNotAfterOrEqual' },
  { limit },
];
export const dateRangesOverlappingMessage = (): ErrorMessage => [
  { id: 'ValidationMessage.DateRangesOverlapping' },
];
export const invalidFodselsnummerFormatMessage = (): ErrorMessage => [
  { id: 'ValidationMessage.InvalidFodselsnummerFormat' },
];
export const invalidFodselsnummerMessage = (): ErrorMessage => [
  { id: 'ValidationMessage.InvalidFodselsnummer' },
];
export const invalidSaksnummerOrFodselsnummerFormatMessage = (): ErrorMessage => [
  { id: 'ValidationMessage.InvalidSaksnummerOrFodselsnummerFormat' },
];
export const invalidTextMessage = (text: string): ErrorMessageWithArgument => [
  { id: 'ValidationMessage.InvalidText' },
  { text },
];
export const invalidDatesInPeriodMessage = (): ErrorMessage => [
  { id: 'ValidationMessage.InvalidDatesInPeriod' },
];
export const invalidPeriodMessage = (): ErrorMessage => [{ id: 'ValidationMessage.InvalidPeriod' }];
export const invalidPeriodRangeMessage = (): ErrorMessage => [{ id: 'ValidationMessage.InvalidPeriodRange' }];
export const invalidNumberMessage = (text: string | number): ErrorMessageWithArgument => [
  { id: 'ValidationMessage.InvalidNumber' },
  { text },
];
export const invalidOrgNumberMessage = (): ErrorMessage => [
  { id: 'ValidationMessage.InvalidOrganisasjonsnummer' },
];
