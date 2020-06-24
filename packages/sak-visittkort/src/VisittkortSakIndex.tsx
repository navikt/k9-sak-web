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
  sprakkode: Kodeverk;
  alleKodeverk: { [key: string]: Kodeverk[] };
  personopplysninger?: Personopplysninger;
  harTilbakekrevingVerge?: boolean;
}

const VisittkortSakIndex: FunctionComponent<OwnProps> = ({
  fagsak,
  personopplysninger,
  alleKodeverk,
  sprakkode,
  harTilbakekrevingVerge = false,
}) => (
  <RawIntlProvider value={intl}>
    <VisittkortPanel
      personopplysninger={personopplysninger}
      fagsak={fagsak}
      alleKodeverk={alleKodeverk}
      sprakkode={sprakkode}
      harTilbakekrevingVerge={harTilbakekrevingVerge}
    />
  </RawIntlProvider>
);

export default VisittkortSakIndex;
