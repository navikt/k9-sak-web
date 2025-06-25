import { LoadingPanel } from '@fpsak-frontend/shared-components';
import { RestApiState } from '@k9-sak-web/rest-api-hooks';
import { KodeverkMedNavn } from '@k9-sak-web/types';

import { KodeverkProvider } from '@k9-sak-web/gui/kodeverk/index.js';
import AktorSakIndex from '@k9-sak-web/gui/sak/aktør/AktorSakIndex.js';
import { Aktørinfo } from '@k9-sak-web/gui/sak/aktør/Aktørinfo.js';
import useTrackRouteParam from '../app/useTrackRouteParam';
import { K9sakApiKeys, restApiHooks } from '../data/k9sakApi';

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

  const { data, state } = restApiHooks.useRestApi<Aktørinfo>(
    K9sakApiKeys.AKTOER_INFO,
    { aktoerId: selectedAktoerId },
    { keepData: true, suspendRequest: !selectedAktoerId, updateTriggers: [selectedAktoerId] },
  );

  if (state === RestApiState.NOT_STARTED || state === RestApiState.LOADING) {
    return <LoadingPanel />;
  }

  return (
    <KodeverkProvider behandlingType={undefined} kodeverk={alleKodeverk}>
      <AktorSakIndex valgtAktorId={selectedAktoerId} aktorInfo={data} />
    </KodeverkProvider>
  );
};

export default AktoerIndex;
