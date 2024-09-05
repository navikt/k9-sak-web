import { Fagsak } from '@k9-sak-web/gui/sak/Fagsak.js';
import { DokumentDto } from '@navikt/k9-sak-typescript-client';
import DocumentList from './components/DocumentList';

interface OwnProps {
  documents: DokumentDto[];
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
    sakstype={fagsak?.sakstype?.kode}
  />
);

export default DokumenterSakIndex;
