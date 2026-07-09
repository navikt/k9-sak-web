import { useContext, useCallback } from 'react';

import { RestApiErrorDispatchContext } from './RestApiErrorContext';

/**
 * Hook som tilbyr funksjoner for å legge til eller fjerne feil i kontekst.
 * Fungerer kun i komponenter som har en @see RestApiErrorProvider over seg i komponent-treet.
 */
const useRestApiErrorDispatcher = () => {
  const dispatch = useContext(RestApiErrorDispatchContext);

  const addErrorMessage = useCallback(data => dispatch?.({ type: 'add', data }), [dispatch]);
  const removeErrorMessages = useCallback(() => dispatch?.({ type: 'remove' }), [dispatch]);

  return {
    addErrorMessage,
    removeErrorMessages,
  };
};

export default useRestApiErrorDispatcher;
