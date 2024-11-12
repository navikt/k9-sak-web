import type { SakRettigheterDto } from '@k9-sak-web/backend/ungsak/generated';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import type UngSakBackendClient from '../UngSakBackendClient';
import useBehandlingEndret from '../useBehandlingEndret';

// import useGetEnabledApplikasjonContext from '../app/useGetEnabledApplikasjonContext';
// import ApplicationContextPath from '../app/ApplicationContextPath';
// import useBehandlingEndret from '../behandling/useBehandlingEndret';
// import { K9sakApiKeys, restApiHooks } from '../data/k9sakApi';
// import SakRettigheter from './sakRettigheterTsType';

const useHentFagsakRettigheter = (
  saksnummer: string,
  behandlingId: number,
  behandlingVersjon: number,
  ungSakBackendClient: UngSakBackendClient,
): [rettigheter?: SakRettigheterDto, harHentet?: boolean] => {
  const erBehandlingEndretFraUndefined = useBehandlingEndret(behandlingId, behandlingVersjon);

  const { data: sakRettigheterK9Sak, isFetched: sakRettigheterK9SakIsFinished } = useQuery({
    queryKey: ['sak-rettigheter', saksnummer, behandlingId, behandlingVersjon],
    queryFn: () => ungSakBackendClient.getSakRettigheterUngSak(saksnummer),
    enabled: !!saksnummer && !erBehandlingEndretFraUndefined,
    // TODO: keepData: true,
  });

  const harHentetUngSak = !!sakRettigheterK9Sak || sakRettigheterK9SakIsFinished;

  const sakRettigheter = useMemo(() => {
    if (sakRettigheterK9Sak) {
      return {
        sakSkalTilInfotrygd: sakRettigheterK9Sak.sakSkalTilInfotrygd,
        behandlingTypeKanOpprettes: sakRettigheterK9Sak.behandlingTypeKanOpprettes,
      };
    }
    return sakRettigheterK9Sak;
  }, [sakRettigheterK9Sak]);

  return [sakRettigheter, harHentetUngSak];
};

export default useHentFagsakRettigheter;
