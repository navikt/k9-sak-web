import { RestApiState } from '@k9-sak-web/rest-api-hooks';
import { useMemo } from 'react';

import useBehandlingEndret from '@k9-sak-web/sak-app/src/behandling/useBehandlingEndret';
import SakRettigheter from '@k9-sak-web/sak-app/src/fagsak/sakRettigheterTsType';
import { UngSakApiKeys, restApiHooks } from '../data/ungsakApi';

const useHentFagsakRettigheter = (
  saksnummer: string,
  behandlingId: number,
  behandlingVersjon: number,
): [rettigheter: SakRettigheter, harHentet: boolean] => {
  const erBehandlingEndretFraUndefined = useBehandlingEndret(behandlingId, behandlingVersjon);

  const { data: sakRettigheterK9Sak, state: sakRettigheterStateK9Sak } = restApiHooks.useRestApi<SakRettigheter>(
    UngSakApiKeys.SAK_RETTIGHETER,
    { saksnummer },
    {
      updateTriggers: [saksnummer, behandlingId, behandlingVersjon],
      suspendRequest: !saksnummer || erBehandlingEndretFraUndefined,
      keepData: true,
    },
  );

  const harHentetK9Sak =
    !!sakRettigheterK9Sak ||
    (sakRettigheterStateK9Sak !== RestApiState.NOT_STARTED && sakRettigheterStateK9Sak !== RestApiState.LOADING);

  const sakRettigheter = useMemo(() => {
    if (sakRettigheterK9Sak) {
      return {
        sakSkalTilInfotrygd: sakRettigheterK9Sak.sakSkalTilInfotrygd,
        behandlingTypeKanOpprettes: sakRettigheterK9Sak.behandlingTypeKanOpprettes,
      };
    }
    return sakRettigheterK9Sak;
  }, [sakRettigheterK9Sak]);

  return [sakRettigheter, harHentetK9Sak];
};

export default useHentFagsakRettigheter;
