import React from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import { Personopplysninger, FagsakPerson, RelatertFagsak } from '@k9-sak-web/types';
import OvergangFraInfotrygd from '@k9-sak-web/types/src/overgangFraInfotrygd';

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
  sprakkode?: string;
  personopplysninger?: Personopplysninger;
  harTilbakekrevingVerge?: boolean;
  relaterteFagsaker?: RelatertFagsak;
  direkteOvergangFraInfotrygd?: OvergangFraInfotrygd;
  erPbSak?: boolean;
  erHastesak?: boolean;
}

const VisittkortSakIndex = ({
  fagsakPerson,
  sprakkode,
  personopplysninger,
  harTilbakekrevingVerge,
  relaterteFagsaker,
  direkteOvergangFraInfotrygd,
  erPbSak,
  erHastesak,
}: OwnProps) => (
  <RawIntlProvider value={intl}>
    <VisittkortPanel
      personopplysninger={personopplysninger}
      fagsakPerson={fagsakPerson}
      sprakkode={sprakkode}
      harTilbakekrevingVerge={harTilbakekrevingVerge}
      relaterteFagsaker={relaterteFagsaker}
      direkteOvergangFraInfotrygd={direkteOvergangFraInfotrygd}
      erPbSak={erPbSak}
      erHastesak={erHastesak}
    />
  </RawIntlProvider>
);

export default VisittkortSakIndex;
