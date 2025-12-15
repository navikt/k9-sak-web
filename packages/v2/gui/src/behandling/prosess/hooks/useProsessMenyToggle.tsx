import FeatureTogglesContext from '@k9-sak-web/gui/featuretoggles/FeatureTogglesContext.js';
import { ClockDashedIcon, SparklesIcon } from '@navikt/aksel-icons';
import { HStack, Label, Switch } from '@navikt/ds-react';
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
 * - Hvis PROSESS_MENY_V2 er false: Bruk alltid legacy (useV2Menu = false, ingen toggle)
 * - Hvis PROSESS_MENY_V2 er true og PROSESS_MENY_V2_VELGER er false: Bruk alltid v2 (useV2Menu = true, ingen toggle)
 * - Hvis begge er true: Vis toggle og la bruker velge (default v2)
 *
 * @returns {Object} - Objekt med useV2Menu state, toggleMenu funksjon og ToggleComponent
 */
export function useProsessMenyToggle(): UseProsessMenyToggleResult {
  const { PROSESS_MENY_V2, PROSESS_MENY_V2_VELGER } = use(FeatureTogglesContext);
  const v2Enabled = PROSESS_MENY_V2 ?? false;
  const velgerEnabled = PROSESS_MENY_V2_VELGER ?? false;

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
        gap="2"
        justify="center"
        style={{
          borderRadius: '8px',
          margin: '8px',
          border: '1px solid',
          paddingTop: '6px',
          backgroundColor: '#ffdea5',
          cursor: 'pointer',
        }}
        onClick={toggleMenu}
      >
        <Label>
          <ClockDashedIcon title="Legacy meny" fontSize="1.4rem" />
        </Label>
        <Switch size="small" checked={useV2Menu} onChange={toggleMenu}>
          <SparklesIcon title="v2 meny" fontSize="1.4rem" />
        </Switch>
      </HStack>
    ) : null;

  return {
    useV2Menu,
    toggleMenu,
    ToggleComponent,
  };
}
