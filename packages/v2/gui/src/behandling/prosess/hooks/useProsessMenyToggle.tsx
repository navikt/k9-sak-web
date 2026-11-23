import FeatureTogglesContext from '@k9-sak-web/gui/featuretoggles/FeatureTogglesContext.js';
import { HStack, Switch } from '@navikt/ds-react';
import { use, useCallback, useState } from 'react';

interface UseProsessMenyToggleResult {
  useV2Menu: boolean;
  toggleMenu: () => void;
  ToggleComponent: React.ReactElement | null;
}

/**
 * MERK: Denne er bare for å bruke under utivkling og kan fjernes etterhvert
 *
 * Hook for å bytte mellom legacy og v2 prosessmeny under migrering.
 * Lagrer valg i localStorage for å bevare preferanse mellom sideinnlastinger.
 *
 * Logikk:
 * - Hvis den angitte prosesmeny-toggelen er false: Bruk alltid legacy (useV2Menu = false, ingen toggle)
 * - Hvis den angitte toggelen er true og skjul-velger-toggelen er false: Vis toggle og la bruker velge (default v2)
 * - Hvis den angitte toggelen er true og skjul-velger-toggelen er true: Bruk alltid v2 (useV2Menu = true, ingen toggle)
 *
 * Skjul-velger-toggelen er SKJUL_PROSESS_MENY_V2_OMS_VELGER for PROSESS_MENY_V2_OMS og SKJUL_PROSESS_MENY_V2_PSB_VELGER for PROSESS_MENY_V2_PSB.
 *
 * @param toggle - Feature toggelen som styrer hvilken prosessmeny som er aktiv
 * @returns {Object} - Objekt med useV2Menu state, toggleMenu funksjon og ToggleComponent
 */
export function useProsessMenyToggle(
  toggle: 'PROSESS_MENY_V2_PSB' | 'PROSESS_MENY_V2_OMS',
): UseProsessMenyToggleResult {
  const featureToggles = use(FeatureTogglesContext);
  const v2Enabled = featureToggles[toggle];
  const skjulVelger =
    toggle === 'PROSESS_MENY_V2_OMS'
      ? featureToggles.SKJUL_PROSESS_MENY_V2_OMS_VELGER
      : featureToggles.SKJUL_PROSESS_MENY_V2_PSB_VELGER;
  const velgerEnabled = !skjulVelger;

  const [useV2Menu, setUseV2Menu] = useState<boolean>(() => {
    // Ikke bruk v2 meny om ikke feature toggle er true
    if (!v2Enabled) return false;
    // Hvis feature toggle er true og velger ikke er true, bruk v2 meny
    if (!velgerEnabled) return true;
    // Hvis bruke v2 meny er true og velger er true, bruk evt. stored value
    const stored = localStorage.getItem('k9-prosess-meny-v2');
    return stored === null ? true : stored === 'true';
  });

  const toggleMenu = useCallback(() => {
    setUseV2Menu(prev => {
      const newValue = !prev;
      localStorage.setItem('k9-prosess-meny-v2', String(newValue));
      return newValue;
    });
  }, []);

  const ToggleComponent =
    v2Enabled && velgerEnabled ? (
      <HStack
        align="center"
        gap="space-8"
        justify="center"
        style={{
          borderRadius: '8px',
          margin: '8px',
          border: '1px solid',
          backgroundColor: '#ffdea5',
        }}
      >
        <Switch size="small" checked={useV2Menu} onChange={toggleMenu}>
          Vis ny versjon av prosessmeny
        </Switch>
      </HStack>
    ) : null;

  return {
    useV2Menu,
    toggleMenu,
    ToggleComponent,
  };
}
