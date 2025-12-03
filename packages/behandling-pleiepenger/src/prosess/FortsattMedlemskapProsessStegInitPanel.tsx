import { useMemo } from 'react';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { ProsessDefaultInitPanel } from '@k9-sak-web/gui/behandling/prosess/ProsessDefaultInitPanel.js';
import { usePanelRegistrering } from '@k9-sak-web/gui/behandling/prosess/hooks/usePanelRegistrering.js';
import { useStandardProsessPanelProps } from '@k9-sak-web/gui/behandling/prosess/hooks/useStandardProsessPanelProps.js';
import type { ProsessPanelProps } from '@k9-sak-web/gui/behandling/prosess/types/panelTypes.js';
import { prosessStegCodes } from '@k9-sak-web/konstanter';
import { ProcessMenuStepType } from '@navikt/ft-plattform-komponenter';

/**
 * InitPanel for fortsatt medlemskap prosesssteg
 * 
 * Wrapper for fortsatt medlemskap-panelet som håndterer:
 * - Registrering med menyen via usePanelRegistrering
 * - Synlighetslogikk basert på tilstedeværelse av løpende medlemskapsvilkår
 * - Beregning av paneltype basert på vilkårstatus og aksjonspunkter
 * - Rendering av legacy panelkomponent via ProsessDefaultInitPanel
 * 
 * Dette panelet viser overstyring av løpende medlemskapsvilkår.
 */
export function FortsattMedlemskapProsessStegInitPanel(props: ProsessPanelProps) {
  // Definer panel-identitet som konstanter
  const PANEL_ID = prosessStegCodes.FORTSATTMEDLEMSKAP;
  const PANEL_TEKST = 'Fortsatt medlem';

  // Hent standard props for å få tilgang til vilkår og aksjonspunkter
  const standardProps = useStandardProsessPanelProps();

  // Filtrer vilkår som er relevante for dette panelet (løpende medlemskap)
  const vilkarForSteg = useMemo(() => {
    if (!standardProps.vilkar) {
      return [];
    }
    return standardProps.vilkar.filter(
      vilkar => vilkar.vilkarType?.kode === vilkarType.MEDLEMSKAPSVILKARET
    );
  }, [standardProps.vilkar]);

  // Sjekk om panelet skal vises (kun hvis det finnes løpende medlemskapsvilkår)
  const skalVisePanel = vilkarForSteg.length > 0;

  // Beregn paneltype basert på vilkårstatus og aksjonspunkter (for menystatusindikator)
  const panelType = useMemo((): ProcessMenuStepType => {
    // Hvis panelet ikke skal vises, bruk default
    if (!skalVisePanel) {
      return ProcessMenuStepType.default;
    }

    // Sjekk om det finnes åpent aksjonspunkt for overstyring av løpende medlemskap (warning)
    const harApenAksjonspunkt = standardProps.aksjonspunkter?.some(
      ap => 
        ap.definisjon?.kode === aksjonspunktCodes.OVERSTYR_LØPENDE_MEDLEMSKAPSVILKAR && // 5023
        ap.status?.kode === 'OPPR'
    );
    if (harApenAksjonspunkt) {
      return ProcessMenuStepType.warning;
    }

    // Samle alle periode-statuser fra løpende medlemskapsvilkår
    const vilkarStatusCodes: string[] = [];
    vilkarForSteg.forEach(vilkar => {
      vilkar.perioder
        .filter(periode => periode.vurderesIBehandlingen)
        .forEach(periode => vilkarStatusCodes.push(periode.vilkarStatus.kode));
    });

    // Sjekk om noen vilkår ikke er oppfylt (danger)
    const harIkkeOppfyltVilkar = vilkarStatusCodes.some(kode => kode === 'IKKE_OPPFYLT');
    if (harIkkeOppfyltVilkar) {
      return ProcessMenuStepType.danger;
    }

    // Sjekk om alle vilkår er oppfylt (success)
    const alleVilkarOppfylt = vilkarStatusCodes.length > 0 && vilkarStatusCodes.every(kode => kode === 'OPPFYLT');
    if (alleVilkarOppfylt) {
      return ProcessMenuStepType.success;
    }

    // Default tilstand
    return ProcessMenuStepType.default;
  }, [skalVisePanel, vilkarForSteg, standardProps.aksjonspunkter]);

  // Registrer panel med menyen
  usePanelRegistrering(props, PANEL_ID, PANEL_TEKST, panelType);

  // Ikke vis panelet hvis det ikke finnes løpende medlemskapsvilkår
  if (!skalVisePanel) {
    return null;
  }

  // Render kun hvis panelet er valgt (injisert av ProsessMeny)
  if (!props.erValgt) {
    return null;
  }

  return (
    // Bruker ProsessDefaultInitPanel for å hente standard props og rendre legacy panel
    <ProsessDefaultInitPanel
      urlKode={prosessStegCodes.FORTSATTMEDLEMSKAP}
      tekstKode="Fortsatt medlem"
    >
      {() => {
        // Legacy panelkomponent rendres av ProsessStegPanel (utenfor ProsessMeny)
        // Dette er hybrid-modus: v2 meny + legacy rendering
        // Returnerer null fordi rendering håndteres av legacy ProsessStegPanel
        return null;
      }}
    </ProsessDefaultInitPanel>
  );
}
