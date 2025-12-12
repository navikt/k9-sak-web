import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import { isAvslag } from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import VedtakProsessIndex from '@fpsak-frontend/prosess-vedtak';
import { ProsessDefaultInitPanel } from '@k9-sak-web/gui/behandling/prosess/ProsessDefaultInitPanel.js';
import { ProsessPanelContext } from '@k9-sak-web/gui/behandling/prosess/ProsessPanelContext.js';
import { usePanelRegistrering } from '@k9-sak-web/gui/behandling/prosess/hooks/usePanelRegistrering.js';
import { useStandardProsessPanelProps } from '@k9-sak-web/gui/behandling/prosess/hooks/useStandardProsessPanelProps.js';
import { prosessStegCodes } from '@k9-sak-web/konstanter';
import { konverterKodeverkTilKode } from '@k9-sak-web/lib/kodeverk/konverterKodeverkTilKode.js';
import { ProcessMenuStepType } from '@navikt/ft-plattform-komponenter';
import { useContext, useMemo } from 'react';
import { PleiepengerBehandlingApiKeys, restApiPleiepengerHooks } from '../data/pleiepengerBehandlingApi';

/**
 * InitPanel for vedtak prosesssteg
 *
 * Wrapper for vedtakspanelet som håndterer:
 * - Registrering med menyen via usePanelRegistrering
 * - Beregning av paneltype basert på vilkårstatus, aksjonspunkter og behandlingsresultat
 * - Rendering av legacy panelkomponent via ProsessDefaultInitPanel
 *
 * Dette panelet håndterer vedtaksfatting og er alltid synlig.
 * Det har kompleks statuslogikk som tar hensyn til:
 * - Om alle vilkår er vurdert
 * - Om det finnes åpne aksjonspunkter utenfor vedtakspanelet
 * - Om behandlingsresultatet er avslag eller innvilgelse
 * - Spesielle aksjonspunkter som OVERSTYR_BEREGNING
 */
