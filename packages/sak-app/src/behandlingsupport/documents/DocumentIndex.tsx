import React, { FunctionComponent, useMemo } from 'react';

import { LoadingPanel, requireProps, usePrevious } from '@fpsak-frontend/shared-components';
import DokumenterSakIndex from '@fpsak-frontend/sak-dokumenter';
import { Dokument } from '@k9-sak-web/types';
import { RestApiState } from '@fpsak-frontend/rest-api-hooks';

import useBehandlingEndret from '../../behandling/useBehandligEndret';
import { FpsakApiKeys, restApiHooks } from '../../data/fpsakApi';

// TODO (hb) lag linker, ikke callback
// TODO (hb) Kan implementeres med spesialisert selector som genererer hrefs til bruk i mapStateToProps
const selectDocument = saksNr => (e, id, document) => {
  window.open(
    `/fpsak/api/dokument/hent-dokument?saksnummer=${saksNr}&journalpostId=${document.journalpostId}&dokumentId=${document.dokumentId}`,
    '_blank',
  );
};

const hentSorterteDokumenter = (alleDokumenter: Dokument[] = []) =>
  alleDokumenter.sort((a, b) => {
    if (!a.tidspunkt) {
      return +1;
    }

    if (!b.tidspunkt) {
      return -1;
    }
    return b.tidspunkt.localeCompare(a.tidspunkt);
  });

interface OwnProps {
  saksnummer: string;
  behandlingId?: number;
  behandlingVersjon?: number;
}

/**
 * DocumentIndex
 *
 * Container komponent. Har ansvar for å hente sakens dokumenter fra state og rendre det i en liste.
 */
export const DocumentIndex: FunctionComponent<OwnProps> = ({ behandlingId, behandlingVersjon, saksnummer }) => {
  const forrigeSaksnummer = usePrevious(saksnummer);
  const erBehandlingEndretFraUndefined = useBehandlingEndret(behandlingId, behandlingVersjon);
  const { data: alleDokumenter, state } = restApiHooks.useRestApi<Dokument[]>(
    FpsakApiKeys.ALL_DOCUMENTS,
    { saksnummer },
    {
      updateTriggers: [behandlingId, behandlingVersjon],
      suspendRequest: forrigeSaksnummer && erBehandlingEndretFraUndefined,
      keepData: true,
    },
  );

  const sorterteDokumenter = useMemo(() => hentSorterteDokumenter(alleDokumenter), [alleDokumenter]);

  if (state === RestApiState.LOADING) {
    return <LoadingPanel />;
  }

  return (
    <DokumenterSakIndex
      documents={sorterteDokumenter}
      selectDocumentCallback={selectDocument(saksnummer)}
      behandlingId={behandlingId}
    />
  );
};

export default requireProps(['saksnummer'], <LoadingPanel />)(DocumentIndex);
