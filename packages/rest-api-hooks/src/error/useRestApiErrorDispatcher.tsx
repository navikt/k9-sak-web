import { use, useCallback } from 'react';

import { RestApiErrorDispatchContext } from './RestApiErrorContext';
import FeatureTogglesContext from '@k9-sak-web/gui/featuretoggles/FeatureTogglesContext.js';
import { LegacyApiError } from './LegacyApiError.js';
import { formatErrorMessage } from './formatErrorMessages.js';

/**
 * Hook som tilbyr funksjoner for å legge til eller fjerne feil i kontekst.
 * Fungerer kun i komponenter som har en @see RestApiErrorProvider over seg i komponent-treet.
 */
const useRestApiErrorDispatcher = () => {
  const featuretoggles = use(FeatureTogglesContext);
  const dispatch = use(RestApiErrorDispatchContext);
  const addErrorMessage = useCallback(
    (data: Record<string, unknown>) => {
      const formatertFeilmelding = formatErrorMessage(data);
      if (formatertFeilmelding == null) {
        return;
      }
      if (featuretoggles.GLOBAL_ERROR_CATCHER) {
        throw new LegacyApiError(formatertFeilmelding.text, formatertFeilmelding.extra);
      } else {
        dispatch?.({ type: 'add', data: formatertFeilmelding });
      }
    },
    [featuretoggles, dispatch],
  );
  const removeErrorMessages = useCallback(() => {
    if (featuretoggles.GLOBAL_ERROR_CATCHER) {
      // never clear errors without full reload
    } else {
      dispatch?.({ type: 'remove' });
    }
  }, [featuretoggles, dispatch]);

  return {
    addErrorMessage,
    removeErrorMessages,
  };
};

export default useRestApiErrorDispatcher;
