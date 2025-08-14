import BehandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import { LoadingPanel } from '@fpsak-frontend/shared-components';
import { FormState } from '@k9-sak-web/gui/sak/totrinnskontroll/components/FormState.js';
import TotrinnskontrollSakIndexPropsTransformer from '@k9-sak-web/gui/sak/totrinnskontroll/TotrinnskontrollSakIndex.js';
import { RestApiState } from '@k9-sak-web/rest-api-hooks';
import {
  BehandlingAppKontekst,
  Fagsak,
  KlageVurdering,
  NavAnsatt,
  TotrinnskontrollSkjermlenkeContext,
} from '@k9-sak-web/types';
import React, { useCallback, useState } from 'react';
import { useLocation } from 'react-router';
import { createLocationForSkjermlenke } from '../../app/paths';
import { UngSakApiKeys, requestApi, restApiHooks } from '../../data/ungsakApi';
import { useKodeverk } from '../../data/useKodeverk';
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
  toTrinnFormState?: FormState;
  setToTrinnFormState?: React.Dispatch<FormState>;
}

/**
 * TotrinnskontrollIndex
 *
 * Containerklass ansvarlig for att rita opp vilkår og aksjonspunkter med toTrinnskontroll
 */
const TotrinnskontrollIndex = ({
  fagsak,
  alleBehandlinger,
  behandlingId,
  behandlingVersjon,
  toTrinnFormState,
  setToTrinnFormState,
}: OwnProps) => {
  const [visBeslutterModal, setVisBeslutterModal] = useState(false);
  const [erAlleAksjonspunktGodkjent, setAlleAksjonspunktTilGodkjent] = useState(false);

  const behandling = alleBehandlinger.find(b => b.id === behandlingId);

  const location = useLocation();

  const { brukernavn, kanVeilede } = restApiHooks.useGlobalStateRestApiData<NavAnsatt>(UngSakApiKeys.NAV_ANSATT);

  const alleKodeverk = useKodeverk(behandling?.type);

  const { data: totrinnArsaker } = restApiHooks.useRestApi<TotrinnskontrollSkjermlenkeContext[]>(
    UngSakApiKeys.TOTRINNSAKSJONSPUNKT_ARSAKER,
    undefined,
    {
      updateTriggers: [behandlingId, behandling.status.kode],
      suspendRequest: behandling.status.kode !== BehandlingStatus.FATTER_VEDTAK,
    },
  );
  const { data: totrinnArsakerReadOnly } = restApiHooks.useRestApi<TotrinnskontrollSkjermlenkeContext[]>(
    UngSakApiKeys.TOTRINNSAKSJONSPUNKT_ARSAKER_READONLY,
    undefined,
    {
      updateTriggers: [behandlingId, behandling.status.kode],
      suspendRequest: behandling.status.kode !== BehandlingStatus.BEHANDLING_UTREDES,
    },
  );

  const { data: totrinnsKlageVurdering, state: totrinnsKlageVurderingState } = restApiHooks.useRestApi<KlageVurdering>(
    UngSakApiKeys.TOTRINNS_KLAGE_VURDERING,
    undefined,
    {
      keepData: true,
      updateTriggers: [behandlingId, behandlingVersjon],
      suspendRequest: !requestApi.hasPath(UngSakApiKeys.TOTRINNS_KLAGE_VURDERING),
    },
  );

  const { startRequest: godkjennTotrinnsaksjonspunkter } = restApiHooks.useRestApiRunner(
    UngSakApiKeys.SAVE_TOTRINNSAKSJONSPUNKT,
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
      <TotrinnskontrollSakIndexPropsTransformer
        behandling={behandling}
        behandlingType={behandling?.type?.kode}
        totrinnskontrollSkjermlenkeContext={totrinnArsaker || totrinnArsakerReadOnly}
        location={location}
        readOnly={brukernavn === behandling.ansvarligSaksbehandler || kanVeilede}
        onSubmit={onSubmit}
        alleKodeverk={alleKodeverk}
        behandlingKlageVurdering={totrinnsKlageVurdering}
        createLocationForSkjermlenke={createLocationForSkjermlenke}
        toTrinnFormState={toTrinnFormState}
        setToTrinnFormState={setToTrinnFormState}
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
