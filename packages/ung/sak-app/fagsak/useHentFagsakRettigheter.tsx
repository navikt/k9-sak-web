import { RestApiState } from '@k9-sak-web/rest-api-hooks';
import { useMemo } from 'react';

import ApplicationContextPath from '@k9-sak-web/sak-app/src/app/ApplicationContextPath';
import useBehandlingEndret from '@k9-sak-web/sak-app/src/behandling/useBehandlingEndret';
import SakRettigheter from '@k9-sak-web/sak-app/src/fagsak/sakRettigheterTsType';
import useGetEnabledApplikasjonContext from '../app/useGetEnabledApplikasjonContext';
import { UngSakApiKeys, restApiHooks } from '../data/ungsakApi';

const useHentFagsakRettigheter = (
  saksnummer: string,
  behandlingId: number,
  behandlingVersjon: number,
): [rettigheter: SakRettigheter, harHentet: boolean] => {
  const erBehandlingEndretFraUndefined = useBehandlingEndret(behandlingId, behandlingVersjon);
  const enabledApplicationContexts = useGetEnabledApplikasjonContext();
  const skalHenteFraTilbake = enabledApplicationContexts.includes(ApplicationContextPath.TILBAKE);
  const { data: sakRettigheterUngSak, state: sakRettigheterStateUngSak } = restApiHooks.useRestApi<SakRettigheter>(
    UngSakApiKeys.SAK_RETTIGHETER,
    { saksnummer },
    {
      updateTriggers: [saksnummer, behandlingId, behandlingVersjon],
      suspendRequest: !saksnummer || erBehandlingEndretFraUndefined,
      keepData: true,
    },
  );

  const { data: sakRettigheterTilbake, state: sakRettigheterStateTilbake } = restApiHooks.useRestApi<SakRettigheter>(
    UngSakApiKeys.SAK_RETTIGHETER_TILBAKE,
    { saksnummer },
    {
      updateTriggers: [saksnummer, behandlingId, behandlingVersjon],
      suspendRequest: !skalHenteFraTilbake || !saksnummer || erBehandlingEndretFraUndefined,
      keepData: true,
    },
  );

  const harHentetUngSak =
    !!sakRettigheterUngSak ||
    (sakRettigheterStateUngSak !== RestApiState.NOT_STARTED && sakRettigheterStateUngSak !== RestApiState.LOADING);
  const harHentetTilbake =
    !skalHenteFraTilbake ||
    !!sakRettigheterTilbake ||
    (sakRettigheterStateTilbake !== RestApiState.NOT_STARTED && sakRettigheterStateTilbake !== RestApiState.LOADING);

  const sakRettigheter = useMemo(() => {
    if (sakRettigheterUngSak && sakRettigheterTilbake) {
      return {
        sakSkalTilInfotrygd: sakRettigheterUngSak.sakSkalTilInfotrygd,
        behandlingTypeKanOpprettes: sakRettigheterUngSak.behandlingTypeKanOpprettes.concat(
          sakRettigheterTilbake?.behandlingTypeKanOpprettes || [],
        ),
      };
    }
    return sakRettigheterUngSak;
  }, [sakRettigheterUngSak, sakRettigheterTilbake]);

  return [sakRettigheter, harHentetUngSak && harHentetTilbake];
};

export default useHentFagsakRettigheter;
