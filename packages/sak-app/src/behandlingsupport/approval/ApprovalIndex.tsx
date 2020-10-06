import React, { FunctionComponent, useState, useCallback, useMemo } from 'react';

import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import { RestApiState } from '@fpsak-frontend/rest-api-hooks';
import vurderPaNyttArsakType from '@fpsak-frontend/kodeverk/src/vurderPaNyttArsakType';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import BehandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import { featureToggle } from '@k9-sak-web/konstanter';
import { NavAnsatt, Kodeverk, KodeverkMedNavn, Fagsak } from '@k9-sak-web/types';
import { requireProps, LoadingPanel } from '@fpsak-frontend/shared-components';
import TotrinnskontrollSakIndex from '@fpsak-frontend/sak-totrinnskontroll';
import klageBehandlingArsakType from '@fpsak-frontend/kodeverk/src/behandlingArsakType';

import useHistory from '../../app/useHistory';
import useLocation from '../../app/useLocation';
import BehandlingAppKontekst from '../../behandling/behandlingAppKontekstTsType';
import useVisForhandsvisningAvMelding from '../../data/useVisForhandsvisningAvMelding';
import { createLocationForSkjermlenke } from '../../app/paths';
import { FpsakApiKeys, requestApi, restApiHooks } from '../../data/fpsakApi';
import { useFpSakKodeverk, useFpTilbakeKodeverk } from '../../data/useKodeverk';
import BeslutterModalIndex from './BeslutterModalIndex';

const getArsaker = approval =>
  [
    {
      code: vurderPaNyttArsakType.FEIL_FAKTA,
      isSet: approval.feilFakta,
    },
    {
      code: vurderPaNyttArsakType.FEIL_LOV,
      isSet: approval.feilLov,
    },
    {
      code: vurderPaNyttArsakType.FEIL_REGEL,
      isSet: approval.feilRegel,
    },
    {
      code: vurderPaNyttArsakType.ANNET,
      isSet: approval.annet,
    },
  ]
    .filter(arsak => arsak.isSet)
    .map(arsak => arsak.code);

const getOnSubmit = (
  erTilbakekreving,
  behandlingId,
  saksnummer,
  selectedBehandlingVersjon,
  setAllAksjonspunktApproved,
  setShowBeslutterModal,
  approveAp,
) => values => {
  const aksjonspunkter = values.approvals.map(context => context.aksjonspunkter).reduce((a, b) => a.concat(b));

  const aksjonspunktGodkjenningDtos = aksjonspunkter.map(toTrinnsAksjonspunkt => ({
    aksjonspunktKode: toTrinnsAksjonspunkt.aksjonspunktKode,
    godkjent: toTrinnsAksjonspunkt.totrinnskontrollGodkjent,
    begrunnelse: toTrinnsAksjonspunkt.besluttersBegrunnelse,
    arsaker: getArsaker(toTrinnsAksjonspunkt),
  }));

  // TODO (TOR) Fjern hardkodinga av 5005
  const fatterVedtakAksjonspunktDto = {
    '@type': erTilbakekreving ? '5005' : aksjonspunktCodes.FATTER_VEDTAK,
    begrunnelse: null,
    aksjonspunktGodkjenningDtos,
  };
  const params = {
    behandlingId,
    saksnummer,
    behandlingVersjon: selectedBehandlingVersjon,
    bekreftedeAksjonspunktDtoer: [fatterVedtakAksjonspunktDto],
  };
  setAllAksjonspunktApproved(
    aksjonspunkter.every(ap => ap.totrinnskontrollGodkjent && ap.totrinnskontrollGodkjent === true),
  );
  setShowBeslutterModal(true);
  return approveAp(params);
};

interface TotrinnsKlageVurdering {
  klageVurdering?: string;
  klageVurderingOmgjoer?: string;
  klageVurderingResultatNFP?: any;
  klageVurderingResultatNK?: any;
}

interface OwnProps {
  fagsak: Fagsak;
  alleBehandlinger: BehandlingAppKontekst[];
  behandlingId?: number;
  behandlingVersjon?: number;
  totrinnskontrollSkjermlenkeContext?: any[];
  totrinnskontrollReadOnlySkjermlenkeContext?: any[];
}

/**
 * ApprovalIndex
 *
 * Containerklass ansvarlig for att rita opp vilkår og aksjonspunkter med toTrinnskontroll
 */
