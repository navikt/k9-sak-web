import { LoadingPanelSuspense } from '@k9-sak-web/gui/shared/loading-panel/LoadingPanelSuspense.js';
import { Box } from '@navikt/ds-react';
import { ProcessMenu, ProcessMenuStepType } from '@navikt/ft-plattform-komponenter';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router';
import styles from './prosessMeny.module.css';
import { ProsessPanelContext } from './ProsessPanelContext.js';
import type { ProsessPanelProps } from './types/panelTypes.js';

/**
 * Steg-definisjon fra prosessmotor.
 * Definerer hvilke paneler som skal vises, i hvilken rekkefølge, og deres status.
 */
export interface ProsessSteg {
  /** Unik ID for panelet (må matche PANEL_ID i InitPanel) */
  id: string;
  /** Label/tittel for panelet i menyen */
  label: string;
  /** Status/type for panelet (warning, success, danger, default) */
  type: ProcessMenuStepType;
  /** Valgfritt: Vis delvis fullføringsindikator */
  usePartialStatus?: boolean;
  locked?: boolean;
}

/**
 * Props for ProsessMeny.
 *
 * Aksepterer kun panelkomponenter som implementerer ProsessPanelProps.
 * TypeScript vil gi compile-time feil hvis children ikke har riktige props.
 */
interface ProsessMenyProps {
  /**
   * InitPanel-komponenter som children.
   * Må være React-elementer som aksepterer ProsessPanelProps.
   */
  children: React.ReactElement<ProsessPanelProps> | Array<React.ReactElement<ProsessPanelProps>>;
  steg: ProsessSteg[];
}

/**
 * Prosessmeny-komponent som viser en meny med prosesspaneler.
 *
 * Denne komponenten:
 * - Aksepterer InitPanel-komponenter som children
 * - Injiserer automatisk callbacks (onRegister, onUnregister, onUpdateType, erValgt) til alle children
 * - Rendrer ProcessMenu-komponent fra @navikt/ft-plattform-komponenter
 * - Håndterer panelvalg og URL-synkronisering
 * - Gir compile-time typesikkerhet - TypeScript validerer at children har riktige props
 *
 * Paneler definerer selv sin identitet via konstanter og bruker usePanelRegistrering hook.
 *
 * @example
 * ```tsx
 * <ProsessMeny>
 *   <VarselProsessStegInitPanel />
 *   <BeregningProsessStegInitPanel />
 *   <VedtakProsessStegInitPanel />
 * </ProsessMeny>
 * ```
 */
