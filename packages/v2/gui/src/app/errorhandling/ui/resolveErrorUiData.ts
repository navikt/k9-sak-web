import { isErrorWithAlertInfo } from '../alerts/AlertInfo.js';
import { ExtendedApiError } from '@k9-sak-web/backend/shared/errorhandling/ExtendedApiError.js';
import { AdditionalInfoError } from '../AdditionalInfoError.js';

export const resolveErrorUiData = (error: Error | undefined) => {
  const errorId = isErrorWithAlertInfo(error) ? error.errorId : undefined;
  let errorRef = errorId != null ? `${errorId}` : undefined;
  if (error instanceof ExtendedApiError && error.navCallid != null) {
    errorRef = errorRef != null ? `${errorRef}, ${error.navCallid}` : error.navCallid;
  }
  const additionalInfo = error instanceof AdditionalInfoError ? error.additionalInfo : undefined;
  return { errorId, errorRef, additionalInfo };
};
