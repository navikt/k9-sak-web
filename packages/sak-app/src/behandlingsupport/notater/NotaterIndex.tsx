import { LoadingPanel, requireProps } from '@fpsak-frontend/shared-components';
import Notater from '@k9-sak-web/sak-notat';
import { FagsakPerson, NavAnsatt } from '@k9-sak-web/types';
import React from 'react';

interface OwnProps {
  saksnummer: string;
  behandlingId?: number;
  behandlingVersjon?: number;
  fagsakPerson?: FagsakPerson;
  navAnsatt: NavAnsatt;
}

const EMPTY_ARRAY = [];

/**
 * NotaterIndex
 *
 * Container komponent. Har ansvar for å vise notater i saken.
 */
export const NotaterIndex = ({ behandlingId, behandlingVersjon, fagsakPerson, saksnummer, navAnsatt }: OwnProps) => (
  // const forrigeSaksnummer = usePrevious(saksnummer);
  // const erBehandlingEndretFraUndefined = useBehandlingEndret(behandlingId, behandlingVersjon);
  // const { data: alleDokumenter = EMPTY_ARRAY, state } = restApiHooks.useRestApi<Dokument[]>(
  //   K9sakApiKeys.ALL_DOCUMENTS,
  //   { saksnummer },
  //   {
  //     updateTriggers: [behandlingId, behandlingVersjon],
  //     suspendRequest: forrigeSaksnummer && erBehandlingEndretFraUndefined,
  //     keepData: true,
  //   },
  // );

  // if (state === RestApiState.LOADING) {
  //   return <LoadingPanel />;
  // }

  <Notater fagsakId={saksnummer} navAnsatt={navAnsatt} />
);

export default requireProps(['saksnummer'], <LoadingPanel />)(NotaterIndex);
