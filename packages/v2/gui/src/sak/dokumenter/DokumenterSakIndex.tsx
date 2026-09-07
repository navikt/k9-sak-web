import type { DokumentDto } from '@k9-sak-web/backend/k9sak/kontrakt/dokument/DokumentDto.js';
import DocumentListContainer from './components/DocumentListContainer';
import type { Fagsak } from './types/Fagsak';

interface OwnProps {
  documents: DokumentDto[];
  behandlingId?: number;
  fagsak: Fagsak;
  saksnummer: number;
  behandlingUuid: string;
}

const DokumenterSakIndex = ({ documents, behandlingId, fagsak, saksnummer, behandlingUuid }: OwnProps) => (
  <DocumentListContainer
    documents={documents}
    behandlingId={behandlingId}
    fagsakPerson={fagsak.person}
    saksnummer={saksnummer}
    behandlingUuid={behandlingUuid}
    sakstype={fagsak?.sakstype}
  />
);

export default DokumenterSakIndex;
