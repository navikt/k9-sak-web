import React, { useCallback } from 'react';

import { RestApiState } from '@k9-sak-web/rest-api-hooks';
import { FatterVedtakTotrinnskontrollModalSakIndex } from '@k9-sak-web/sak-totrinnskontroll';
import { LoadingPanel } from '@k9-sak-web/shared-components';
import { BehandlingAppKontekst, Kodeverk } from '@k9-sak-web/types';

import { getPathToK9Los } from '../../app/paths';
import { K9sakApiKeys, requestApi, restApiHooks } from '../../data/k9sakApi';

interface OwnProps {
  behandling: BehandlingAppKontekst;
  fagsakYtelseType: Kodeverk;
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
    window.location.assign(getPathToK9Los() || '/');
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
