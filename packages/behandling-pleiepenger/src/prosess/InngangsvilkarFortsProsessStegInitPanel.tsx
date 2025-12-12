import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import { ProsessDefaultInitPanel } from '@k9-sak-web/gui/behandling/prosess/ProsessDefaultInitPanel.js';
import { ProsessPanelContext } from '@k9-sak-web/gui/behandling/prosess/ProsessPanelContext.js';
import { usePanelRegistrering } from '@k9-sak-web/gui/behandling/prosess/hooks/usePanelRegistrering.js';
import { useStandardProsessPanelProps } from '@k9-sak-web/gui/behandling/prosess/hooks/useStandardProsessPanelProps.js';
import { prosessStegCodes } from '@k9-sak-web/konstanter';
import { ProcessMenuStepType } from '@navikt/ft-plattform-komponenter';
import { useContext, useMemo } from 'react';

/**
 * InitPanel for inngangsvilkår fortsettelse prosesssteg
 *
 * Wrapper for inngangsvilkår fortsettelse-panelet som håndterer:
 * - Registrering med menyen via usePanelRegistrering
 * - Synlighetslogikk basert på tilstedeværelse av vilkår
 * - Beregning av paneltype basert på vilkårstatus
 * - Rendering av legacy panelkomponent via ProsessDefaultInitPanel
 *
 * Inngangsvilkår fortsettelse består av flere sub-paneler:
 * - Medlemskap (overstyring)
 * - Opptjening
 */
export function InngangsvilkarFortsProsessStegInitPanel() {
  const context = useContext(ProsessPanelContext);
  // Definer panel-identitet som konstanter
  const PANEL_ID = prosessStegCodes.OPPTJENING;
  const PANEL_TEKST = 'Behandlingspunkt.InngangsvilkarForts';

  // Hent standard props for å få tilgang til vilkår
  const standardProps = useStandardProsessPanelProps();

  // Relevante vilkår for inngangsvilkår fortsettelse-panelet
  const RELEVANTE_VILKAR_KODER = [vilkarType.MEDLEMSKAPSVILKARET, vilkarType.OPPTJENINGSVILKARET];

  // Filtrer vilkår som er relevante for dette panelet
  const vilkarForSteg = useMemo(() => {
    if (!standardProps.vilkar) {
      return [];
    }
    return standardProps.vilkar.filter(vilkar => RELEVANTE_VILKAR_KODER.includes(vilkar.vilkarType?.kode));
  }, [standardProps.vilkar]);

  // Sjekk om panelet skal vises (kun hvis det finnes relevante vilkår)
  const skalVisePanel = vilkarForSteg.length > 0;

  // Beregn paneltype basert på vilkårstatus (for menystatusindikator)
  const panelType = useMemo((): ProcessMenuStepType => {
    // Hvis panelet ikke skal vises, bruk default
    if (!skalVisePanel) {
      return ProcessMenuStepType.default;
    }

    // Samle alle periode-statuser fra alle relevante vilkår
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

    // Sjekk om det finnes åpne aksjonspunkter for inngangsvilkår fortsettelse (warning)
    const harApenAksjonspunkt = standardProps.aksjonspunkter?.some(ap => {
      const kode = ap.definisjon?.kode;
      return (
        (kode === aksjonspunktCodes.VURDER_OPPTJENINGSVILKARET || // 5089
          kode === aksjonspunktCodes.OVERSTYRING_AV_OPPTJENINGSVILKARET || // 6011
          kode === aksjonspunktCodes.OVERSTYR_MEDLEMSKAPSVILKAR) && // 5021
        ap.status?.kode === 'OPPR'
      );
    });
    if (harApenAksjonspunkt) {
      return ProcessMenuStepType.warning;
    }

    // Default tilstand
    return ProcessMenuStepType.default;
  }, [skalVisePanel, vilkarForSteg, standardProps.aksjonspunkter]);

  const erValgt = context?.erValgt(PANEL_ID);
  // Registrer panel med menyen
  usePanelRegistrering({ ...context, erValgt }, PANEL_ID, PANEL_TEKST, panelType);

  // Ikke vis panelet hvis det ikke finnes relevante vilkår
  if (!skalVisePanel) {
    return null;
  }

  // Render kun hvis panelet er valgt (injisert av ProsessMeny)
  if (!erValgt) {
    return null;
  }

  return (
    // Bruker ProsessDefaultInitPanel for å hente standard props og rendre legacy panel
    <ProsessDefaultInitPanel urlKode={prosessStegCodes.OPPTJENING} tekstKode="Behandlingspunkt.InngangsvilkarForts">
      {() => {
        // Legacy panelkomponent rendres av ProsessStegPanel (utenfor ProsessMeny)
        // Dette er hybrid-modus: v2 meny + legacy rendering
        // Returnerer null fordi rendering håndteres av legacy ProsessStegPanel
        return null;
      }}
    </ProsessDefaultInitPanel>
  );
}
