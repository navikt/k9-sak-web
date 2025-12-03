import { useMemo } from 'react';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import { ProsessDefaultInitPanel } from '@k9-sak-web/gui/behandling/prosess/ProsessDefaultInitPanel.js';
import { usePanelRegistrering } from '@k9-sak-web/gui/behandling/prosess/hooks/usePanelRegistrering.js';
import { useStandardProsessPanelProps } from '@k9-sak-web/gui/behandling/prosess/hooks/useStandardProsessPanelProps.js';
import type { ProsessPanelProps } from '@k9-sak-web/gui/behandling/prosess/types/panelTypes.js';
import { prosessStegCodes } from '@k9-sak-web/konstanter';
import { ProcessMenuStepType } from '@navikt/ft-plattform-komponenter';

/**
 * InitPanel for inngangsvilkår prosesssteg
 * 
 * Wrapper for inngangsvilkår-panelet som håndterer:
 * - Registrering med menyen via usePanelRegistrering
 * - Synlighetslogikk basert på tilstedeværelse av vilkår
 * - Beregning av paneltype basert på vilkårstatus
 * - Rendering av legacy panelkomponent via ProsessDefaultInitPanel
 * 
 * Inngangsvilkår består av flere sub-paneler:
 * - Søknadsfrist
 * - Alder
 * - Omsorgen for
 */
export function InngangsvilkarProsessStegInitPanel(props: ProsessPanelProps) {
  // Definer panel-identitet som konstanter
  const PANEL_ID = prosessStegCodes.INNGANGSVILKAR;
  const PANEL_TEKST = 'Behandlingspunkt.Inngangsvilkar';

  // Hent standard props for å få tilgang til vilkår
  const standardProps = useStandardProsessPanelProps();

  // Relevante vilkår for inngangsvilkår-panelet
  const RELEVANTE_VILKAR_KODER = [
    vilkarType.SOKNADSFRISTVILKARET,
    vilkarType.ALDERSVILKARET,
    vilkarType.OMSORGENFORVILKARET,
  ];

  // Filtrer vilkår som er relevante for dette panelet
  const vilkarForSteg = useMemo(() => {
    if (!standardProps.vilkar) {
      return [];
    }
    return standardProps.vilkar.filter(
      vilkar => RELEVANTE_VILKAR_KODER.includes(vilkar.vilkarType?.kode)
    );
  }, [standardProps.vilkar]);

  // Sjekk om panelet skal vises (kun hvis det finnes relevante vilkår)
  const skalVisePanel = vilkarForSteg.length > 0;

  // Beregn paneltype basert på vilkårstatus (for menystatusindikator)
  const panelType = useMemo((): ProcessMenuStepType => {
    // Hvis panelet ikke skal vises, bruk default
    if (!skalVisePanel) {
      return ProcessMenuStepType.default;
    }

    // Sjekk om noen vilkår ikke er oppfylt (danger)
    const harIkkeOppfyltVilkar = vilkarForSteg.some(
      vilkar => vilkar.vilkarStatus?.kode === 'IKKE_OPPFYLT'
    );
    if (harIkkeOppfyltVilkar) {
      return ProcessMenuStepType.danger;
    }

    // Sjekk om alle vilkår er oppfylt (success)
    const alleVilkarOppfylt = vilkarForSteg.every(
      vilkar => vilkar.vilkarStatus?.kode === 'OPPFYLT'
    );
    if (alleVilkarOppfylt && vilkarForSteg.length > 0) {
      return ProcessMenuStepType.success;
    }

    // Sjekk om det finnes åpne aksjonspunkter for inngangsvilkår (warning)
    const harApenAksjonspunkt = standardProps.aksjonspunkter?.some(
      ap => {
        const kode = ap.definisjon?.kode;
        return (
          (kode === '5058' || // OVERSTYR_SOKNADSFRISTVILKAR
           kode === '5011' || // KONTROLLER_OPPLYSNINGER_OM_SØKNADSFRIST
           kode === '5013') && // OVERSTYR_OMSORGEN_FOR
          ap.status?.kode === 'OPPR'
        );
      }
    );
    if (harApenAksjonspunkt) {
      return ProcessMenuStepType.warning;
    }

    // Default tilstand
    return ProcessMenuStepType.default;
  }, [skalVisePanel, vilkarForSteg, standardProps.aksjonspunkter]);

  // Registrer panel med menyen
  usePanelRegistrering(props, PANEL_ID, PANEL_TEKST, panelType);

  // Ikke vis panelet hvis det ikke finnes relevante vilkår
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
      urlKode={prosessStegCodes.INNGANGSVILKAR}
      tekstKode="Behandlingspunkt.Inngangsvilkar"
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
