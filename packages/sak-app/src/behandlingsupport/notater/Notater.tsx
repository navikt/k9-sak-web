import type { sif_abac_kontrakt_abac_InnloggetAnsattDto as InnloggetAnsattDto } from '@k9-sak-web/backend/k9sak/generated/types.js';
import ErrorBoundary from '@k9-sak-web/gui/app/feilmeldinger/ErrorBoundary.js';
import NotaterIndex from '@k9-sak-web/gui/sak/notat/NotaterIndex.js';
import { LoadingPanel } from '@k9-sak-web/gui/shared/loading-panel/LoadingPanel.js';
import { useRestApiErrorDispatcher } from '@k9-sak-web/rest-api-hooks';
import type { Fagsak } from '@k9-sak-web/types';

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
        sakstype={fagsak.sakstype}
      />
    </ErrorBoundary>
  );
};
export default Notater;
