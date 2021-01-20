import React, { FunctionComponent, useState, useCallback } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import BehandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import BehandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import { RestApiState } from '@k9-sak-web/rest-api-hooks';
import {
  NavAnsatt,
  Fagsak,
  KlageVurdering,
  TotrinnskontrollSkjermlenkeContext,
  BehandlingAppKontekst,
} from '@k9-sak-web/types';
import { LoadingPanel } from '@fpsak-frontend/shared-components';
import TotrinnskontrollSakIndex from '@fpsak-frontend/sak-totrinnskontroll';

import lagForhåndsvisRequest from '@fpsak-frontend/utils/src/formidlingUtils';
import dokumentMalType from '@fpsak-frontend/kodeverk/src/dokumentMalType';
import useVisForhandsvisningAvMelding from '../../data/useVisForhandsvisningAvMelding';
import { createLocationForSkjermlenke } from '../../app/paths';
import { useKodeverk } from '../../data/useKodeverk';
import { K9sakApiKeys, requestApi, restApiHooks } from '../../data/k9sakApi';
import BeslutterModalIndex from './BeslutterModalIndex';

type Values = {
  fatterVedtakAksjonspunktDto: any;
  erAlleAksjonspunktGodkjent: boolean;
};

const getLagreFunksjon = (
  saksnummer: string,
  behandlingId: number,
  behandlingVersjon: number,
  setAlleAksjonspunktTilGodkjent: (erGodkjent: boolean) => void,
  setVisBeslutterModal: (visModal: boolean) => void,
  godkjennTotrinnsaksjonspunkter: (params: any) => Promise<any>,
) => (totrinnskontrollData: Values) => {
  const params = {
    saksnummer,
    behandlingId,
    behandlingVersjon,
    bekreftedeAksjonspunktDtoer: [totrinnskontrollData.fatterVedtakAksjonspunktDto],
  };
  setAlleAksjonspunktTilGodkjent(totrinnskontrollData.erAlleAksjonspunktGodkjent);
  setVisBeslutterModal(true);
  return godkjennTotrinnsaksjonspunkter(params);
};

interface OwnProps {
  fagsak: Fagsak;
  alleBehandlinger: BehandlingAppKontekst[];
  behandlingId: number;
  behandlingVersjon: number;
}

/**
 * TotrinnskontrollIndex
 *
 * Containerklass ansvarlig for att rita opp vilkår og aksjonspunkter med toTrinnskontroll
 */
