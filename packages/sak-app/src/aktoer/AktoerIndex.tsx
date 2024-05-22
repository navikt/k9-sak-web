import React from 'react';

import { Aktor, KodeverkMedNavn } from '@k9-sak-web/types';
import { LoadingPanel } from '@fpsak-frontend/shared-components';
import { RestApiState } from '@k9-sak-web/rest-api-hooks';
import AktorSakIndex from '@k9-sak-web/sak-aktor';

import useTrackRouteParam from '../app/useTrackRouteParam';
import { restApiHooks, K9sakApiKeys } from '../data/k9sakApi';
import { pathToFagsak } from '../app/paths';
import { KodeverkProvider } from '@k9-sak-web/gui/kodeverk/index.js';

/**
 * AktoerIndex
 */
const AktoerIndex = () => {
  const { selected: selectedAktoerId } = useTrackRouteParam<string>({
    paramName: 'aktoerId',
    parse: aktoerIdFromUrl => Number.parseInt(aktoerIdFromUrl, 10),
  });

  const alleKodeverk = restApiHooks.useGlobalStateRestApiData<{ [key: string]: [KodeverkMedNavn] }>(
    K9sakApiKeys.KODEVERK,
  );

  const { data, state } = restApiHooks.useRestApi<Aktor>(
    K9sakApiKeys.AKTOER_INFO,
    { aktoerId: selectedAktoerId },
    { keepData: true, suspendRequest: !selectedAktoerId, updateTriggers: [selectedAktoerId] },
  );

  if (state === RestApiState.NOT_STARTED || state === RestApiState.LOADING) {
    return <LoadingPanel />;
  }

  return (
    <KodeverkProvider behandlingType={undefined} kodeverk={alleKodeverk}>
      <AktorSakIndex valgtAktorId={selectedAktoerId} aktorInfo={data} finnPathToFagsak={pathToFagsak} />
    </KodeverkProvider>
  );
};

export default AktoerIndex;
