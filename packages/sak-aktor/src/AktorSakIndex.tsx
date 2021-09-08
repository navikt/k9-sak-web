import React from 'react';
import { createIntl, createIntlCache, RawIntlProvider, FormattedMessage } from 'react-intl';

import { Normaltekst } from 'nav-frontend-typografi';
import { Aktor, KodeverkMedNavn } from '@k9-sak-web/types';

import AktoerGrid from './components/AktoerGrid';
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
  valgtAktorId: string;
  aktorInfo?: Aktor;
  alleKodeverk: { [key: string]: KodeverkMedNavn[] };
  finnPathToFagsak: (saksnummer: string) => string;
}

const AktorSakIndex = ({ valgtAktorId, aktorInfo, alleKodeverk, finnPathToFagsak }: OwnProps) => (
  <RawIntlProvider value={intl}>
    {aktorInfo && <AktoerGrid aktorInfo={aktorInfo} alleKodeverk={alleKodeverk} finnPathToFagsak={finnPathToFagsak} />}
    {!aktorInfo && (
      <Normaltekst>
        <FormattedMessage id="AktorSakIndex.UgyldigAktorId" values={{ id: valgtAktorId }} />
      </Normaltekst>
    )}
  </RawIntlProvider>
);

export default AktorSakIndex;
