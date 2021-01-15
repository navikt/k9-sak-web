import { createIntl, createIntlCache } from 'react-intl';

import messages from './nb_NO.json';

const getPackageIntl = () => {
  const cache = createIntlCache();

  const intl = createIntl(
    {
      locale: 'nb-NO',
      messages,
    },
    cache,
  );

  return intl;
};

export default getPackageIntl;
