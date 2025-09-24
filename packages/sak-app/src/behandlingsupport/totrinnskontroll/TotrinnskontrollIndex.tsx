import { LoadingPanel } from '@k9-sak-web/gui/shared/loading-panel/LoadingPanel.js';
import { FormState } from '@k9-sak-web/gui/sak/totrinnskontroll/components/FormState.js';
import TotrinnskontrollSakIndex from '@k9-sak-web/gui/sak/totrinnskontroll/TotrinnskontrollSakIndex.js';
import { BehandlingAppKontekst, Fagsak, NavAnsatt } from '@k9-sak-web/types';
import React, { useCallback, useMemo, useState } from 'react';
import { K9sakApiKeys, restApiHooks } from '../../data/k9sakApi';
import BeslutterModalIndex from './BeslutterModalIndex';
import { useQuery } from '@tanstack/react-query';
import { BehandlingStatus } from '@k9-sak-web/backend/k9sak/kodeverk/BehandlingStatus.js';
import type { TotrinnskontrollApi } from '@k9-sak-web/gui/behandling/support/totrinnskontroll/TotrinnskontrollApi.js';
import type { TotrinnskontrollBehandling } from '@k9-sak-web/gui/sak/totrinnskontroll/types/TotrinnskontrollBehandling.js';
import {
  BehandlingResultatType,
  isBehandlingResultatType,
} from '@k9-sak-web/backend/combined/kodeverk/behandling/BehandlingResultatType.js';
import { ensureKodeVerdiString } from '@k9-sak-web/gui/utils/typehelp/ensureKodeverdiString.js';

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
  if (behandling == null) {
    throw new Error(`Kunne ikke finne behandling med id ${behandlingId}`);
  }

  // Map legacy BehandlingDto til TotrinnskontrollBehandling type som v2 komponenter forventer.
  // Dette kan fjernast i framtida viss vi får v2 BehandlingDto inn her.
  // useMemo for å unngå re-rendering viss ikkje behandling er endra.
  const totrinnskontrollBehandling: TotrinnskontrollBehandling = useMemo(
    () => ({
      id: behandling.id,
      versjon: behandling.versjon,
      type: behandling.type.kode,
      status: behandling.status.kode as BehandlingStatus,
      toTrinnsBehandling: behandling.toTrinnsBehandling,
      behandlingsresultatType:
        behandling.behandlingsresultat != null && isBehandlingResultatType(behandling.behandlingsresultat.type.kode)
          ? behandling.behandlingsresultat.type.kode
          : BehandlingResultatType.IKKE_FASTSATT,
    }),
    [behandling],
  );

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

  const totrinnskontrollData = totrinnsÅrsakerQuery.data ?? totrinnArsakerReadOnlyQuery.data;
  if (totrinnskontrollData != null) {
    return (
      <>
        <TotrinnskontrollSakIndex
          behandling={totrinnskontrollBehandling}
          totrinnskontrollData={totrinnskontrollData}
          readOnly={brukernavn === behandling.ansvarligSaksbehandler || kanVeilede}
          onSubmit={onSubmit}
          behandlingKlageVurdering={totrinnsKlageVurderingQuery.data ?? undefined}
          toTrinnFormState={toTrinnFormState}
          setToTrinnFormState={setToTrinnFormState}
        />
        {visBeslutterModal && (
          <BeslutterModalIndex
            behandling={totrinnskontrollBehandling}
            fagsakYtelseType={ensureKodeVerdiString(fagsak.sakstype)}
            allAksjonspunktApproved={erAlleAksjonspunktGodkjent}
            erKlageWithKA={totrinnsKlageVurderingQuery.data?.klageVurderingResultatNK != null}
          />
        )}
      </>
    );
  } else {
    return null;
  }
};

export default TotrinnskontrollIndex;
