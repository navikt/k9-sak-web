import { Kodeverk } from '@k9-sak-web/types';
import getPackageIntl from '../i18n/getPackageIntl';

const intl = getPackageIntl();

export const replaceNorwegianCharacters = (str: string) => {
  let result = str.split('æ').join('ae');
  result = result.split('ø').join('oe');
  return result.split('å').join('aa');
};

// TODO Fjern bruk av denne
export const getLanguageCodeFromspråkkode = (språkkode: Kodeverk) => {
  if (!språkkode) {
    return 'Malform.Bokmal';
  }

  switch (språkkode.kode) {
    case 'NN':
      return 'Malform.Nynorsk';
    case 'EN':
      return 'Malform.Engelsk';
    default:
      return 'Malform.Bokmal';
  }
};

export const getLanguageFromspråkkode = (språkkode?: string): string => {
  if (!språkkode) {
    return "Bokmål";
  }

  switch (språkkode) {
    case 'NN':
      return "Nynorsk";
    case 'EN':
      return "Engelsk";
    default:
      return "Bokmål";
  }
};