export function VedtakProsessStegInitPanel() {
  const context = useContext(ProsessPanelContext);
  // Definer panel-identitet som konstanter
  const PANEL_ID = prosessStegCodes.VEDTAK;
  const PANEL_TEKST = 'Behandlingspunkt.Vedtak';

  // Hent standard props for å få tilgang til vilkår, aksjonspunkter og behandling
  const standardProps = useStandardProsessPanelProps();

  const restApiData = restApiPleiepengerHooks.useMultipleRestApi<{
    simuleringResultat: any;
    beregningsgrunnlag: any;
    tilbakekrevingvalg: any;
    medlemskap: any;
    tilgjengeligeVedtaksbrev: any;
    informasjonsbehovVedtaksbrev: any;
    dokumentdataHente: any;
    fritekstdokumenter: any;
    overlappendeYtelser: any;
  }>(
    [
      { key: PleiepengerBehandlingApiKeys.SIMULERING_RESULTAT },
      { key: PleiepengerBehandlingApiKeys.BEREGNINGSGRUNNLAG },
      { key: PleiepengerBehandlingApiKeys.TILBAKEKREVINGVALG },
      { key: PleiepengerBehandlingApiKeys.MEDLEMSKAP },
      { key: PleiepengerBehandlingApiKeys.TILGJENGELIGE_VEDTAKSBREV },
      { key: PleiepengerBehandlingApiKeys.INFORMASJONSBEHOV_VEDTAKSBREV },
      { key: PleiepengerBehandlingApiKeys.DOKUMENTDATA_HENTE },
      { key: PleiepengerBehandlingApiKeys.FRITEKSTDOKUMENTER },
      { key: PleiepengerBehandlingApiKeys.OVERLAPPENDE_YTELSER },
    ],
    { keepData: true, suspendRequest: false, updateTriggers: [] },
  );

  // Aksjonspunkter som tilhører vedtakspanelet
  const vedtakAksjonspunkter = useMemo(() => {
    const vedtakAksjonspunktKoder = [
      aksjonspunktCodes.FORESLA_VEDTAK,
      aksjonspunktCodes.FATTER_VEDTAK,
      aksjonspunktCodes.FORESLA_VEDTAK_MANUELT,
      aksjonspunktCodes.VEDTAK_UTEN_TOTRINNSKONTROLL,
      aksjonspunktCodes.VURDERE_ANNEN_YTELSE,
      aksjonspunktCodes.VURDERE_OVERLAPPENDE_YTELSER_FØR_VEDTAK,
      aksjonspunktCodes.VURDERE_DOKUMENT,
      aksjonspunktCodes.KONTROLLER_REVURDERINGSBEHANDLING_VARSEL_VED_UGUNST,
      aksjonspunktCodes.KONTROLL_AV_MAUNELT_OPPRETTET_REVURDERINGSBEHANDLING,
      aksjonspunktCodes.SJEKK_TILBAKEKREVING,
    ];

    return standardProps.aksjonspunkter?.filter(ap => vedtakAksjonspunktKoder.includes(ap.definisjon?.kode)) || [];
  }, [standardProps.aksjonspunkter]);

  // Beregn paneltype basert på vedtaksstatus (for menystatusindikator)
  // Dette er kompleks logikk som matcher findStatusForVedtak fra legacy-koden
  const panelType = useMemo((): ProcessMenuStepType => {
    const { vilkar, aksjonspunkter, behandling } = standardProps;

    // Hvis ingen vilkår, er panelet ikke vurdert (default)
    if (!vilkar || vilkar.length === 0) {
      return ProcessMenuStepType.default;
    }

    // Sjekk om noen vilkår ikke er vurdert
    const harIkkeVurdertVilkar = vilkar.some(v =>
      v.perioder.some(periode => periode.vilkarStatus.kode === vilkarUtfallType.IKKE_VURDERT),
    );

    // Sjekk om det finnes åpent OVERSTYR_BEREGNING aksjonspunkt
    const harApenOverstyringBeregning = aksjonspunkter?.some(
      ap => ap.definisjon?.kode === aksjonspunktCodes.OVERSTYR_BEREGNING && isAksjonspunktOpen(ap.status?.kode),
    );

    // Hvis vilkår ikke er vurdert eller det finnes åpen overstyring, vis default
    if (harIkkeVurdertVilkar || harApenOverstyringBeregning) {
      return ProcessMenuStepType.default;
    }

    // Sjekk om det finnes åpne aksjonspunkter utenfor vedtakspanelet
    const harApneAksjonspunkterUtenforVedtak = aksjonspunkter?.some(
      ap =>
        !vedtakAksjonspunkter.some(vap => vap.definisjon?.kode === ap.definisjon?.kode) &&
        isAksjonspunktOpen(ap.status?.kode),
    );

    // Hvis det finnes åpne aksjonspunkter utenfor vedtak, vis default
    if (harApneAksjonspunkterUtenforVedtak) {
      return ProcessMenuStepType.default;
    }

    // Sjekk behandlingsresultat
    if (behandling?.behandlingsresultat?.type?.kode) {
      if (isAvslag(behandling.behandlingsresultat.type.kode)) {
        // Avslag vises som danger
        return ProcessMenuStepType.danger;
      }
      // Innvilgelse vises som success
      return ProcessMenuStepType.success;
    }

    // Default tilstand
    return ProcessMenuStepType.default;
  }, [standardProps, vedtakAksjonspunkter]);

  // Registrer panel med menyen
  const erValgt = context?.erValgt(PANEL_ID);
  // Registrer panel med menyen
  usePanelRegistrering({ ...context, erValgt }, PANEL_ID, PANEL_TEKST, panelType);

  // Render kun hvis panelet er valgt (injisert av ProsessMeny)
  if (!erValgt) {
    return null;
  }

  const data = restApiData.data;
  if (!data) {
    return null;
  }

  return (
    // Bruker ProsessDefaultInitPanel for å hente standard props og rendre legacy panel
    <ProsessDefaultInitPanel urlKode={prosessStegCodes.VEDTAK} tekstKode="Behandlingspunkt.Vedtak">
      {standardProps => {
        const deepCopyProps = JSON.parse(
          JSON.stringify({
            ...standardProps,
            ...data,
          }),
        );
        konverterKodeverkTilKode(deepCopyProps, false);
        return <VedtakProsessIndex {...standardProps} {...deepCopyProps} />;
      }}
    </ProsessDefaultInitPanel>
  );
}
