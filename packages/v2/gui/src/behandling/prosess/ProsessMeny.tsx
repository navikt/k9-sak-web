import { LoadingPanelSuspense } from '@k9-sak-web/gui/shared/loading-panel/LoadingPanelSuspense.js';
import { Box } from '@navikt/ds-react';
import { ProcessMenu, ProcessMenuStepType } from '@navikt/ft-plattform-komponenter';
import React, { useEffect, useMemo, useState } from 'react';
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
  const [sisteAktivtValgtePanelId, setSisteAktivtValgtePanelId] = useState<string | null>(null);

  // Hent valgt panel fra URL
  const urlPanelId = searchParams.get('punkt');

  // Callback for å registrere et panel

  // Synkroniser URL med intern tilstand
  useEffect(() => {
    const gyldigePanelIds = prosessmotorSteg.map(s => s.id);
    const panelMedAksjonspunkt = prosessmotorSteg.find(steg => steg.type === ProcessMenuStepType.warning);

    // Automatisk naviger til panel med aksjonspunkt hvis bruker ikke har valgt noe
    if (panelMedAksjonspunkt && !sisteAktivtValgtePanelId) {
      setValgtPanelId(panelMedAksjonspunkt.id);
      setSearchParams(forrige => {
        const neste = new URLSearchParams(forrige);
        neste.set('punkt', panelMedAksjonspunkt.id);
        return neste;
      });
      return;
    }

    // Velg default panel når ingen er valgt
    if (urlPanelId === 'default') {
      setSisteAktivtValgtePanelId(null);
      const allePanelerErFerdigbehandlet = prosessmotorSteg.every(
        steg => steg.type === ProcessMenuStepType.danger || steg.type === ProcessMenuStepType.success,
      );
      const sistePanel = prosessmotorSteg[prosessmotorSteg.length - 1];
      const defaultPanel = allePanelerErFerdigbehandlet ? sistePanel : panelMedAksjonspunkt;

      if (defaultPanel) {
        setValgtPanelId(defaultPanel.id);
        setSearchParams(forrige => {
          const neste = new URLSearchParams(forrige);
          neste.set('punkt', defaultPanel.id);
          return neste;
        });
      }
    }

    // Respekter siste aktive valg
    if (sisteAktivtValgtePanelId) {
      return;
    }

    // Respekter gyldig URL-valg
    if (urlPanelId && gyldigePanelIds.includes(urlPanelId)) {
      setValgtPanelId(urlPanelId);
      return;
    }
  }, [urlPanelId, prosessmotorSteg, setSearchParams, sisteAktivtValgtePanelId]);

  // Konverter panelregistreringer til ProcessMenu steps-format
  const steg = useMemo(() => {
    return prosessmotorSteg.map(prosessSteg => ({
      label: prosessSteg.label,
      isActive: prosessSteg.id === valgtPanelId,
      type: prosessSteg.type,
      usePartialStatus: prosessSteg.usePartialStatus,
    }));
  }, [prosessmotorSteg, valgtPanelId]);

  // Håndter klikk på menyelement
  const handleStegKlikk = (indeks: number) => {
    const prosessSteg = prosessmotorSteg[indeks];
    if (prosessSteg) {
      setValgtPanelId(prosessSteg.id);
      setSisteAktivtValgtePanelId(prosessSteg.id);
      setSearchParams(forrige => {
        const neste = new URLSearchParams(forrige);
        neste.set('punkt', prosessSteg.id);
        return neste;
      });
    }
  };

  const alleStegMedVurdering = prosessmotorSteg.filter(s => s.type !== ProcessMenuStepType.default);

  return (
    <Box.New paddingInline="6">
      <ProcessMenu steps={steg} onClick={handleStegKlikk} stepArrowContainerStyle={styles.stepArrowContainer} />
      <LoadingPanelSuspense>
        <ProsessPanelContext.Provider
          value={{
            erValgt: id => id === valgtPanelId,
            erVurdert: id => alleStegMedVurdering.some(s => s.id === id),
          }}
        >
          {children}
        </ProsessPanelContext.Provider>
      </LoadingPanelSuspense>
    </Box.New>
  );
};
