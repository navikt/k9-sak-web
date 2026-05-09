import { LoadingPanel } from '@k9-sak-web/gui/shared/loading-panel/LoadingPanel.js';
import ErrorBoundary from '@k9-sak-web/gui/app/errorhandling/boundary/ErrorBoundary.js';
import NotaterIndex from '@k9-sak-web/gui/sak/notat/NotaterIndex.js';
import { Fagsak } from '@k9-sak-web/types';
import { sif_abac_kontrakt_abac_InnloggetAnsattDto as InnloggetAnsattDto } from '@k9-sak-web/backend/k9sak/generated/types.js';
import { LocalAlertError } from '@k9-sak-web/gui/app/errorhandling/ui/LocalAlertError.js';

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
  if (!fagsak) {
    return <LoadingPanel />;
  }
  return (
    <ErrorBoundary errorFallback={({ caught }) => <LocalAlertError title="Notatskjema feilet" errorAndId={caught} />}>
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
