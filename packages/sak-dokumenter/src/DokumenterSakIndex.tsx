import { Dokument, FagsakPerson } from '@k9-sak-web/types';
import React from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';
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

interface OwnProps {
  documents: Dokument[];
  selectDocumentCallback: (e: React.SyntheticEvent, id: number, dokument: Dokument) => void;
  behandlingId?: number;
  fagsakPerson?: FagsakPerson;
}

const DokumenterSakIndex = ({ documents, selectDocumentCallback, behandlingId, fagsakPerson }: OwnProps) => (
  <RawIntlProvider value={intl}>
    <DocumentList
      documents={documents}
      selectDocumentCallback={selectDocumentCallback}
      behandlingId={behandlingId}
      fagsakPerson={fagsakPerson}
    />
  </RawIntlProvider>
);

export default DokumenterSakIndex;
