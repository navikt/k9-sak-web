import React from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';
import { PersonopplysningAdresse } from '@k9-sak-web/types';
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
  adresser: PersonopplysningAdresse[];
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
}

const BostedSokerFaktaIndex = ({
  personopplysninger,
  sokerTypeTextId = 'BostedSokerFaktaIndex.Soker',
}: OwnProps): JSX.Element => (
  <RawIntlProvider value={intl}>
    <BostedSokerView personopplysninger={personopplysninger} sokerTypeTextId={sokerTypeTextId} />
  </RawIntlProvider>
);

export default BostedSokerFaktaIndex;
