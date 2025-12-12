import { Box } from '@navikt/ds-react';
import { ProcessMenu, ProcessMenuStepType } from '@navikt/ft-plattform-komponenter';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import { useSearchParams } from 'react-router';
import { ValgtPanelProvider } from './context/ValgtPanelContext.js';
import styles from './prosessMeny.module.css';
import { ProsessPanelContext } from './ProsessPanelContext.js';
import type { PanelRegistrering, ProsessPanelProps } from './types/panelTypes.js';

/**
 * Intern type for å holde styr på registrerte paneler.
 * Utvider PanelRegistrering med id og tekstKode som paneler sender inn.
 */
interface InternPanelRegistrering extends PanelRegistrering {
  id: string;
  tekstKode: string;
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
export function ProsessMeny({ children }: ProsessMenyProps) {
  const intl = useIntl();
  const [searchParams, setSearchParams] = useSearchParams();
  const [paneler, setPaneler] = useState<Map<string, InternPanelRegistrering>>(new Map());
  const [valgtPanelId, setValgtPanelId] = useState<string | null>(null);
  // Holder styr på hvilken child-indeks som tilhører hvilket panel-ID.
  // Paneler registrerer seg i samme rekkefølge som de vises i children-arrayet,
  // så vi kan bruke registreringsrekkefølge for å mappe child-indekser til panel-IDer.
  const registrationOrderRef = React.useRef<string[]>([]);

  // Hent valgt panel fra URL
  const urlPanelId = searchParams.get('punkt');

  // Callback for å registrere et panel
  const handleRegister = useCallback((id: string, tekstKode: string, info: PanelRegistrering) => {
    setPaneler(forrige => {
      const neste = new Map(forrige);
      neste.set(id, { ...info, id, tekstKode });
      return neste;
    });

    // Mapper child-indeks til panel-ID basert på registreringsrekkefølge
    if (!registrationOrderRef.current.includes(id)) {
      registrationOrderRef.current.push(id);
    }
  }, []);

  // Callback for å avregistrere et panel
  const handleUnregister = useCallback((id: string) => {
    setPaneler(forrige => {
      const neste = new Map(forrige);
      neste.delete(id);
      return neste;
    });

    // Fjern fra registreringsrekkefølge
    const index = registrationOrderRef.current.indexOf(id);
    if (index !== -1) {
      registrationOrderRef.current.splice(index, 1);
    }
  }, []);

  // Callback for å oppdatere paneltype
  const handleUpdateType = useCallback((id: string, type: ProcessMenuStepType) => {
    setPaneler(forrige => {
      const panel = forrige.get(id);
      if (!panel) return forrige;
      const neste = new Map(forrige);
      neste.set(id, { ...panel, type });
      return neste;
    });
  }, []);

  // Synkroniser URL med intern tilstand
  useEffect(() => {
    if (urlPanelId && paneler.has(urlPanelId)) {
      // URL har gyldig panel-ID, bruk den
      setValgtPanelId(urlPanelId);
    } else if (paneler.size > 0 && !valgtPanelId) {
      // Ingen valgt panel, velg første
      const førstePanelet = Array.from(paneler.values())[0];
      if (førstePanelet) {
        setValgtPanelId(førstePanelet.id);
        setSearchParams((forrige: URLSearchParams) => {
          const neste = new URLSearchParams(forrige);
          neste.set('punkt', førstePanelet.id);
          return neste;
        });
      }
    }
  }, [urlPanelId, paneler, valgtPanelId, setSearchParams]);

  // Konverter panelregistreringer til ProcessMenu steps-format
  // Bruk registrationOrderRef for å opprettholde children-rekkefølge
  const steg = useMemo(() => {
    return registrationOrderRef.current
      .map(id => paneler.get(id))
      .filter((panel): panel is InternPanelRegistrering => panel !== undefined)
      .map(panel => ({
        label: intl.messages[panel.tekstKode] ? intl.formatMessage({ id: panel.tekstKode }) : panel.tekstKode,
        isActive: panel.id === valgtPanelId,
        type: panel.type || ProcessMenuStepType.default,
        usePartialStatus: panel.usePartialStatus,
      }));
  }, [paneler, valgtPanelId, intl]);

  // Håndter klikk på menyelement
  const handleStegKlikk = (indeks: number) => {
    // Bruk registrationOrderRef for å finne riktig panel basert på indeks
    const panelId = registrationOrderRef.current[indeks];
    const valgtPanel = panelId ? paneler.get(panelId) : undefined;
    if (valgtPanel) {
      setValgtPanelId(valgtPanel.id);
      setSearchParams((forrige: URLSearchParams) => {
        const neste = new URLSearchParams(forrige);
        neste.set('punkt', valgtPanel.id);
        return neste;
      });
    }
  };

  return (
    <ValgtPanelProvider value={{ valgtPanelId }}>
      <Box.New paddingInline="6">
        <ProcessMenu steps={steg} onClick={handleStegKlikk} stepArrowContainerStyle={styles.stepArrowContainer} />
        {/* Render children med injiserte props */}
        <ProsessPanelContext.Provider
          value={{
            onRegister: handleRegister,
            onUnregister: handleUnregister,
            onUpdateType: handleUpdateType,
            erValgt: id => id === valgtPanelId,
          }}
        >
          {children}
        </ProsessPanelContext.Provider>
      </Box.New>
    </ValgtPanelProvider>
  );
}
