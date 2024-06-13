import { Dokument, Fagsak } from '@k9-sak-web/types';
import React from 'react';
import { RawIntlProvider, createIntl, createIntlCache } from 'react-intl';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import messages from '../i18n/nb_NO.json';
import DocumentList from './components/DocumentList';

const cache = createIntlCache();

const intl = createIntl(
  {
    locale: 'nb-NO',
    messages,
  },
  cache,
);

const queryClient = new QueryClient();

interface OwnProps {
  documents: Dokument[];
  behandlingId?: number;
  fagsak: Fagsak;
  saksnummer: number;
  behandlingUuid: string;
}

const DokumenterSakIndex = ({ documents, behandlingId, fagsak, saksnummer, behandlingUuid }: OwnProps) => (
  <RawIntlProvider value={intl}>
    <QueryClientProvider client={queryClient}>
      <DocumentList
        documents={documents}
        behandlingId={behandlingId}
        fagsakPerson={fagsak.person}
        saksnummer={saksnummer}
        behandlingUuid={behandlingUuid}
        sakstype={fagsak?.sakstype?.kode}
      />
    </QueryClientProvider>
  </RawIntlProvider>
);

export default DokumenterSakIndex;
