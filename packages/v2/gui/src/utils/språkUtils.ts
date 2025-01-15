export const getLanguageFromSprakkode = (sprakkode?: string): string => {
  if (!sprakkode) {
    return 'Bokmål';
  }

  switch (sprakkode) {
    case 'NN':
      return 'Nynorsk';
    case 'EN':
      return 'Engelsk';
    default:
      return 'Bokmål';
  }
};
