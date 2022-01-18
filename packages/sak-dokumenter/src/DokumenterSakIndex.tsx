import React from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import { Dokument, Personopplysninger } from '@k9-sak-web/types';

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
  personopplysninger?: Personopplysninger;
}

const DokumenterSakIndex = ({ documents, selectDocumentCallback, behandlingId, personopplysninger }: OwnProps) => (
  <RawIntlProvider value={intl}>
    <DocumentList
      documents={documents}
      selectDocumentCallback={selectDocumentCallback}
      behandlingId={behandlingId}
      personopplysninger={personopplysninger}
    />
  </RawIntlProvider>
);

export default DokumenterSakIndex;
