import React from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import { Kodeverk, KodeverkMedNavn, Personopplysninger, FagsakPerson, RelatertFagsak } from '@k9-sak-web/types';

import VisittkortPanel from './components/VisittkortPanel';
import messages from '../i18n/nb_NO.json';
import OvergangFraInfotrygd from '../../types/src/overgangFraInfotrygd';

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
  relaterteFagsaker?: RelatertFagsak;
  direkteOvergangFraInfotrygd?: OvergangFraInfotrygd;
}

const VisittkortSakIndex = ({
  fagsakPerson,
  sprakkode,
  alleKodeverk,
  personopplysninger,
  harTilbakekrevingVerge,
  relaterteFagsaker,
  direkteOvergangFraInfotrygd,
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
    />
  </RawIntlProvider>
);

export default VisittkortSakIndex;
