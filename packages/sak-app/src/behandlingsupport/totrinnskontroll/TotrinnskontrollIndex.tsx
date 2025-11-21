import { LoadingPanel } from '@k9-sak-web/gui/shared/loading-panel/LoadingPanel.js';
import { TotrinnskontrollSakIndex } from '@k9-sak-web/gui/sak/totrinnskontroll/TotrinnskontrollSakIndex.js';
import { BehandlingAppKontekst, Fagsak } from '@k9-sak-web/types';
import React, { use, useMemo, useState } from 'react';
import { BeslutterModalIndex } from '@k9-sak-web/gui/sak/totrinnskontroll/BeslutterModalIndex.js';
import { useQuery } from '@tanstack/react-query';
import { BehandlingStatus } from '@k9-sak-web/backend/combined/kodeverk/behandling/BehandlingStatus.js';
import type { TotrinnskontrollApi } from '@k9-sak-web/gui/behandling/support/totrinnskontroll/TotrinnskontrollApi.js';
import type { TotrinnskontrollBehandling } from '@k9-sak-web/gui/sak/totrinnskontroll/types/TotrinnskontrollBehandling.js';
import {
  BehandlingResultatType,
  isBehandlingResultatType,
} from '@k9-sak-web/backend/combined/kodeverk/behandling/BehandlingResultatType.js';
import { ensureKodeVerdiString } from '@k9-sak-web/gui/utils/typehelp/ensureKodeverdiString.js';
import { InnloggetAnsattContext } from '@k9-sak-web/gui/saksbehandler/InnloggetAnsattContext.js';

interface OwnProps {
  fagsak: Fagsak;
  alleBehandlinger: BehandlingAppKontekst[];
  behandlingId: number;
  api: TotrinnskontrollApi;
  urlEtterpå: string;
}

/**
 * TotrinnskontrollIndex
 *
 * Containerklass ansvarlig for att rita opp vilkår og aksjonspunkter med toTrinnskontroll
 */
const TotrinnskontrollIndex = ({ fagsak, alleBehandlinger, behandlingId, api, urlEtterpå }: OwnProps) => {
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
      uuid: behandling.uuid,
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

  const { brukernavn, kanVeilede = false } = use(InnloggetAnsattContext);

  const totrinnsÅrsakerQuery = useQuery({
    queryKey: ['totrinnskontroll', 'årsaker', behandling.uuid, behandling.status.kode, api],
    queryFn: () => api.hentTotrinnskontrollSkjermlenkeContext(behandling.uuid),
    enabled: behandling.status.kode == BehandlingStatus.FATTER_VEDTAK,
    throwOnError: true,
  });

  const totrinnArsakerReadOnlyQuery = useQuery({
    queryKey: ['totrinnskontroll', 'årsaker', 'readonly', behandling.uuid, behandling.status.kode, api],
    queryFn: () => api.hentTotrinnskontrollvurderingSkjermlenkeContext(behandling.uuid),
    enabled: behandling.status.kode == BehandlingStatus.UTREDES,
    throwOnError: true,
  });

  const totrinnsKlageVurderingQuery = useQuery({
    queryKey: ['totrinnskontroll', 'klagevurdering', behandling.uuid, behandling.versjon],
    queryFn: () => api.hentTotrinnsKlageVurdering?.(behandling.uuid) ?? Promise.resolve(null),
    enabled: api.hentTotrinnsKlageVurdering != undefined,
    throwOnError: true,
  });

  const onBekreftet = (alleGodkjent: boolean) => {
    setAlleAksjonspunktTilGodkjent(alleGodkjent);
    setVisBeslutterModal(true);
  };

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
          behandlingKlageVurdering={totrinnsKlageVurderingQuery.data ?? undefined}
          onBekreftet={onBekreftet}
          api={api}
        />
        {visBeslutterModal && (
          <BeslutterModalIndex
            behandling={totrinnskontrollBehandling}
            fagsakYtelseType={ensureKodeVerdiString(fagsak.sakstype)}
            erAlleAksjonspunktGodkjent={erAlleAksjonspunktGodkjent}
            erKlageWithKA={totrinnsKlageVurderingQuery.data?.klageVurderingResultatNK != null}
            urlEtterpå={urlEtterpå}
          />
        )}
      </>
    );
  } else {
    return null;
  }
};

export default TotrinnskontrollIndex;
