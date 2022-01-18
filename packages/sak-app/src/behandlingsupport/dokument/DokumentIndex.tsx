import React, { useMemo } from 'react';

import { LoadingPanel, requireProps, usePrevious } from '@fpsak-frontend/shared-components';
import DokumenterSakIndex from '@fpsak-frontend/sak-dokumenter';
import { Dokument, Personopplysninger } from '@k9-sak-web/types';
import { RestApiState } from '@k9-sak-web/rest-api-hooks';

import useBehandlingEndret from '../../behandling/useBehandlingEndret';
import { K9sakApiKeys, restApiHooks } from '../../data/k9sakApi';

// TODO (hb) lag linker, ikke callback
// TODO (hb) Kan implementeres med spesialisert selector som genererer hrefs til bruk i mapStateToProps
const selectDocument =
  (saksNr: number) =>
  (_e, _id, document: Dokument): void => {
    window.open(
      `/k9/sak/api/dokument/hent-dokument?saksnummer=${saksNr}&journalpostId=${document.journalpostId}&dokumentId=${document.dokumentId}`,
      '_blank',
    );
  };

const sorterDokumenter = (dok1: Dokument, dok2: Dokument): number => {
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
  personopplysninger?: Personopplysninger;
}

const EMPTY_ARRAY = [];

/**
 * DokumentIndex
 *
 * Container komponent. Har ansvar for å hente sakens dokumenter fra state og rendre det i en liste.
 */
export const DokumentIndex = ({ behandlingId, behandlingVersjon, personopplysninger, saksnummer }: OwnProps) => {
  const forrigeSaksnummer = usePrevious(saksnummer);
  const erBehandlingEndretFraUndefined = useBehandlingEndret(behandlingId, behandlingVersjon);
  const { data: alleDokumenter = EMPTY_ARRAY, state } = restApiHooks.useRestApi<Dokument[]>(
    K9sakApiKeys.ALL_DOCUMENTS,
    { saksnummer },
    {
      updateTriggers: [behandlingId, behandlingVersjon],
      suspendRequest: forrigeSaksnummer && erBehandlingEndretFraUndefined,
      keepData: true,
    },
  );

  const sorterteDokumenter = useMemo(() => alleDokumenter.sort(sorterDokumenter), [alleDokumenter]);

  if (state === RestApiState.LOADING) {
    return <LoadingPanel />;
  }

  return (
    <DokumenterSakIndex
      documents={sorterteDokumenter}
      selectDocumentCallback={selectDocument(saksnummer)}
      behandlingId={behandlingId}
      personopplysninger={personopplysninger}
    />
  );
};

export default requireProps(['saksnummer'], <LoadingPanel />)(DokumentIndex);
