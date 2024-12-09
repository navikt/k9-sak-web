export const isRequiredMessage = () => [{ id: 'ValidationMessage.NotEmpty' }];
export const minLengthMessage = length => [{ id: 'ValidationMessage.MinLength' }, { length }];
export const maxLengthMessage = length => [{ id: 'ValidationMessage.MaxLength' }, { length }];
export const minValueMessage = (length: number) => [{ id: 'ValidationMessage.MinValue' }, { length }];
export const maxValueMessage = (length: number) => [{ id: 'ValidationMessage.MaxValue' }, { length }];
export const invalidDateMessage = () => [{ id: 'ValidationMessage.InvalidDate' }];
export const invalidIntegerMessage = text => [{ id: 'ValidationMessage.InvalidInteger' }, { text }];
export const invalidDecimalMessage = (text, maxNumberOfDecimals) => [
  { id: 'ValidationMessage.InvalidDecimal' },
  { text, maxNumberOfDecimals },
];
export const dateNotBeforeOrEqualMessage = limit => [{ id: 'ValidationMessage.DateNotBeforeOrEqual' }, { limit }];
export const dateNotAfterOrEqualMessage = limit => [{ id: 'ValidationMessage.DateNotAfterOrEqual' }, { limit }];
export const dateRangesOverlappingMessage = () => [{ id: 'ValidationMessage.DateRangesOverlapping' }];
export const invalidFodselsnummerFormatMessage = () => [{ id: 'ValidationMessage.InvalidFodselsnummerFormat' }];
export const invalidFodselsnummerMessage = () => [{ id: 'ValidationMessage.InvalidFodselsnummer' }];
export const invalidSaksnummerOrFodselsnummerFormatMessage = () => [
  { id: 'ValidationMessage.InvalidSaksnummerOrFodselsnummerFormat' },
];
export const invalidTextMessage = text => [{ id: 'ValidationMessage.InvalidText' }, { text }];
export const invalidDatesInPeriodMessage = () => [{ id: 'ValidationMessage.InvalidDatesInPeriod' }];
export const invalidPeriodMessage = () => [{ id: 'ValidationMessage.InvalidPeriod' }];
export const invalidPeriodRangeMessage = () => [{ id: 'ValidationMessage.InvalidPeriodRange' }];
export const invalidNumberMessage = text => [{ id: 'ValidationMessage.InvalidNumber' }, { text }];
export const invalidOrgNumberMessage = () => [{ id: 'ValidationMessage.InvalidOrganisasjonsnummer' }];
