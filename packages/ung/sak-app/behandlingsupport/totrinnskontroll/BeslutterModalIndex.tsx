import { useCallback } from 'react';

import { LoadingPanel } from '@k9-sak-web/gui/shared/loading-panel/LoadingPanel.js';
import { FagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import { RestApiState } from '@k9-sak-web/rest-api-hooks';

import FatterVedtakTotrinnskontrollModalSakIndex from '@k9-sak-web/gui/sak/totrinnskontroll/FatterVedtakTotrinnskontrollModalSakIndex.js';
import { getPathToK9Los } from '../../app/paths';
import { UngSakApiKeys, requestApi, restApiHooks } from '../../data/ungsakApi';
import type { TotrinnskontrollBehandling } from '@k9-sak-web/gui/sak/totrinnskontroll/types/TotrinnskontrollBehandling.js';

interface OwnProps {
  behandling: TotrinnskontrollBehandling;
  fagsakYtelseType: FagsakYtelsesType;
  allAksjonspunktApproved: boolean;
  erKlageWithKA: boolean;
}

const BeslutterModalIndex = ({ behandling, fagsakYtelseType, allAksjonspunktApproved, erKlageWithKA }: OwnProps) => {
  const { data, state } = restApiHooks.useRestApi<{ harRevurderingSammeResultat: boolean }>(
    UngSakApiKeys.HAR_REVURDERING_SAMME_RESULTAT,
    undefined,
    {
      updateTriggers: [behandling.id, behandling.versjon],
      suspendRequest: !requestApi.hasPath(UngSakApiKeys.HAR_REVURDERING_SAMME_RESULTAT),
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