export const ApprovalIndex: FunctionComponent<OwnProps> = ({
  fagsak,
  alleBehandlinger,
  behandlingId,
  behandlingVersjon,
  totrinnskontrollSkjermlenkeContext,
  totrinnskontrollReadOnlySkjermlenkeContext,
}) => {
  const [showBeslutterModal, setShowBeslutterModal] = useState(false);
  const [allAksjonspunktApproved, setAllAksjonspunktApproved] = useState(false);

  const location = useLocation();
  const history = useHistory();

  const behandling = alleBehandlinger.find(b => b.id === behandlingId);

  const behandlingTypeKode = behandling ? behandling.type.kode : undefined;
  const erTilbakekreving =
    BehandlingType.TILBAKEKREVING === behandlingTypeKode ||
    BehandlingType.TILBAKEKREVING_REVURDERING === behandlingTypeKode;

  const erBehandlingEtterKlage = useMemo(
    () =>
      behandling
        ? behandling.behandlingArsaker
            .map(({ behandlingArsakType }) => behandlingArsakType)
            .some(
              (bt: Kodeverk) =>
                bt.kode === klageBehandlingArsakType.ETTER_KLAGE ||
                bt.kode === klageBehandlingArsakType.KLAGE_U_INNTK ||
                bt.kode === klageBehandlingArsakType.KLAGE_M_INNTK,
            )
        : false,
    [behandling],
  );

  const skjermlenkeTyperFpsak = useFpSakKodeverk(kodeverkTyper.SKJERMLENKE_TYPE);
  const skjermlenkeTyperFptilbake = useFpTilbakeKodeverk(kodeverkTyper.SKJERMLENKE_TYPE);
  const skjemalenkeTyper = erTilbakekreving ? skjermlenkeTyperFptilbake : skjermlenkeTyperFpsak;

  const navAnsatt = restApiHooks.useGlobalStateRestApiData<NavAnsatt>(FpsakApiKeys.NAV_ANSATT);
  const { brukernavn, kanVeilede } = navAnsatt;

  const alleFpSakKodeverk = restApiHooks.useGlobalStateRestApiData<{ [key: string]: KodeverkMedNavn[] }>(
    FpsakApiKeys.KODEVERK,
  );
  const alleFpTilbakeKodeverk = restApiHooks.useGlobalStateRestApiData<{ [key: string]: KodeverkMedNavn[] }>(
    FpsakApiKeys.KODEVERK_FPTILBAKE,
  );

  const { featureToggles } = restApiHooks.useGlobalStateRestApiData<{ featureToggles: { [key: string]: boolean } }>(
    FpsakApiKeys.FEATURE_TOGGLE,
  );
  const disableGodkjennKnapp = erTilbakekreving ? !featureToggles[featureToggle.BESLUTT_TILBAKEKREVING] : false;

  const { data: totrinnsKlageVurdering, state: totrinnsKlageVurderingState } = restApiHooks.useRestApi<
    TotrinnsKlageVurdering
  >(FpsakApiKeys.TOTRINNS_KLAGE_VURDERING, undefined, {
    keepData: true,
    updateTriggers: [behandlingId, behandlingVersjon],
    suspendRequest: !requestApi.hasPath(FpsakApiKeys.TOTRINNS_KLAGE_VURDERING),
  });

  const { startRequest: godkjennBehandling, state: stateGodkjennBehandling } = restApiHooks.useRestApiRunner(
    FpsakApiKeys.SAVE_TOTRINNSAKSJONSPUNKT,
  );

  const fetchPreview = useVisForhandsvisningAvMelding();

  const forhandsvisVedtaksbrev = useCallback(() => {
    fetchPreview(erTilbakekreving, false, {
      behandlingUuid: behandling.uuid,
      ytelseType: fagsak.sakstype,
      gjelderVedtak: true,
    });
  }, []);
  const onSubmit = useCallback(
    getOnSubmit(
      erTilbakekreving,
      behandlingId,
      fagsak.saksnummer,
      behandlingVersjon,
      setAllAksjonspunktApproved,
      setShowBeslutterModal,
      godkjennBehandling,
    ),
    [behandlingId, behandlingVersjon],
  );

  if (!totrinnskontrollSkjermlenkeContext && !totrinnskontrollReadOnlySkjermlenkeContext) {
    return null;
  }

  if (totrinnsKlageVurderingState === RestApiState.LOADING) {
    return <LoadingPanel />;
  }

  return (
    <>
      <TotrinnskontrollSakIndex
        behandlingId={behandlingId}
        behandlingVersjon={behandlingVersjon}
        behandlingsresultat={behandling?.behandlingsresultat}
        behandlingStatus={behandling?.status}
        totrinnskontrollSkjermlenkeContext={totrinnskontrollSkjermlenkeContext}
        totrinnskontrollReadOnlySkjermlenkeContext={totrinnskontrollReadOnlySkjermlenkeContext}
        location={location}
        readOnly={brukernavn === behandling?.ansvarligSaksbehandler || kanVeilede}
        onSubmit={onSubmit}
        forhandsvisVedtaksbrev={forhandsvisVedtaksbrev}
        toTrinnsBehandling={behandling ? behandling.toTrinnsBehandling : false}
        skjemalenkeTyper={skjemalenkeTyper}
        isForeldrepengerFagsak={fagsak.sakstype.kode === fagsakYtelseType.FORELDREPENGER}
        alleKodeverk={erTilbakekreving ? alleFpTilbakeKodeverk : alleFpSakKodeverk}
        behandlingKlageVurdering={totrinnsKlageVurdering}
        erBehandlingEtterKlage={erBehandlingEtterKlage}
        disableGodkjennKnapp={disableGodkjennKnapp}
        erTilbakekreving={erTilbakekreving}
        createLocationForSkjermlenke={createLocationForSkjermlenke}
      />
      {showBeslutterModal && (
        <BeslutterModalIndex
          erGodkjenningFerdig={stateGodkjennBehandling === RestApiState.SUCCESS}
          selectedBehandlingVersjon={behandlingVersjon}
          fagsakYtelseType={fagsak.sakstype}
          behandlingsresultat={behandling?.behandlingsresultat}
          behandlingId={behandlingId}
          behandlingTypeKode={behandlingTypeKode}
          pushLocation={history.push}
          allAksjonspunktApproved={allAksjonspunktApproved}
          behandlingStatus={behandling?.status}
          totrinnsKlageVurdering={totrinnsKlageVurdering}
        />
      )}
    </>
  );
};

export default requireProps(['behandlingId', 'behandlingVersjon'])(ApprovalIndex);
