import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import { isAvslag } from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import VedtakProsessIndex from '@fpsak-frontend/prosess-vedtak';
import { TilgjengeligeVedtaksbrev } from '@fpsak-frontend/utils/src/formidlingUtils';
import { k9_sak_kontrakt_aksjonspunkt_AksjonspunktDto } from '@k9-sak-web/backend/k9sak/generated/types.js';
import { ProsessPanelContext } from '@k9-sak-web/gui/behandling/prosess/ProsessPanelContext.js';
import { ProsessStegIkkeVurdert } from '@k9-sak-web/gui/behandling/prosess/ProsessStegIkkeVurdert.js';
import { usePanelRegistrering } from '@k9-sak-web/gui/behandling/prosess/hooks/usePanelRegistrering.js';
import { prosessStegCodes } from '@k9-sak-web/konstanter';
import { Behandling } from '@k9-sak-web/types';
import { ProcessMenuStepType } from '@navikt/ft-plattform-komponenter';
import { useSuspenseQueries } from '@tanstack/react-query';
import { useContext, useMemo } from 'react';
import { PleiepengerBehandlingApiKeys, restApiPleiepengerHooks } from '../data/pleiepengerBehandlingApi';
import { K9SakProsessApi } from './api/K9SakProsessApi';
import {
  aksjonspunkterQueryOptions,
  arbeidsgiverOpplysningerQueryOptions,
  behandlingQueryOptions,
  beregningsgrunnlagQueryOptions,
  personopplysningerQueryOptions,
  vilkårQueryOptions,
} from './api/k9SakQueryOptions';

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

// Definer panel-identitet som konstanter
const PANEL_ID = prosessStegCodes.VEDTAK;
const PANEL_TEKST = 'Vedtak';

interface Props {
  api: K9SakProsessApi;
  behandling: Behandling;
  hentFritekstbrevHtmlCallback: (parameters: any) => Promise<any>;
  isReadOnly: boolean;
  lagreDokumentdata: (params?: any, keepData?: boolean | undefined) => Promise<Behandling>;
  previewCallback: (data: any, aapneINyttVindu: boolean) => Promise<any>;
  submitCallback: (data: any, aksjonspunkt: k9_sak_kontrakt_aksjonspunkt_AksjonspunktDto[]) => Promise<any>;
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

  // Hent alle data parallelt med useSuspenseQueries
  const [
    { data: behandlingV2 },
    { data: aksjonspunkter = [] },
    { data: vilkår },
    { data: arbeidsgiverOpplysningerPerId },
    { data: beregningsgrunnlag = [] },
    { data: simuleringResultat },
    { data: tilbakekrevingvalg },
    { data: overlappendeYtelser },
    { data: personopplysninger },
    { data: medlemskap },
  ] = useSuspenseQueries({
    queries: [
      behandlingQueryOptions(props.api, props.behandling),
      aksjonspunkterQueryOptions(props.api, props.behandling),
      vilkårQueryOptions(props.api, props.behandling),
      arbeidsgiverOpplysningerQueryOptions(props.api, props.behandling),
      beregningsgrunnlagQueryOptions(props.api, props.behandling),
      {
        queryKey: ['simuleringResultat', props.behandling.uuid, props.behandling.versjon],
        queryFn: () => props.api.getSimuleringResultat(props.behandling.uuid),
      },
      {
        queryKey: ['tilbakekrevingvalg', props.behandling.uuid, props.behandling.versjon],
        queryFn: () => props.api.getTilbakekrevingValg(props.behandling.uuid),
      },
      {
        queryKey: ['overlappendeYtelser', props.behandling.uuid, props.behandling.versjon],
        queryFn: () => props.api.getOverlappendeYtelser(props.behandling.uuid),
      },
      personopplysningerQueryOptions(props.api, props.behandling),
      {
        queryKey: ['medlemskap', props.behandling.uuid, props.behandling.versjon],
        queryFn: () => props.api.getMedlemskap(props.behandling.uuid),
      },
    ],
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

  const { data: tilgjengeligeVedtaksbrev } = restApiPleiepengerHooks.useRestApi<TilgjengeligeVedtaksbrev>(
    PleiepengerBehandlingApiKeys.TILGJENGELIGE_VEDTAKSBREV,
    undefined,
    {
      updateTriggers: [props.behandling.versjon],
    },
  );

  // Aksjonspunkter som tilhører vedtakspanelet
  const vedtakAksjonspunkter = useMemo(() => {
    return aksjonspunkter?.filter(ap => ap.definisjon && vedtakAksjonspunktKoder.includes(ap.definisjon)) || [];
  }, [aksjonspunkter]);

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

  const visDelvisStatus = useMemo(() => {
    return (
      vilkår.some(v => v.perioder?.some(periode => periode.vilkarStatus === vilkarUtfallType.IKKE_OPPFYLT)) &&
      vilkår.some(v => v.perioder?.some(periode => periode.vilkarStatus === vilkarUtfallType.OPPFYLT))
    );
  }, [vilkår]);

  // Registrer panel med menyen
  const erValgt = context?.erValgt(PANEL_ID);
  // Registrer panel med menyen
  usePanelRegistrering({ ...context, erValgt }, PANEL_ID, PANEL_TEKST, panelType, visDelvisStatus);

  const erStegVurdert = panelType !== ProcessMenuStepType.default;

  // Render kun hvis panelet er valgt (injisert av ProsessMeny)
  if (!erValgt || !restApiData.data || !tilgjengeligeVedtaksbrev) {
    return null;
  }
  if (!erStegVurdert) {
    return <ProsessStegIkkeVurdert />;
  }

  const handleSubmit = async (data: any) => {
    return props.submitCallback(data, vedtakAksjonspunkter);
  };

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
      submitCallback={handleSubmit}
      simuleringResultat={simuleringResultat}
      tilbakekrevingvalg={tilbakekrevingvalg}
      ytelseTypeKode={behandlingV2?.sakstype}
      lagreDokumentdata={props.lagreDokumentdata}
      previewCallback={props.previewCallback}
      overlappendeYtelser={overlappendeYtelser}
      personopplysninger={personopplysninger}
      tilgjengeligeVedtaksbrev={tilgjengeligeVedtaksbrev}
      medlemskap={medlemskap}
    />
  );
}
