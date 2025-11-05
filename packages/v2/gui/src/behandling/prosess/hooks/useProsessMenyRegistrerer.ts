import { useEffect } from 'react';
import { useProsessMenyContextOptional } from '../context/ProsessMenyContext.js';
import type { PanelRegistrering } from '../types/panelTypes.js';

/**
 * Hook for å registrere et prosesspanel.
 * 
 * Panelet vil vises i menyen og kan velges av brukeren.
 * Når komponenten unmountes, avregistreres panelet automatisk.
 * Hvis registreringsdata endres, vil panelet re-registreres med oppdatert informasjon.
 * 
 * @param registrering - Panelregistreringsdata, eller null hvis panelet ikke skal vises
 * @param registrering.id - Unik panelidentifikator
 * @param registrering.urlKode - URL-parameterverdi (kebab-case)
 * @param registrering.tekstKode - i18n tekstnøkkel for menylabel
 * @param registrering.type - Panelstatus (warning, success, danger, default)
 * @param registrering.usePartialStatus - Om panelet har delvis status
 * 
 * @throws Error hvis brukt utenfor ProsessMenyProvider
 * 
 * @example
 * ```tsx
 * function BeregningProsessStegInitPanel() {
 *   useProsessMenyRegistrerer({
 *     id: 'beregning',
 *     urlKode: 'beregning',
 *     tekstKode: 'Beregning.Title',
 *     type: 'success',
 *     usePartialStatus: false,
 *   });
 *   
 *   return <BeregningPanel />;
 * }
 * ```
 */
export function useProsessMenyRegistrerer(registrering: PanelRegistrering | null): void {
  const context = useProsessMenyContextOptional();

  useEffect(() => {
    // Hvis vi ikke er inne i en ProsessMeny, ikke gjør noe
    if (!context) {
      return;
    }

    // Hvis registrering er null, ikke registrer panelet
    if (!registrering) {
      return;
    }

    try {
      console.debug('Panel registrerer seg:', {
        id: registrering.id,
        urlKode: registrering.urlKode,
        type: registrering.type,
      });

      context.registrerPanel(registrering);
    } catch (error) {
      console.error('Kunne ikke registrere panel:', registrering.id, error);
      // Ikke throw. La andre paneler fortsette å fungere
    }

    // Cleanup: Avregistrer panel når komponenten unmountes
    return () => {
      try {
        console.debug('Panel avregistrerer seg:', registrering.id);
        context.avregistrerPanel(registrering.id);
      } catch (error) {
        console.error('Kunne ikke avregistrere panel:', registrering.id, error);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    // Re-kjør effect når registreringsdata endres
    registrering?.id,
    registrering?.urlKode,
    registrering?.tekstKode,
    registrering?.type,
    registrering?.usePartialStatus,
    registrering?.erAktiv,
    // NB: context er utelatt for å ungå loops
    // Context funksjonene trenger ikke trigge omregistrering
  ]);
}
