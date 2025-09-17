import { LoadingPanel } from '@k9-sak-web/gui/shared/loading-panel/LoadingPanel.js';
import { FormState } from '@k9-sak-web/gui/sak/totrinnskontroll/components/FormState.js';
import TotrinnskontrollSakIndexPropsTransformer from '@k9-sak-web/gui/sak/totrinnskontroll/TotrinnskontrollSakIndex.js';
import { BehandlingAppKontekst, Fagsak, NavAnsatt } from '@k9-sak-web/types';
import React, { useCallback, useState } from 'react';
import { useLocation } from 'react-router';
import { createLocationForSkjermlenke } from '../../app/paths';
import { K9sakApiKeys, restApiHooks } from '../../data/k9sakApi';
import BeslutterModalIndex from './BeslutterModalIndex';
import { useQuery } from '@tanstack/react-query';
import { BehandlingStatus } from '@k9-sak-web/backend/k9sak/kodeverk/BehandlingStatus.js';
import type { TotrinnskontrollApi } from '@k9-sak-web/gui/behandling/support/totrinnskontroll/TotrinnskontrollApi.js';
import type { Behandling } from '@k9-sak-web/gui/sak/totrinnskontroll/types/Behandling.js';

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
  api: TotrinnskontrollApi;
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
  api,
}: OwnProps) => {
  const [visBeslutterModal, setVisBeslutterModal] = useState(false);
  const [erAlleAksjonspunktGodkjent, setAlleAksjonspunktTilGodkjent] = useState(false);

  const behandling = alleBehandlinger.find(b => b.id === behandlingId);
  // TODO Er dette ok å gjere, eller finnast det situasjoner der behandling kan vere undefined uten at det skal føre til uhandtert feil?
  if (behandling == null) {
    throw new Error(`Kunne ikke finne behandling med id ${behandlingId}`);
  }

  const location = useLocation();

  const { brukernavn, kanVeilede } = restApiHooks.useGlobalStateRestApiData<NavAnsatt>(K9sakApiKeys.NAV_ANSATT);

  const totrinnsÅrsakerQuery = useQuery({
    queryKey: ['totrinnskontroll/årsaker', behandling.uuid, behandling.status.kode, api],
    queryFn: () => api.hentTotrinnskontrollSkjermlenkeContext(behandling.uuid),
    enabled: behandling.status.kode == BehandlingStatus.FATTER_VEDTAK,
    throwOnError: true,
  });

  const totrinnArsakerReadOnlyQuery = useQuery({
    queryKey: ['totrinnskontroll/årsaker/readonly', behandling.uuid, behandling.status.kode, api],
    queryFn: () => api.hentTotrinnskontrollvurderingSkjermlenkeContext(behandling.uuid),
    enabled: behandling.status.kode == BehandlingStatus.UTREDES,
    throwOnError: true,
  });

  const totrinnsKlageVurderingQuery = useQuery({
    queryKey: ['totrinnskontroll/klagevurdering', behandling.uuid, behandling.versjon],
    queryFn: () => api.hentTotrinnsKlageVurdering?.(behandling.uuid) ?? Promise.resolve(null),
    enabled: api.hentTotrinnsKlageVurdering != undefined,
    throwOnError: true,
  });

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

  if (
    (totrinnsÅrsakerQuery.isEnabled && totrinnsÅrsakerQuery.isPending) ||
    (totrinnArsakerReadOnlyQuery.isEnabled && totrinnArsakerReadOnlyQuery.isPending) ||
    (totrinnsKlageVurderingQuery.isEnabled && totrinnsKlageVurderingQuery.isPending)
  ) {
    return <LoadingPanel />;
  }
  if (totrinnsÅrsakerQuery.data == null && totrinnArsakerReadOnlyQuery.data == null) {
    return null;
  }

  return (
    <>
      <TotrinnskontrollSakIndexPropsTransformer
        behandling={behandling as unknown as Behandling} // TODO Usikker cast her fordi propstransformer konverterer kodeverk objekt til string uten typesikkerhet
        totrinnskontrollSkjermlenkeContext={totrinnsÅrsakerQuery.data ?? totrinnArsakerReadOnlyQuery.data ?? []}
        location={location}
        readOnly={brukernavn === behandling.ansvarligSaksbehandler || kanVeilede}
        onSubmit={onSubmit}
        behandlingKlageVurdering={totrinnsKlageVurderingQuery.data ?? undefined}
        createLocationForSkjermlenke={createLocationForSkjermlenke}
        toTrinnFormState={toTrinnFormState}
        setToTrinnFormState={setToTrinnFormState}
      />
      {visBeslutterModal && (
        <BeslutterModalIndex
          behandling={behandling}
          fagsakYtelseType={fagsak.sakstype}
          allAksjonspunktApproved={erAlleAksjonspunktGodkjent}
          erKlageWithKA={totrinnsKlageVurderingQuery.data?.klageVurderingResultatNK != null}
        />
      )}
    </>
  );
};

export default TotrinnskontrollIndex;