const TotrinnskontrollIndex: FunctionComponent<OwnProps> = ({
  fagsak,
  alleBehandlinger,
  behandlingId,
  behandlingVersjon,
}) => {
  const [visBeslutterModal, setVisBeslutterModal] = useState(false);
  const [erAlleAksjonspunktGodkjent, setAlleAksjonspunktTilGodkjent] = useState(false);

  const behandling = alleBehandlinger.find(b => b.id === behandlingId);

  const location = useLocation();
  const history = useHistory();

  const { brukernavn, kanVeilede } = restApiHooks.useGlobalStateRestApiData<NavAnsatt>(K9sakApiKeys.NAV_ANSATT);

  const alleKodeverk = useKodeverk(behandling.type);

  const erInnsynBehandling = behandling.type.kode === BehandlingType.DOKUMENTINNSYN;

  const { data: totrinnArsaker } = restApiHooks.useRestApi<TotrinnskontrollSkjermlenkeContext[]>(
    K9sakApiKeys.TOTRINNSAKSJONSPUNKT_ARSAKER,
    undefined,
    {
      updateTriggers: [behandlingId, behandling.status.kode],
      suspendRequest: !!erInnsynBehandling || behandling.status.kode !== BehandlingStatus.FATTER_VEDTAK,
    },
  );
  const { data: totrinnArsakerReadOnly } = restApiHooks.useRestApi<TotrinnskontrollSkjermlenkeContext[]>(
    K9sakApiKeys.TOTRINNSAKSJONSPUNKT_ARSAKER_READONLY,
    undefined,
    {
      updateTriggers: [behandlingId, behandling.status.kode],
      suspendRequest: !!erInnsynBehandling || behandling.status.kode !== BehandlingStatus.BEHANDLING_UTREDES,
    },
  );

  const { data: totrinnsKlageVurdering, state: totrinnsKlageVurderingState } = restApiHooks.useRestApi<KlageVurdering>(
    K9sakApiKeys.TOTRINNS_KLAGE_VURDERING,
    undefined,
    {
      keepData: true,
      updateTriggers: [behandlingId, behandlingVersjon],
      suspendRequest: !requestApi.hasPath(K9sakApiKeys.TOTRINNS_KLAGE_VURDERING),
    },
  );

  const { data: tilgjengeligeVedtaksbrev, state: tilgjengeligeVedtaksbrevState } = restApiHooks.useRestApi<string[]>(
    K9sakApiKeys.TILGJENGELIGE_VEDTAKSBREV,
    undefined,
    {
      keepData: true,
      updateTriggers: [behandlingId, behandlingVersjon],
      suspendRequest: !requestApi.hasPath(K9sakApiKeys.TILGJENGELIGE_VEDTAKSBREV),
    },
  );

  const { startRequest: godkjennTotrinnsaksjonspunkter } = restApiHooks.useRestApiRunner(
    K9sakApiKeys.SAVE_TOTRINNSAKSJONSPUNKT,
  );

  const erTilbakekreving =
    BehandlingType.TILBAKEKREVING === behandling?.type.kode ||
    BehandlingType.TILBAKEKREVING_REVURDERING === behandling?.type.kode;

  const forhaandsvisRequest = erTilbakekreving
    ? {
        behandlingUuid: behandling.uuid,
        ytelseType: fagsak.sakstype,
        gjelderVedtak: true,
      }
    : { ...lagForhåndsvisRequest(behandling, fagsak, fagsak.person, { dokumentMal: dokumentMalType.UTLED }) };

  const forhandsvisMelding = useVisForhandsvisningAvMelding(behandling.type);
  const forhandsvisVedtaksbrev = useCallback(() => {
    forhandsvisMelding(false, forhaandsvisRequest);
  }, []);
  const onSubmit = useCallback(
    getLagreFunksjon(
      fagsak.saksnummer,
      behandlingId,
      behandlingVersjon,
      setAlleAksjonspunktTilGodkjent,
      setVisBeslutterModal,
      godkjennTotrinnsaksjonspunkter,
    ),
    [behandlingId, behandlingVersjon],
  );

  if (!totrinnArsaker && !totrinnArsakerReadOnly) {
    return null;
  }

  if (totrinnsKlageVurderingState === RestApiState.LOADING || tilgjengeligeVedtaksbrevState === RestApiState.LOADING) {
    return <LoadingPanel />;
  }

  return (
    <>
      <TotrinnskontrollSakIndex
        behandling={behandling}
        totrinnskontrollSkjermlenkeContext={totrinnArsaker || totrinnArsakerReadOnly}
        location={location}
        readOnly={brukernavn === behandling.ansvarligSaksbehandler || kanVeilede}
        onSubmit={onSubmit}
        forhandsvisVedtaksbrev={forhandsvisVedtaksbrev}
        fagsakYtelseType={fagsak.sakstype}
        alleKodeverk={alleKodeverk}
        behandlingKlageVurdering={totrinnsKlageVurdering}
        createLocationForSkjermlenke={createLocationForSkjermlenke}
        tilgjengeligeVedtaksbrev={tilgjengeligeVedtaksbrev}
      />
      {visBeslutterModal && (
        <BeslutterModalIndex
          behandling={behandling}
          fagsakYtelseType={fagsak.sakstype}
          pushLocation={history.push}
          allAksjonspunktApproved={erAlleAksjonspunktGodkjent}
          erKlageWithKA={totrinnsKlageVurdering ? !!totrinnsKlageVurdering.klageVurderingResultatNK : undefined}
        />
      )}
    </>
  );
};

export default TotrinnskontrollIndex;
