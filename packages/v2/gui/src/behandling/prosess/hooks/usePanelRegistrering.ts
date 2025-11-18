import { useEffect } from 'react';
import type { ProsessPanelProps, ProcessMenuStepType } from '../types/panelTypes.js';

/**
 * Hook for å registrere et prosesspanel.
 * 
 * @param props - ProsessPanelProps med injiserte callbacks fra ProsessMeny
 * @param panelId - Unik panelidentifikator (definert som konstant i panelet)
 * @param panelTekst - i18n tekstnøkkel for menylabel (definert som konstant i panelet)
 * @param panelType - Panelstatus (warning, success, danger, default)
 * @param usePartialStatus - Valgfritt: Vis delvis fullføringsindikator
 * 
 * @example
 * ```tsx
 * export function BeregningProsessStegInitPanel(props: ProsessPanelProps) {
 *   // 1. Definer panel-identitet som konstanter
 *   const PANEL_ID = 'beregning';
 *   const PANEL_TEKST = 'Beregning.Title';
 *   
 *   // 2. Hent data
 *   const { data } = useBeregningData();
 *   
 *   // 3. Beregn paneltype fra data
 *   const panelType = useMemo((): ProcessMenuStepType => {
 *     if (!data) return 'default';
 *     if (data.harAksjonspunkt) return 'warning';
 *     if (data.vilkarOppfylt) return 'success';
 *     return 'default';
 *   }, [data]);
 *   
 *   // 4. Registrer med menyen
 *   usePanelRegistrering(props, PANEL_ID, PANEL_TEKST, panelType);
 *   
 *   // 5. Render kun hvis valgt
 *   if (!props.erValgt) return null;
 *   
 *   return <Beregning data={data} />;
 * }
 * ```
 */
export function usePanelRegistrering(
  props: ProsessPanelProps,
  panelId: string,
  panelTekst: string,
  panelType: ProcessMenuStepType,
  usePartialStatus?: boolean,
): void {
  const { onRegister, onUnregister, onUpdateType } = props;

  // Initial registrering når komponenten mountes
  useEffect(() => {
    // Hvis callbacks ikke er tilgjengelige, er vi ikke inne i en ProsessMeny
    // Dette er OK - panelet kan fungere standalone
    if (!onRegister || !onUnregister) {
      return;
    }

    try {
      console.debug('Panel registrerer seg (props-basert):', {
        id: panelId,
        tekst: panelTekst,
        type: panelType,
        usePartialStatus,
      });

      // Registrer med panelId, panelTekst og registreringsinfo
      onRegister(panelId, panelTekst, {
        type: panelType,
        usePartialStatus,
      });
    } catch (error) {
      console.error('Kunne ikke registrere panel:', panelId, error);
      // Ikke throw. La andre paneler fortsette å fungere
    }

    // Cleanup: Avregistrer panel når komponenten unmountes
    return () => {
      try {
        console.debug('Panel avregistrerer seg (props-basert):', panelId);
        onUnregister(panelId);
      } catch (error) {
        console.error('Kunne ikke avregistrere panel:', panelId, error);
      }
    };
  }, [panelId, panelTekst, onRegister, onUnregister, panelType, usePartialStatus]);

  // Oppdater type når den endres (separat effect for å unngå unødvendig re-registrering)
  useEffect(() => {
    if (!onUpdateType) {
      return;
    }

    try {
      console.debug('Panel oppdaterer type:', {
        id: panelId,
        type: panelType,
      });

      onUpdateType(panelId, panelType);
    } catch (error) {
      console.error('Kunne ikke oppdatere paneltype:', panelId, error);
    }
  }, [panelId, panelType, onUpdateType]);
}
