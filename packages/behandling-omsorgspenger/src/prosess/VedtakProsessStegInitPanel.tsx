import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import VedtakProsessIndex from '@fpsak-frontend/prosess-vedtak';
import { TilgjengeligeVedtaksbrev } from '@fpsak-frontend/utils/src/formidlingUtils';
import type { AksjonspunktDto } from '@k9-sak-web/backend/k9sak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import { lagDokumentdata } from '@k9-sak-web/behandling-felles';
import { K9SakProsessApi } from '@k9-sak-web/gui/behandling/prosess/api/K9SakProsessApi.js';
import {
  aksjonspunkterQueryOptions,
  arbeidsgiverOpplysningerQueryOptions,
  behandlingQueryOptions,
  beregningsgrunnlagQueryOptions,
  overlappendeYtelserQueryOptions,
  personopplysningerQueryOptions,
  simuleringResultatQueryOptions,
  tilbakekrevingvalgQueryOptions,
  vilkårQueryOptions,
} from '@k9-sak-web/gui/behandling/prosess/api/k9SakQueryOptions.js';
import { ProsessPanelContext } from '@k9-sak-web/gui/behandling/prosess/ProsessPanelContext.js';
import { ProsessStegIkkeBehandlet } from '@k9-sak-web/gui/behandling/prosess/ProsessStegIkkeBehandlet.js';
import { prosessStegCodes } from '@k9-sak-web/konstanter';
import { Behandling } from '@k9-sak-web/types';
import { useSuspenseQueries } from '@tanstack/react-query';
import { useContext, useMemo } from 'react';
import RestApiState from '../../../rest-api-hooks/src/RestApiState';
import { OmsorgspengerBehandlingApiKeys, restApiOmsorgHooks } from '../data/omsorgspengerBehandlingApi';
import { fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';

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

const PANEL_ID = prosessStegCodes.VEDTAK;

interface Props {
  api: K9SakProsessApi;
  behandling: Behandling;
  hentFritekstbrevHtmlCallback: (parameters: any) => Promise<any>;
  isReadOnly: boolean;
  lagreDokumentdata: (params?: any, keepData?: boolean | undefined) => Promise<Behandling>;
  previewCallback: (data: any, aapneINyttVindu: boolean) => Promise<any>;
  submitCallback: (
    aksjonspunktModels: any[],
    aksjonspunkter: AksjonspunktDto[],
    skalForhindreOppdaterUrl?: boolean,
  ) => Promise<any>;
  onVedtakAksjonspunktBekreftet: (visIverksetterVedtakModal: boolean, visFatterVedtakModal: boolean) => void;
}

export function VedtakProsessStegInitPanel(props: Props) {
  const prosessPanelContext = useContext(ProsessPanelContext);

  const erValgt = prosessPanelContext?.erValgt(PANEL_ID);
  const erTilBehandlingEllerBehandlet = !!prosessPanelContext?.erTilBehandlingEllerBehandlet(PANEL_ID);

  const [
    { data: behandlingV2 },
    { data: aksjonspunkter = [] },
    { data: vilkår },
    { data: arbeidsgiverOpplysningerPerId },
    { data: personopplysninger },
    { data: beregningsgrunnlag },
    { data: simuleringResultat },
    { data: tilbakekrevingvalg },
    { data: overlappendeYtelser },
  ] = useSuspenseQueries({
    queries: [
      behandlingQueryOptions(props.api, props.behandling),
      aksjonspunkterQueryOptions(props.api, props.behandling),
      vilkårQueryOptions(props.api, props.behandling),
      arbeidsgiverOpplysningerQueryOptions(props.api, props.behandling),
      personopplysningerQueryOptions(props.api, props.behandling),
      beregningsgrunnlagQueryOptions(props.api, props.behandling, erTilBehandlingEllerBehandlet),
      simuleringResultatQueryOptions(props.api, props.behandling, erTilBehandlingEllerBehandlet),
      tilbakekrevingvalgQueryOptions(props.api, props.behandling, erTilBehandlingEllerBehandlet),
      overlappendeYtelserQueryOptions(props.api, props.behandling, erTilBehandlingEllerBehandlet),
    ],
  });

  // Disse endepunktene finnes foreløpig bare gjennom omsorgspengers eldre API.
  const restApiData = restApiOmsorgHooks.useMultipleRestApi<{
    dokumentdataHente: any;
    tilgjengeligeVedtaksbrev: TilgjengeligeVedtaksbrev;
  }>(
    [
      { key: OmsorgspengerBehandlingApiKeys.TILGJENGELIGE_VEDTAKSBREV },
      { key: OmsorgspengerBehandlingApiKeys.DOKUMENTDATA_HENTE },
    ],
    { keepData: true, suspendRequest: !erTilBehandlingEllerBehandlet, updateTriggers: [props.behandling.versjon] },
  );

  const vedtakAksjonspunkter = useMemo(
    () => aksjonspunkter.filter(ap => ap.definisjon && vedtakAksjonspunktKoder.some(kode => kode === ap.definisjon)),
    [aksjonspunkter],
  );

  if (!erValgt) {
    return null;
  }

  if (!erTilBehandlingEllerBehandlet) {
    return <ProsessStegIkkeBehandlet />;
  }

  if (
    restApiData.state === RestApiState.NOT_STARTED ||
    restApiData.state === RestApiState.LOADING ||
    !beregningsgrunnlag ||
    !tilbakekrevingvalg ||
    !overlappendeYtelser
  ) {
    return null;
  }

  const handleSubmit = async (data: any[]) => {
    const fatterVedtakAksjonspunktkoder = [
      aksjonspunktCodes.VEDTAK_UTEN_TOTRINNSKONTROLL,
      aksjonspunktCodes.FATTER_VEDTAK,
      aksjonspunktCodes.FORESLA_VEDTAK_MANUELT,
    ];
    const visIverksetterVedtakModal = data.some(
      ap => ap.isVedtakSubmission && fatterVedtakAksjonspunktkoder.includes(ap.kode),
    );
    const visFatterVedtakModal = data[0].isVedtakSubmission && data[0].kode === aksjonspunktCodes.FORESLA_VEDTAK;
    if (data[0].isVedtakSubmission) {
      const dokumentdata = lagDokumentdata(data[0]);
      if (dokumentdata) {
        await props.lagreDokumentdata(dokumentdata);
      }
    }
    await props.submitCallback(data, vedtakAksjonspunkter, visIverksetterVedtakModal || visFatterVedtakModal);
    props.onVedtakAksjonspunktBekreftet(visIverksetterVedtakModal, visFatterVedtakModal);
  };

  const tilpassetBehandling = {
    ...behandlingV2,
    språkkode: behandlingV2.sprakkode?.kode ?? 'NB',
  };

  return (
    <VedtakProsessIndex
      isReadOnly={props.isReadOnly}
      hentFritekstbrevHtmlCallback={props.hentFritekstbrevHtmlCallback}
      dokumentdataHente={restApiData.data?.dokumentdataHente}
      fritekstdokumenter={[]}
      informasjonsbehovVedtaksbrev={{ informasjonsbehov: [], mangler: [] }}
      aksjonspunkter={aksjonspunkter}
      arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId.arbeidsgivere || {}}
      behandling={tilpassetBehandling}
      beregningsgrunnlag={beregningsgrunnlag}
      vilkar={vilkår}
      submitCallback={handleSubmit}
      simuleringResultat={simuleringResultat}
      tilbakekrevingvalg={tilbakekrevingvalg}
      ytelseTypeKode={fagsakYtelsesType.OMSORGSPENGER}
      personopplysninger={personopplysninger}
      lagreDokumentdata={props.lagreDokumentdata}
      previewCallback={props.previewCallback}
      overlappendeYtelser={overlappendeYtelser}
      tilgjengeligeVedtaksbrev={restApiData.data?.tilgjengeligeVedtaksbrev}
    />
  );
}
