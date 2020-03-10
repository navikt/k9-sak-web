import React, { FunctionComponent } from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import { Kodeverk, Personopplysninger, Fagsak } from '@k9-sak-web/types';

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
  fagsak: Fagsak;
  personopplysninger?: Personopplysninger;
  lenkeTilAnnenPart?: string;
  alleKodeverk: { [key: string]: [Kodeverk] };
  sprakkode: Kodeverk;
}

const VisittkortSakIndex: FunctionComponent<OwnProps> = ({
  fagsak,
  personopplysninger,
  lenkeTilAnnenPart,
  alleKodeverk,
  sprakkode,
}) => (
  <RawIntlProvider value={intl}>
    <VisittkortPanel
      personopplysninger={personopplysninger}
      lenkeTilAnnenPart={lenkeTilAnnenPart}
      fagsak={fagsak}
      alleKodeverk={alleKodeverk}
      sprakkode={sprakkode}
    />
  </RawIntlProvider>
);

export default VisittkortSakIndex;
