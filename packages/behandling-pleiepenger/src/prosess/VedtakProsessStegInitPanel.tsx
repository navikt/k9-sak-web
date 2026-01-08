import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import { isAvslag } from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import VedtakProsessIndex from '@fpsak-frontend/prosess-vedtak';
import { ProsessPanelContext } from '@k9-sak-web/gui/behandling/prosess/ProsessPanelContext.js';
import { ProsessStegIkkeVurdert } from '@k9-sak-web/gui/behandling/prosess/ProsessStegIkkeVurdert.js';
import { usePanelRegistrering } from '@k9-sak-web/gui/behandling/prosess/hooks/usePanelRegistrering.js';
import { prosessStegCodes } from '@k9-sak-web/konstanter';
import { Behandling } from '@k9-sak-web/types';
import { ProcessMenuStepType } from '@navikt/ft-plattform-komponenter';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useContext, useMemo } from 'react';
import { PleiepengerBehandlingApiKeys, restApiPleiepengerHooks } from '../data/pleiepengerBehandlingApi';
import { K9SakProsessApi } from './api/K9SakProsessApi';

interface Props {
  api: K9SakProsessApi;
  behandling: Behandling;
  hentFritekstbrevHtmlCallback: (parameters: any) => Promise<any>;
  isReadOnly: boolean;
  lagreDokumentdata: (params?: any, keepData?: boolean | undefined) => Promise<Behandling>;
  previewCallback: (data: any, aapneINyttVindu: boolean) => Promise<any>;
  submitCallback: (data: any) => Promise<any>;
}

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
export function VedtakProsessStegInitPanel(props: Props) {
  const context = useContext(ProsessPanelContext);
  // Definer panel-identitet som konstanter
  const PANEL_ID = prosessStegCodes.VEDTAK;
  const PANEL_TEKST = 'Behandlingspunkt.Vedtak';

  const { data: behandlingV2 } = useSuspenseQuery({
    queryKey: ['behandling', props.behandling.uuid, props.behandling.versjon],
    queryFn: () => props.api.getBehandling(props.behandling.uuid),
  });

  const { data: aksjonspunkter = [] } = useSuspenseQuery({
    queryKey: ['aksjonspunkter', props.behandling.uuid, props.behandling.versjon],
    queryFn: () => props.api.getAksjonspunkter(props.behandling.uuid),
  });

  const { data: vilkår } = useSuspenseQuery({
    queryKey: ['vilkar', props.behandling.uuid, props.behandling.versjon],
    queryFn: () => props.api.getVilkår(props.behandling.uuid),
  });

  const { data: arbeidsgiverOpplysningerPerId } = useSuspenseQuery({
    queryKey: ['arbeidsgiverOpplysningerPerId', props.behandling.uuid, props.behandling.versjon],
    queryFn: () => props.api.getArbeidsgiverOpplysninger(props.behandling.uuid),
  });

  const { data: beregningsgrunnlag = [] } = useSuspenseQuery({
    queryKey: ['beregningsgrunnlag', props.behandling.uuid, props.behandling.versjon],
    queryFn: () => props.api.getAlleBeregningsgrunnlag(props.behandling.uuid),
  });

  const { data: simuleringResultat } = useSuspenseQuery({
    queryKey: ['simuleringResultat', props.behandling.uuid, props.behandling.versjon],
    queryFn: () => props.api.getSimuleringResultat(props.behandling.uuid),
  });

  const { data: tilbakekrevingvalg } = useSuspenseQuery({
    queryKey: ['tilbakekrevingvalg', props.behandling.uuid, props.behandling.versjon],
    queryFn: () => props.api.getTilbakekrevingValg(props.behandling.uuid),
  });

  const { data: overlappendeYtelser } = useSuspenseQuery({
    queryKey: ['overlappendeYtelser', props.behandling.uuid, props.behandling.versjon],
    queryFn: () => props.api.getHOverlappendeYtelser(props.behandling.uuid),
  });

  const { data: personopplysninger } = useSuspenseQuery({
    queryKey: ['personopplysninger', props.behandling.uuid, props.behandling.versjon],
    queryFn: () => props.api.getPersonopplysninger(props.behandling.uuid),
  });

  const { data: medlemskap } = useSuspenseQuery({
    queryKey: ['medlemskap', props.behandling.uuid, props.behandling.versjon],
    queryFn: () => props.api.getMedlemskap(props.behandling.uuid),
  });

  const restApiData = restApiPleiepengerHooks.useMultipleRestApi<{
    tilgjengeligeVedtaksbrev: any;
    informasjonsbehovVedtaksbrev: any;
    dokumentdataHente: any;
    fritekstdokumenter: any;
  }>(
    [
      { key: PleiepengerBehandlingApiKeys.TILGJENGELIGE_VEDTAKSBREV },
      { key: PleiepengerBehandlingApiKeys.INFORMASJONSBEHOV_VEDTAKSBREV },
      { key: PleiepengerBehandlingApiKeys.DOKUMENTDATA_HENTE },
      { key: PleiepengerBehandlingApiKeys.FRITEKSTDOKUMENTER },
    ],
    { keepData: true, suspendRequest: false, updateTriggers: [props.behandling.versjon] },
  );

  // Aksjonspunkter som tilhører vedtakspanelet
  // const vedtakAksjonspunkter = useMemo(() => {
  //   const vedtakAksjonspunktKoder = [
  //     aksjonspunktCodes.FORESLA_VEDTAK,
  //     aksjonspunktCodes.FATTER_VEDTAK,
  //     aksjonspunktCodes.FORESLA_VEDTAK_MANUELT,
  //     aksjonspunktCodes.VEDTAK_UTEN_TOTRINNSKONTROLL,
  //     aksjonspunktCodes.VURDERE_ANNEN_YTELSE,
  //     aksjonspunktCodes.VURDERE_OVERLAPPENDE_YTELSER_FØR_VEDTAK,
  //     aksjonspunktCodes.VURDERE_DOKUMENT,
  //     aksjonspunktCodes.KONTROLLER_REVURDERINGSBEHANDLING_VARSEL_VED_UGUNST,
  //     aksjonspunktCodes.KONTROLL_AV_MAUNELT_OPPRETTET_REVURDERINGSBEHANDLING,
  //     aksjonspunktCodes.SJEKK_TILBAKEKREVING,
  //   ];

  //   return aksjonspunkter?.filter(ap => ap.definisjon && vedtakAksjonspunktKoder.includes(ap.definisjon)) || [];
  // }, [aksjonspunkter]);

  // Beregn paneltype basert på vedtaksstatus (for menystatusindikator)
  // Dette er kompleks logikk som matcher findStatusForVedtak fra legacy-koden
  const panelType = useMemo((): ProcessMenuStepType => {
    // Hvis ingen vilkår, er panelet ikke vurdert (default)
    if (!vilkår || vilkår.length === 0) {
      return ProcessMenuStepType.default;
    }

    // Sjekk om noen vilkår ikke er vurdert
    const harIkkeVurdertVilkar = vilkår.some(v =>
      v.perioder?.some(periode => periode.vilkarStatus === vilkarUtfallType.IKKE_VURDERT),
    );

    // Sjekk om det finnes åpent OVERSTYR_BEREGNING aksjonspunkt
    const harApenOverstyringBeregning = aksjonspunkter?.some(
      ap => ap.definisjon === aksjonspunktCodes.OVERSTYR_BEREGNING && ap.status && isAksjonspunktOpen(ap.status),
    );

    // Hvis vilkår ikke er vurdert eller det finnes åpen overstyring, vis default
    if (harIkkeVurdertVilkar || harApenOverstyringBeregning) {
      return ProcessMenuStepType.default;
    }

    // Sjekk om det finnes åpne aksjonspunkter utenfor vedtakspanelet
    const harApneAksjonspunkterUtenforVedtak = aksjonspunkter?.some(
      ap => aksjonspunkter.some(vap => vap.definisjon === ap.definisjon) && ap.status && isAksjonspunktOpen(ap.status),
    );

    // Hvis det finnes åpne aksjonspunkter utenfor vedtak, vis default
    if (harApneAksjonspunkterUtenforVedtak) {
      return ProcessMenuStepType.warning;
    }

    // Sjekk behandlingsresultat
    if (behandlingV2?.behandlingsresultat?.type) {
      if (isAvslag(behandlingV2.behandlingsresultat.type)) {
        // Avslag vises som danger
        return ProcessMenuStepType.danger;
      }
      // Innvilgelse vises som success
      return ProcessMenuStepType.success;
    }

    // Default tilstand
    return ProcessMenuStepType.default;
  }, [aksjonspunkter, behandlingV2, vilkår]);

  // Registrer panel med menyen
  const erValgt = context?.erValgt(PANEL_ID);
  // Registrer panel med menyen
  usePanelRegistrering({ ...context, erValgt }, PANEL_ID, PANEL_TEKST, panelType);

  const erStegVurdert = panelType !== ProcessMenuStepType.default;

  // Render kun hvis panelet er valgt (injisert av ProsessMeny)
  if (!erValgt || !restApiData.data) {
    return null;
  }
  if (!erStegVurdert) {
    return <ProsessStegIkkeVurdert />;
  }

  return (
    <VedtakProsessIndex
      isReadOnly={props.isReadOnly}
      informasjonsbehovVedtaksbrev={restApiData.data?.informasjonsbehovVedtaksbrev}
      hentFritekstbrevHtmlCallback={props.hentFritekstbrevHtmlCallback}
      fritekstdokumenter={restApiData.data?.fritekstdokumenter}
      dokumentdataHente={restApiData.data?.dokumentdataHente}
      aksjonspunkter={aksjonspunkter}
      arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId.arbeidsgivere || {}}
      behandling={behandlingV2}
      beregningsgrunnlag={beregningsgrunnlag}
      vilkar={vilkår}
      submitCallback={props.submitCallback}
      simuleringResultat={simuleringResultat}
      tilbakekrevingvalg={tilbakekrevingvalg}
      ytelseTypeKode={behandlingV2?.sakstype}
      lagreDokumentdata={props.lagreDokumentdata}
      previewCallback={props.previewCallback}
      overlappendeYtelser={overlappendeYtelser}
      personopplysninger={personopplysninger}
      tilgjengeligeVedtaksbrev={restApiData.data?.tilgjengeligeVedtaksbrev}
      medlemskap={medlemskap}
    />
  );
}