export const ProsessMeny = ({ children, steg: prosessmotorSteg }: ProsessMenyProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [valgtPanelId, setValgtPanelId] = useState<string | null>(null);
  const sisteAktivtValgtePanelIdRef = useRef<string | null>(null);
  // Ref som alltid speiler valgtPanelId — kan leses i effects uten å legges i deps
  const valgtPanelIdRef = useRef<string | null>(null);
  valgtPanelIdRef.current = valgtPanelId;

  // Hent valgt panel fra URL
  const urlPanelId = searchParams.get('punkt');

  // Callback for å registrere et panel

  /**
   * Synkroniserer hvilken panel som er valgt med URL-parameteren `punkt`.
   *
   * Kjøres når `urlPanelId` eller `prosessmotorSteg` endrer seg. Prioritetsrekkefølge:
   *
   * 1. `punkt=default` — nullstiller brukervalg og navigerer til "beste" panel:
   *    - Siste panel hvis alle er ferdigbehandlet (danger/success)
   *    - Første panel med aksjonspunkt (warning), ellers første panel
   *
   * 2. Bruker har klikket et panel eksplisitt (`sisteAktivtValgtePanelIdRef` er satt):
   *    - URL matcher klikket panel → ingen endring (tidlig retur)
   *    - URL har endret seg (f.eks. nettlesernavigasjon) → nullstill brukervalg
   *      og fall igjennom til steg 3 for å respektere den nye URL-en
   *
   * 3. URL peker på et gyldig panel-ID → sett det som aktivt panel
   *
   * 4. Ingen URL-valg → naviger automatisk til første panel med aksjonspunkt
   *
   * `sisteAktivtValgtePanelIdRef` er en ref (ikke state) fordi den ikke påvirker
   * render-output direkte. Mutasjon av den skal ikke utløse en ekstra render-syklus.
   */
  useEffect(() => {
    const gyldigePanelIds = prosessmotorSteg.map(s => s.id);
    // Ekskluder aktivt panel — ved stale data kan det fremdeles vises som warning selv om det akkurat ble løst
    const panelMedAksjonspunkt = prosessmotorSteg.find(
      steg => steg.type === ProcessMenuStepType.warning && steg.id !== valgtPanelIdRef.current,
    );

    // Steg 1: punkt=default
    if (urlPanelId === 'default') {
      sisteAktivtValgtePanelIdRef.current = null;
      const allePanelerErFerdigbehandlet = prosessmotorSteg.every(
        steg => steg.type === ProcessMenuStepType.danger || steg.type === ProcessMenuStepType.success,
      );
      const sistePanel = prosessmotorSteg[prosessmotorSteg.length - 1];
      // kandidatFinnes er false når vi er på et panel men data ennå ikke er oppdatert — vent på neste render.
      // Ved initial load (valgtPanelIdRef.current === null) regnes alltid første panel som kandidat.
      const kandidatFinnes = panelMedAksjonspunkt !== undefined || valgtPanelIdRef.current === null;
      const defaultPanel = allePanelerErFerdigbehandlet
        ? sistePanel
        : kandidatFinnes
          ? (panelMedAksjonspunkt ?? prosessmotorSteg[0])
          : null;

      if (defaultPanel) {
        setValgtPanelId(defaultPanel.id);
        setSearchParams(forrige => {
          const neste = new URLSearchParams(forrige);
          neste.set('punkt', defaultPanel.id);
          return neste;
        });
      }

      return;
    }

    // Steg 2: brukervalg
    if (sisteAktivtValgtePanelIdRef.current) {
      if (sisteAktivtValgtePanelIdRef.current !== urlPanelId) {
        sisteAktivtValgtePanelIdRef.current = null; // ekstern URL-endring — fall igjennom
      } else {
        return;
      }
    }

    // Steg 3: gyldig URL-valg
    if (urlPanelId && gyldigePanelIds.includes(urlPanelId)) {
      setValgtPanelId(urlPanelId);
      return;
    }

    // Steg 4: auto-naviger til aksjonspunkt
    if (panelMedAksjonspunkt) {
      setValgtPanelId(panelMedAksjonspunkt.id);
      setSearchParams(forrige => {
        const neste = new URLSearchParams(forrige);
        neste.set('punkt', panelMedAksjonspunkt.id);
        return neste;
      });
    }
  }, [urlPanelId, prosessmotorSteg, setSearchParams]);

  // Konverter panelregistreringer til ProcessMenu steps-format
  const steg = useMemo(() => {
    return prosessmotorSteg.map(prosessSteg => ({
      label: prosessSteg.label,
      isActive: prosessSteg.id === valgtPanelId,
      type: prosessSteg.type,
      usePartialStatus: prosessSteg.usePartialStatus,
      locked: prosessSteg.locked,
    }));
  }, [prosessmotorSteg, valgtPanelId]);

  // Håndter klikk på menyelement
  const handleStegKlikk = (indeks: number) => {
    const prosessSteg = prosessmotorSteg[indeks];
    if (prosessSteg) {
      setValgtPanelId(prosessSteg.id);
      sisteAktivtValgtePanelIdRef.current = prosessSteg.id;
      setSearchParams(forrige => {
        const neste = new URLSearchParams(forrige);
        neste.set('punkt', prosessSteg.id);
        return neste;
      });
    }
  };

  const alleStegTilBehandlingEllerBehandlet = prosessmotorSteg.filter(s => s.type !== ProcessMenuStepType.default);

  return (
    <Box paddingInline="space-24">
      <ProcessMenu steps={steg} onClick={handleStegKlikk} stepArrowContainerStyle={styles.stepArrowContainer} />
      <LoadingPanelSuspense>
        <ProsessPanelContext.Provider
          value={{
            erValgt: id => id === valgtPanelId,
            erTilBehandlingEllerBehandlet: id => alleStegTilBehandlingEllerBehandlet.some(s => s.id === id),
          }}
        >
          {children}
        </ProsessPanelContext.Provider>
      </LoadingPanelSuspense>
    </Box>
  );
};
