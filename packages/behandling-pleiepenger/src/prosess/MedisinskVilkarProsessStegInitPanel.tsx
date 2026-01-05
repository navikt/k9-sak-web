import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import { ProsessPanelContext } from '@k9-sak-web/gui/behandling/prosess/ProsessPanelContext.js';
import { usePanelRegistrering } from '@k9-sak-web/gui/behandling/prosess/hooks/usePanelRegistrering.js';
import { prosessStegCodes } from '@k9-sak-web/konstanter';
import SykdomProsessIndex from '@k9-sak-web/prosess-vilkar-sykdom';
import { Aksjonspunkt, Vilkar } from '@k9-sak-web/types';
import { ProcessMenuStepType } from '@navikt/ft-plattform-komponenter';
import { useContext, useMemo } from 'react';

interface Props {
  aksjonspunkter: Aksjonspunkt[];
  vilkar: Vilkar[];
}

/**
 * InitPanel for medisinsk vilkår prosesssteg
 *
 * Wrapper for medisinsk vilkår-panelet som håndterer:
 * - Registrering med menyen via usePanelRegistrering
 * - Synlighetslogikk basert på tilstedeværelse av vilkår
 * - Beregning av paneltype basert på vilkårstatus og aksjonspunkter
 * - Rendering av legacy panelkomponent via ProsessDefaultInitPanel
 *
 * Medisinsk vilkår dekker:
 * - Medisinske vilkår for pleietrengende under 18 år
 * - Medisinske vilkår for pleietrengende over 18 år
 */
export function MedisinskVilkarProsessStegInitPanel(props: Props) {
  const context = useContext(ProsessPanelContext);
  // Definer panel-identitet som konstanter
  const PANEL_ID = prosessStegCodes.MEDISINSK_VILKAR;
  const PANEL_TEKST = 'Behandlingspunkt.MedisinskVilkar';

  // Hent standard props for å få tilgang til vilkår, aksjonspunkter og feature toggles

  // Relevante vilkår for medisinsk vilkår-panelet
  const RELEVANTE_VILKAR_KODER = [vilkarType.MEDISINSKEVILKÅR_UNDER_18_ÅR, vilkarType.MEDISINSKEVILKÅR_18_ÅR];

  // Filtrer vilkår som er relevante for dette panelet
  const vilkarForSteg = useMemo(() => {
    if (!props.vilkar) {
      return [];
    }
    return props.vilkar.filter(vilkar => RELEVANTE_VILKAR_KODER.includes(vilkar.vilkarType?.kode));
  }, [props.vilkar]);
  // Sjekk om panelet skal vises
  // Panelet vises hvis det finnes relevante vilkår
  const skalVisePanel = vilkarForSteg.length > 0;

  // Beregn paneltype basert på vilkårstatus og aksjonspunkter (for menystatusindikator)
  const panelType = useMemo((): ProcessMenuStepType => {
    // Hvis panelet ikke skal vises, bruk default
    if (!skalVisePanel) {
      return ProcessMenuStepType.default;
    }

    // Sjekk om det finnes åpent aksjonspunkt for medisinsk vilkår (warning har prioritet)
    const harApenAksjonspunkt = props.aksjonspunkter?.some(
      ap => ap.definisjon?.kode === aksjonspunktCodes.MEDISINSK_VILKAAR && ap.status?.kode === 'OPPR',
    );
    if (harApenAksjonspunkt) {
      return ProcessMenuStepType.warning;
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

    // Default tilstand
    return ProcessMenuStepType.default;
  }, [skalVisePanel, vilkarForSteg, props.aksjonspunkter]);

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

  const vilkårPleietrengendeUnder18år = props.vilkar?.find(
    v => v.vilkarType.kode === vilkarType.MEDISINSKEVILKÅR_UNDER_18_ÅR,
  );
  const vilkårPleietrengendeOver18år = props.vilkar?.find(v => v.vilkarType.kode === vilkarType.MEDISINSKEVILKÅR_18_ÅR);
  const perioderUnder18 =
    vilkårPleietrengendeUnder18år?.perioder.map(periode => ({
      ...periode,
      pleietrengendeErOver18år: false,
    })) ?? [];
  const perioderOver18 =
    vilkårPleietrengendeOver18år?.perioder.map(periode => ({
      ...periode,
      pleietrengendeErOver18år: true,
    })) ?? [];
  const allePerioder = perioderUnder18.concat(perioderOver18);
  return (
    <SykdomProsessIndex lovReferanse={vilkarForSteg[0].lovReferanse} panelTittelKode="Sykdom" perioder={allePerioder} />
  );
}
