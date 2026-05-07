import { isErrorWithAlertInfo } from '../AlertInfo.js';
import { ExtendedApiError } from '@k9-sak-web/backend/shared/errorhandling/ExtendedApiError.js';
import { AdditionalInfoError } from '../AdditionalInfoError.js';
import { SentryReportedError } from '../SentryReportedError.js';

export const resolveErrorUiData = (error: Readonly<Error | undefined>) => {
  const errorId = isErrorWithAlertInfo(error) ? error.errorId : undefined;
  let errorRef = errorId != null ? `${errorId}` : undefined;
  if (error instanceof SentryReportedError) {
    const sentryRef = `S:${error.sentryId}`;
    errorRef = errorRef != null ? `${errorRef}, ${sentryRef}` : sentryRef;
    error = error.reported;
  }
  if (error instanceof ExtendedApiError && error.navCallid != null) {
    errorRef = errorRef != null ? `${errorRef}, ${error.navCallid}` : error.navCallid;
  }
  const additionalInfo = error instanceof AdditionalInfoError ? error.additionalInfo : undefined;
  return { errorId, errorRef, additionalInfo };
};
