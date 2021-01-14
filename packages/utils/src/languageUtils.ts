import { Kodeverk } from '@k9-sak-web/types';

import getPackageIntl from '../i18n/getPackageIntl';

const intl = getPackageIntl();

export const replaceNorwegianCharacters = str => {
  let result = str.split('æ').join('ae');
  result = result.split('ø').join('oe');
  return result.split('å').join('aa');
};

// TODO Fjern bruk av denne
export const getLanguageCodeFromSprakkode = sprakkode => {
  if (!sprakkode) {
    return 'Malform.Bokmal';
  }

  switch (sprakkode.kode) {
    case 'NN':
      return 'Malform.Nynorsk';
    case 'EN':
      return 'Malform.Engelsk';
    default:
      return 'Malform.Bokmal';
  }
};

export const getLanguageFromSprakkode = (sprakkode?: Kodeverk): string => {
  if (!sprakkode) {
    return intl.formatMessage({ id: 'Malform.Bokmal' });
  }

  switch (sprakkode.kode) {
    case 'NN':
      return intl.formatMessage({ id: 'Malform.Nynorsk' });
    case 'EN':
      return intl.formatMessage({ id: 'Malform.Engelsk' });
    default:
      return intl.formatMessage({ id: 'Malform.Bokmal' });
  }
};
