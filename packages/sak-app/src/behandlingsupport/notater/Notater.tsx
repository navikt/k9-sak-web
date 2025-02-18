import { LoadingPanel } from '@fpsak-frontend/shared-components';
import NotaterIndex from '@k9-sak-web/gui/sak/notat/NotaterIndex.js';
import { useRestApiErrorDispatcher } from '@k9-sak-web/rest-api-hooks';
import ErrorBoundary from '@k9-sak-web/sak-app/src/app/ErrorBoundary';
import { Fagsak } from '@k9-sak-web/types';
import { InnloggetAnsattDto } from '@navikt/k9-sak-typescript-client';

interface OwnProps {
  navAnsatt: Pick<InnloggetAnsattDto, 'brukernavn'>;
  fagsak: Fagsak;
}

/**
 * Notater
 *
 * Container komponent. Har ansvar for å vise notater i saken.
 */
const Notater = ({ fagsak, navAnsatt }: OwnProps) => {
  const { addErrorMessage } = useRestApiErrorDispatcher();
  if (!fagsak) {
    return <LoadingPanel />;
  }
  return (
    <ErrorBoundary errorMessageCallback={addErrorMessage}>
      <NotaterIndex
        fagsakId={fagsak.saksnummer}
        navAnsatt={navAnsatt}
        fagsakHarPleietrengende={!!fagsak.pleietrengendeAktørId}
      />
    </ErrorBoundary>
  );
};
export default Notater;
