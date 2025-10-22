import { useEffect } from 'react';
import { useProsessMenyContext } from '../context/ProsessMenyContext.js';
import type { PanelRegistrering } from '../types/panelTypes.js';

/**
 * Hook for å registrere et prosesspanel med menysystemet.
 * 
 * Panelet vil vises i menyen og kan velges av brukeren.
 * Når komponenten unmountes, avregistreres panelet automatisk.
 * Hvis registreringsdata endres, vil panelet re-registreres med oppdatert informasjon.
 * 
 * @param registrering - Panelregistreringsdata
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
export function useProsessMenyRegistrerer(registrering: PanelRegistrering): void {
  const context = useProsessMenyContext();

  useEffect(() => {
    try {
      console.debug('Panel registrerer seg:', {
        id: registrering.id,
        urlKode: registrering.urlKode,
        type: registrering.type,
      });

      context.registrerPanel(registrering);
    } catch (error) {
      console.error('Kunne ikke registrere panel:', registrering.id, error);
      // Ikke kast feilen - la andre paneler fortsette å fungere
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
  }, [
    // Re-kjør effect når registreringsdata endres
    registrering.id,
    registrering.urlKode,
    registrering.tekstKode,
    registrering.type,
    registrering.usePartialStatus,
    registrering.erAktiv,
    context,
  ]);
}
