import { RestApiState } from '@k9-sak-web/rest-api-hooks';
import { useMemo } from 'react';
import ApplicationContextPath from '../app/ApplicationContextPath';
import useGetEnabledApplikasjonContext from '../app/useGetEnabledApplikasjonContext';
import useBehandlingEndret from '../behandling/useBehandlingEndret';
import { K9sakApiKeys, restApiHooks } from '../data/k9sakApi';
import type SakRettigheter from './sakRettigheterTsType';

const useHentFagsakRettigheter = (
  saksnummer: string,
  behandlingId: number,
  behandlingVersjon: number,
): [rettigheter: SakRettigheter, harHentet: boolean] => {
  const erBehandlingEndretFraUndefined = useBehandlingEndret(behandlingId, behandlingVersjon);
  const enabledApplicationContexts = useGetEnabledApplikasjonContext();
  const skalHenteFraTilbake = enabledApplicationContexts.includes(ApplicationContextPath.TILBAKE);
  const skalHenteFraKlage = enabledApplicationContexts.includes(ApplicationContextPath.KLAGE);

  const { data: sakRettigheterK9Sak, state: sakRettigheterStateK9Sak } = restApiHooks.useRestApi<SakRettigheter>(
    K9sakApiKeys.SAK_RETTIGHETER,
    { saksnummer },
    {
      updateTriggers: [saksnummer, behandlingId, behandlingVersjon],
      suspendRequest: !saksnummer || erBehandlingEndretFraUndefined,
      keepData: true,
    },
  );

  const { data: sakRettigheterTilbake, state: sakRettigheterStateTilbake } = restApiHooks.useRestApi<SakRettigheter>(
    K9sakApiKeys.SAK_RETTIGHETER_TILBAKE,
    { saksnummer },
    {
      updateTriggers: [saksnummer, behandlingId, behandlingVersjon],
      suspendRequest: !skalHenteFraTilbake || !saksnummer || erBehandlingEndretFraUndefined,
      keepData: true,
    },
  );

  const { data: sakRettigheterKlage, state: sakRettigheterStateKlage } = restApiHooks.useRestApi<SakRettigheter>(
    K9sakApiKeys.SAK_RETTIGHETER_KLAGE,
    { saksnummer },
    {
      updateTriggers: [saksnummer, behandlingId, behandlingVersjon],
      suspendRequest: !skalHenteFraKlage || !saksnummer || erBehandlingEndretFraUndefined,
      keepData: true,
    },
  );

  const harHentetK9Sak =
    !!sakRettigheterK9Sak ||
    (sakRettigheterStateK9Sak !== RestApiState.NOT_STARTED && sakRettigheterStateK9Sak !== RestApiState.LOADING);
  const harHentetTilbake =
    !skalHenteFraTilbake ||
    !!sakRettigheterTilbake ||
    (sakRettigheterStateTilbake !== RestApiState.NOT_STARTED && sakRettigheterStateTilbake !== RestApiState.LOADING);
  const harHentetKlage =
    !skalHenteFraKlage ||
    !!sakRettigheterKlage ||
    (sakRettigheterStateKlage !== RestApiState.NOT_STARTED && sakRettigheterStateKlage !== RestApiState.LOADING);

  const sakRettigheter = useMemo(() => {
    if (sakRettigheterK9Sak && (sakRettigheterTilbake || sakRettigheterKlage)) {
      return {
        sakSkalTilInfotrygd: sakRettigheterK9Sak.sakSkalTilInfotrygd,
        behandlingTypeKanOpprettes: sakRettigheterK9Sak.behandlingTypeKanOpprettes
          .concat(sakRettigheterTilbake?.behandlingTypeKanOpprettes || [])
          .concat(sakRettigheterKlage?.behandlingTypeKanOpprettes || []),
      };
    }
    return sakRettigheterK9Sak;
  }, [sakRettigheterK9Sak, sakRettigheterTilbake, sakRettigheterKlage]);

  return [sakRettigheter, harHentetK9Sak && harHentetTilbake && harHentetKlage];
};

export default useHentFagsakRettigheter;
