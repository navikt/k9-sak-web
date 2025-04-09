export const getLanguageFromspråkkode = (språkkode?: string): string => {
  if (!språkkode) {
    return 'Bokmål';
  }

  switch (språkkode) {
    case 'NN':
      return 'Nynorsk';
    case 'EN':
      return 'Engelsk';
    default:
      return 'Bokmål';
  }
};
