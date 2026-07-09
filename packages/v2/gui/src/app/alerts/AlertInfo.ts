export interface AlertInfo {
  /**
   * A somewhat randomly generated number to quite uniquely identify an error instance.
   *
   * This is presented to the user when displaying error the message.
   *
   * This should be included as metadata in further reporting of the error (in sentry, etc) so that we can correlate with
   * error reports from users.
   */
  readonly errorId: number;
}

export const isAlertInfo = (v: unknown): v is AlertInfo =>
  v !== null && typeof v === 'object' && 'errorId' in v && typeof v.errorId === 'number' && v.errorId > 0;

export type ErrorWithAlertInfo = Error & AlertInfo;

export const isErrorWithAlertInfo = (v: unknown): v is ErrorWithAlertInfo => v instanceof Error && isAlertInfo(v);

export const makeErrorId = (): number => Math.floor(Math.random() * 1000000000);
