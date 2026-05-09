import { isAlertInfo } from '../AlertInfo.js';
import { sentryReportedErrorIdLookup } from '../sentry.js';
import { ExtendedApiError } from '@k9-sak-web/backend/shared/errorhandling/ExtendedApiError.js';
import { AxiosError } from 'axios';

export const makeErrorReportText = (errors: ReadonlyArray<Error>): string => {
  const errLines: string[] = [];
  for (const error of errors) {
    const errorId = isAlertInfo(error) ? error.errorId : '';
    const sentryId = `sentry:${sentryReportedErrorIdLookup.get(error)}`;
    errLines.push(`**** ${error.name} (id:${errorId}, ${sentryId}) ****`);
    errLines.push(`${error.message}`);
    if (error instanceof ExtendedApiError) {
      errLines.push(`NavCallid:${error.navCallid}`);
    }
    if (error instanceof AxiosError) {
      const callId = error.config?.headers.get('Nav-Callid');
      if (typeof callId === 'string') {
        errLines.push(`NavCallid:${callId}`);
      }
    }
    errLines.push('/');
  }
  return errLines.join('\n');
};
