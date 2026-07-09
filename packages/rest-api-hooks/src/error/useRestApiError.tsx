import { useContext } from 'react';

import { RestApiErrorStateContext } from './RestApiErrorContext';

/**
 * Hook som henter alle feilmeldinger registrert i kontekst.
 * Fungerer kun i komponenter som har en @see RestApiErrorProvider over seg i komponent-treet.
 */
const useRestApiError = () => {
  const state = useContext(RestApiErrorStateContext);
  return state.errors;
};

export default useRestApiError;
