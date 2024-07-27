import React from 'react';
import { FormattedMessage, RawIntlProvider, createIntl, createIntlCache } from 'react-intl';

import { Aktor, KodeverkMedNavn } from '@k9-sak-web/types';

import { BodyShort } from '@navikt/ds-react';
import messages from '../i18n/nb_NO.json';
import AktoerGrid from './components/AktoerGrid';

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
}

const AktorSakIndex = ({ valgtAktorId, aktorInfo, alleKodeverk }: OwnProps) => (
  <RawIntlProvider value={intl}>
    {aktorInfo && <AktoerGrid aktorInfo={aktorInfo} alleKodeverk={alleKodeverk} />}
    {!aktorInfo && (
      <BodyShort size="small">
        <FormattedMessage id="AktorSakIndex.UgyldigAktorId" values={{ id: valgtAktorId }} />
      </BodyShort>
    )}
  </RawIntlProvider>
);

export default AktorSakIndex;
