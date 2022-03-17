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
  behandlingId?: number;
  fagsakPerson?: FagsakPerson;
  saksnummer: number;
}

const DokumenterSakIndex = ({ documents, behandlingId, fagsakPerson, saksnummer }: OwnProps) => (
  <RawIntlProvider value={intl}>
    <DocumentList
      documents={documents}
      behandlingId={behandlingId}
      fagsakPerson={fagsakPerson}
      saksnummer={saksnummer}
    />
  </RawIntlProvider>
);

export default DokumenterSakIndex;
