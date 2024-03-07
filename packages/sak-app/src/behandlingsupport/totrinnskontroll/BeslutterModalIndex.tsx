import React, { useCallback } from 'react';

import { RestApiState } from '@k9-sak-web/rest-api-hooks';
import { BehandlingAppKontekst } from '@k9-sak-web/types';
import { LoadingPanel } from '@fpsak-frontend/shared-components';
import { FatterVedtakTotrinnskontrollModalSakIndex } from '@fpsak-frontend/sak-totrinnskontroll';

import { K9sakApiKeys, restApiHooks, requestApi } from '../../data/k9sakApi';
import { getPathToFplos } from '../../app/paths';

interface OwnProps {
  behandling: BehandlingAppKontekst;
  fagsakYtelseType: string;
  allAksjonspunktApproved: boolean;
  erKlageWithKA: boolean;
}

const BeslutterModalIndex = ({ behandling, fagsakYtelseType, allAksjonspunktApproved, erKlageWithKA }: OwnProps) => {
  const { data, state } = restApiHooks.useRestApi<{ harRevurderingSammeResultat: boolean }>(
    K9sakApiKeys.HAR_REVURDERING_SAMME_RESULTAT,
    undefined,
    {
      updateTriggers: [behandling.id, behandling.versjon],
      suspendRequest: !requestApi.hasPath(K9sakApiKeys.HAR_REVURDERING_SAMME_RESULTAT),
      keepData: true,
    },
  );

  const goToSearchPage = useCallback(() => {
    window.location.assign(getPathToFplos() || '/');
  }, []);

  if (state === RestApiState.LOADING) {
    return <LoadingPanel />;
  }

  return (
    <FatterVedtakTotrinnskontrollModalSakIndex
      behandling={behandling}
      closeEvent={goToSearchPage}
      allAksjonspunktApproved={allAksjonspunktApproved}
      fagsakYtelseType={fagsakYtelseType}
      erKlageWithKA={erKlageWithKA}
      harSammeResultatSomOriginalBehandling={data?.harRevurderingSammeResultat}
    />
  );
};

export default BeslutterModalIndex;
