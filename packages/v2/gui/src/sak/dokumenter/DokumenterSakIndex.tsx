import DocumentList from './components/DocumentList';
import type { Document } from './types/Document';
import type { Fagsak } from './types/Fagsak';

interface OwnProps {
  documents: Document[];
  behandlingId?: number;
  fagsak: Fagsak;
  saksnummer: number;
  behandlingUuid: string;
}

const DokumenterSakIndex = ({ documents, behandlingId, fagsak, saksnummer, behandlingUuid }: OwnProps) => (
  <DocumentList
    documents={documents}
    behandlingId={behandlingId}
    fagsakPerson={fagsak.person}
    saksnummer={saksnummer}
    behandlingUuid={behandlingUuid}
    sakstype={fagsak?.sakstype}
  />
);

export default DokumenterSakIndex;
