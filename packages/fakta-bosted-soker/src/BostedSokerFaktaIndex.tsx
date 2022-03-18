import React from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import { KodeverkMedNavn } from '@k9-sak-web/types';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';

import BostedSokerView from './components/BostedSokerView';
import messages from '../i18n/nb_NO.json';

const cache = createIntlCache();

const intl = createIntl(
  {
    locale: 'nb-NO',
    messages,
  },
  cache,
);

export type BostedSokerPersonopplysninger = {
  navn: string;
  adresser: [
    {
      adresseType: string;
      adresselinje1: string;
      adresselinje2?: string;
      adresselinje3?: string;
      postNummer?: string;
      poststed?: string;
      land?: string;
    },
  ];
  sivilstand: string;
  region: string;
  personstatus: string;
  avklartPersonstatus: {
    overstyrtPersonstatus: string;
  };
};

interface OwnProps {
  personopplysninger: BostedSokerPersonopplysninger;
  sokerTypeTextId?: string;
  alleKodeverk: { [key: string]: KodeverkMedNavn[] };
}

const BostedSokerFaktaIndex = ({
  personopplysninger,
  sokerTypeTextId = 'BostedSokerFaktaIndex.Soker',
  alleKodeverk,
}: OwnProps): JSX.Element => (
  <RawIntlProvider value={intl}>
    <BostedSokerView
      personopplysninger={personopplysninger}
      sokerTypeTextId={sokerTypeTextId}
      regionTypes={alleKodeverk[kodeverkTyper.REGION]}
      sivilstandTypes={alleKodeverk[kodeverkTyper.SIVILSTAND_TYPE]}
      personstatusTypes={alleKodeverk[kodeverkTyper.PERSONSTATUS_TYPE]}
    />
  </RawIntlProvider>
);

export default BostedSokerFaktaIndex;
