import BehandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import TotrinnskontrollSakIndex from '@fpsak-frontend/sak-totrinnskontroll';
import { LoadingPanel } from '@fpsak-frontend/shared-components';
import { RestApiState } from '@k9-sak-web/rest-api-hooks';
import {
  BehandlingAppKontekst,
  KlageVurdering,
  NavAnsatt,
  TotrinnskontrollSkjermlenkeContext,
} from '@k9-sak-web/types';
import React, { useCallback, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { BehandlingType } from '@k9-sak-web/lib/types/BehandlingType.js';
import { Fagsak } from '@k9-sak-web/gui/sak/Fagsak.js';
import { createLocationForSkjermlenke } from '../../app/paths';
import { K9sakApiKeys, requestApi, restApiHooks } from '../../data/k9sakApi';
import BeslutterModalIndex from './BeslutterModalIndex';

type Values = {
  fatterVedtakAksjonspunktDto: any;
  erAlleAksjonspunktGodkjent: boolean;
};

const getLagreFunksjon =
  (
    saksnummer: string,
    behandlingId: number,
    behandlingVersjon: number,
    setAlleAksjonspunktTilGodkjent: (erGodkjent: boolean) => void,
    setVisBeslutterModal: (visModal: boolean) => void,
    godkjennTotrinnsaksjonspunkter: (params: any) => Promise<any>,
  ) =>
  (totrinnskontrollData: Values) => {
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
const TotrinnskontrollIndex = ({ fagsak, alleBehandlinger, behandlingId, behandlingVersjon }: OwnProps) => {
  const [visBeslutterModal, setVisBeslutterModal] = useState(false);
  const [erAlleAksjonspunktGodkjent, setAlleAksjonspunktTilGodkjent] = useState(false);

  const behandling = alleBehandlinger.find(b => b.id === behandlingId);

  const location = useLocation();

  const { brukernavn, kanVeilede } = restApiHooks.useGlobalStateRestApiData<NavAnsatt>(K9sakApiKeys.NAV_ANSATT);

  const erInnsynBehandling = behandling.type === BehandlingType.DOKUMENTINNSYN;

  const { data: totrinnArsaker } = restApiHooks.useRestApi<TotrinnskontrollSkjermlenkeContext[]>(
    K9sakApiKeys.TOTRINNSAKSJONSPUNKT_ARSAKER,
    undefined,
    {
      updateTriggers: [behandlingId, behandling.status],
      suspendRequest: !!erInnsynBehandling || behandling.status !== BehandlingStatus.FATTER_VEDTAK,
    },
  );
  const { data: totrinnArsakerReadOnly } = restApiHooks.useRestApi<TotrinnskontrollSkjermlenkeContext[]>(
    K9sakApiKeys.TOTRINNSAKSJONSPUNKT_ARSAKER_READONLY,
    undefined,
    {
      updateTriggers: [behandlingId, behandling.status],
      suspendRequest: !!erInnsynBehandling || behandling.status !== BehandlingStatus.BEHANDLING_UTREDES,
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

  const { startRequest: godkjennTotrinnsaksjonspunkter } = restApiHooks.useRestApiRunner(
    K9sakApiKeys.SAVE_TOTRINNSAKSJONSPUNKT,
  );

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

  if (totrinnsKlageVurderingState === RestApiState.LOADING) {
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
        behandlingKlageVurdering={totrinnsKlageVurdering}
        createLocationForSkjermlenke={createLocationForSkjermlenke}
      />
      {visBeslutterModal && (
        <BeslutterModalIndex
          behandling={behandling}
          fagsakYtelseType={fagsak.sakstype}
          allAksjonspunktApproved={erAlleAksjonspunktGodkjent}
          erKlageWithKA={totrinnsKlageVurdering ? !!totrinnsKlageVurdering.klageVurderingResultatNK : undefined}
        />
      )}
    </>
  );
};

export default TotrinnskontrollIndex;
