import React from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import { Kodeverk, KodeverkMedNavn, Personopplysninger, FagsakPerson, RelatertFagsak } from '@k9-sak-web/types';
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
  alleKodeverk: { [key: string]: KodeverkMedNavn[] };
  personopplysninger?: Personopplysninger;
  harTilbakekrevingVerge?: boolean;
  relaterteFagsaker?: RelatertFagsak;
  direkteOvergangFraInfotrygd?: OvergangFraInfotrygd;
  erPbSak?: boolean;
}

const VisittkortSakIndex = ({
  fagsakPerson,
  sprakkode,
  alleKodeverk,
  personopplysninger,
  harTilbakekrevingVerge,
  relaterteFagsaker,
  direkteOvergangFraInfotrygd,
  erPbSak,
}: OwnProps) => (
  <RawIntlProvider value={intl}>
    <VisittkortPanel
      personopplysninger={personopplysninger}
      fagsakPerson={fagsakPerson}
      alleKodeverk={alleKodeverk}
      sprakkode={sprakkode}
      harTilbakekrevingVerge={harTilbakekrevingVerge}
      relaterteFagsaker={relaterteFagsaker}
      direkteOvergangFraInfotrygd={direkteOvergangFraInfotrygd}
      erPbSak={erPbSak}
    />
  </RawIntlProvider>
);

export default VisittkortSakIndex;
