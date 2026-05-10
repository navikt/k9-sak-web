import { useGlobalUnhandledErrors } from '@k9-sak-web/gui/app/errorhandling/GlobalUnhandledErrorCatcher.js';
import { LegacyApiError } from '@k9-sak-web/gui/app/errorhandling/legacycompat/LegacyApiError.js';

/**
 * Hook som henter alle feilmeldinger av type LegacyApiError frå GlobalUnhandledErrorCatcher.
 * Må derfor har GlobalUnhandledErrorCatcher over seg i komponent-treet for å fungere.
 * @deprecated Kun for bruk i legacy kode, som tidlegare brukte samme kall for å hente feil frå RestApiErrorStateContext
 */
const useRestApiError = () => {
  const { globalErrors } = useGlobalUnhandledErrors();
  return globalErrors.filter(err => err instanceof LegacyApiError);
};

export default useRestApiError;
