import { LoadingPanel, requireProps } from '@fpsak-frontend/shared-components';
import Notater from '@k9-sak-web/sak-notat';
import { Fagsak, NavAnsatt } from '@k9-sak-web/types';
import React from 'react';
import ErrorBoundary from '@k9-sak-web/sak-app/src/app/ErrorBoundary';
import { useRestApiErrorDispatcher } from '@k9-sak-web/rest-api-hooks';

interface OwnProps {
  navAnsatt: NavAnsatt;
  fagsak: Fagsak;
}

/**
 * NotaterIndex
 *
 * Container komponent. Har ansvar for å vise notater i saken.
 */
export const NotaterIndex = ({ fagsak, navAnsatt }: OwnProps) => {
  const { addErrorMessage } = useRestApiErrorDispatcher();

  return (
    <ErrorBoundary errorMessageCallback={addErrorMessage}>
      <Notater
        fagsakId={fagsak.saksnummer}
        navAnsatt={navAnsatt}
        fagsakHarPleietrengende={!!fagsak.pleietrengendeAktørId}
      />
    </ErrorBoundary>
  );
};
export default requireProps(['fagsak'], <LoadingPanel />)(NotaterIndex);
