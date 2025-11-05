import { useMemo, useEffect, type ReactNode } from 'react';
import { useIntl } from 'react-intl';
import { useSearchParams } from 'react-router';
import { Box } from '@navikt/ds-react';
import { ProcessMenu, ProcessMenuStepType } from '@navikt/ft-plattform-komponenter';
import { ProsessMenyProvider, useProsessMenyContext } from './context/ProsessMenyContext.js';


/**
 * Props for ProsessMeny.
 */
interface ProsessMenyProps {
  /** InitPanel-komponenter som children */
  children: ReactNode;
}

/**
 * Intern komponent som håndterer menylogikk.
 * Må være innenfor ProsessMenyProvider for å få tilgang til context.
 */
function ProsessMenyContent({ children }: ProsessMenyProps) {
  const intl = useIntl();
  const [searchParams, setSearchParams] = useSearchParams();
  const { paneler, valgtPanelId, setValgtPanelId } = useProsessMenyContext();

  // Hent valgt panel fra URL
  const urlPanelId = searchParams.get('punkt');

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
  }, [urlPanelId, paneler, valgtPanelId, setValgtPanelId, setSearchParams]);

  // Konverter panelregistreringer til ProcessMenu steps-format
  const steg = useMemo(() => {
    const panelArray = Array.from(paneler.values());
    return panelArray.map(panel => ({
      label: intl.formatMessage({ id: panel.tekstKode }),
      isActive: panel.id === valgtPanelId,
      type: panel.type || ProcessMenuStepType.default,
      usePartialStatus: panel.usePartialStatus,
    }));
  }, [paneler, valgtPanelId, intl]);

  // Håndter klikk på menyelement
  const handleStegKlikk = (indeks: number) => {
    const panelArray = Array.from(paneler.values());
    const valgtPanel = panelArray[indeks];
    if (valgtPanel) {
      setValgtPanelId(valgtPanel.id);
      setSearchParams((forrige: URLSearchParams) => {
        const neste = new URLSearchParams(forrige);
        neste.set('punkt', valgtPanel.id);
        return neste;
      });
    }
  };

  // Render alle children slik at de kan registrere seg,
  // men kun det valgte panelet vil faktisk vises (via ProsessDefaultInitPanel sin logikk)
  const renderPaneler = () => {
    // Alltid render children slik at de kan registrere seg via useEffect
    // ProsessDefaultInitPanel-komponenter vil selv håndtere om de skal vises eller ikke
    return children;
  };

  return (
    <Box.New paddingInline="6">
      <ProcessMenu steps={steg} onClick={handleStegKlikk} />
      {/* Render children for registrering, men de returnerer null i hybrid-modus */}
      {renderPaneler()}
    </Box.New>
  );
}

/**
 * Prosessmeny-komponent som viser en meny med prosesspaneler.
 * 
 * Denne komponenten:
 * - Aksepterer InitPanel-komponenter som children
 * - Samler panelregistreringer via React context
 * - Rendrer ProcessMenu-komponent fra @navikt/ft-plattform-komponenter
 * - Håndterer panelvalg og URL-synkronisering
 * - Rendrer kun det valgte panelet
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
  return (
    <ProsessMenyProvider>
      <ProsessMenyContent>{children}</ProsessMenyContent>
    </ProsessMenyProvider>
  );
}
