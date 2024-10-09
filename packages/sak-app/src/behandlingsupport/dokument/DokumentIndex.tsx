import DokumenterSakIndex from '@fpsak-frontend/sak-dokumenter';
import { LoadingPanel, requireProps, usePrevious } from '@fpsak-frontend/shared-components';
import { konverterKodeverkTilKode } from '@k9-sak-web/lib/kodeverk/konverterKodeverkTilKode.js';
import { RestApiState } from '@k9-sak-web/rest-api-hooks';
import { DokumentDto, FagsakDto } from '@navikt/k9-sak-typescript-client';
import { useMemo } from 'react';
import useBehandlingEndret from '../../behandling/useBehandlingEndret';
import { K9sakApiKeys, restApiHooks } from '../../data/k9sakApi';

const sorterDokumenter = (dok1: DokumentDto, dok2: DokumentDto): number => {
  if (!dok1.tidspunkt) {
    return +1;
  }

  if (!dok2.tidspunkt) {
    return -1;
  }
  return dok2.tidspunkt.localeCompare(dok1.tidspunkt);
};

interface OwnProps {
  saksnummer: number;
  behandlingId?: number;
  behandlingVersjon?: number;
  fagsak: FagsakDto;
  behandlingUuid: string;
}

const EMPTY_ARRAY = [];

/**
 * DokumentIndex
 *
 * Container komponent. Har ansvar for å hente sakens dokumenter fra state og rendre det i en liste.
 */
export const DokumentIndex = ({ behandlingId, behandlingVersjon, fagsak, saksnummer, behandlingUuid }: OwnProps) => {
  const forrigeSaksnummer = usePrevious(saksnummer);
  const erBehandlingEndretFraUndefined = useBehandlingEndret(behandlingId, behandlingVersjon);
  const { data: alleDokumenter = EMPTY_ARRAY, state } = restApiHooks.useRestApi<DokumentDto[]>(
    K9sakApiKeys.ALL_DOCUMENTS,
    { saksnummer },
    {
      updateTriggers: [behandlingId, behandlingVersjon],
      suspendRequest: forrigeSaksnummer && erBehandlingEndretFraUndefined,
      keepData: true,
    },
  );

  const sorterteDokumenter = useMemo(() => alleDokumenter.sort(sorterDokumenter), [alleDokumenter]);
  const kodeverkKonvertertFagsak: FagsakDto = useMemo(() => {
    const clonedFagsak = JSON.parse(JSON.stringify(fagsak));
    konverterKodeverkTilKode(clonedFagsak, false);
    return clonedFagsak;
  }, [fagsak]);

  if (state === RestApiState.LOADING) {
    return <LoadingPanel />;
  }

  return (
    <DokumenterSakIndex
      documents={sorterteDokumenter}
      behandlingId={behandlingId}
      fagsak={kodeverkKonvertertFagsak}
      saksnummer={saksnummer}
      behandlingUuid={behandlingUuid}
    />
  );
};

export default requireProps(['saksnummer'], <LoadingPanel />)(DokumentIndex);
