import React, { FunctionComponent } from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import { Kodeverk, KodeverkMedNavn, Personopplysninger, FagsakPerson } from '@k9-sak-web/types';

import VisittkortPanel from './components/VisittkortPanel';
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
  fagsakPerson: FagsakPerson;
  sprakkode?: Kodeverk;
  alleKodeverk: { [key: string]: KodeverkMedNavn[] };
  personopplysninger?: Personopplysninger;
  harTilbakekrevingVerge?: boolean;
}

const VisittkortSakIndex: FunctionComponent<OwnProps> = ({
  fagsakPerson,
  sprakkode,
  alleKodeverk,
  personopplysninger,
  harTilbakekrevingVerge,
}) => (
  <RawIntlProvider value={intl}>
    <VisittkortPanel
      personopplysninger={personopplysninger}
      fagsakPerson={fagsakPerson}
      alleKodeverk={alleKodeverk}
      sprakkode={sprakkode}
      harTilbakekrevingVerge={harTilbakekrevingVerge}
    />
  </RawIntlProvider>
);

export default VisittkortSakIndex;
