import React from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import { Dokument } from '@k9-sak-web/types';

import DocumentList from './components/DocumentList';
import messages from '../i18n/nb_NO.json';

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
}

const DokumenterSakIndex = ({ documents, selectDocumentCallback, behandlingId }: OwnProps) => (
  <RawIntlProvider value={intl}>
    <DocumentList documents={documents} selectDocumentCallback={selectDocumentCallback} behandlingId={behandlingId} />
  </RawIntlProvider>
);

export default DokumenterSakIndex;
