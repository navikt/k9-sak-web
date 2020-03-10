import stringEnum from '@k9-sak-web/types/src/tsUtils';

export const ResultattypeEnum = stringEnum({
  INNVILGET: 'INNVILGET',
  AVSLÅTT: 'AVSLÅTT',
  UAVKLART: 'UAVKLART',
});

type Resultattype = typeof ResultattypeEnum[keyof typeof ResultattypeEnum];

export default Resultattype;
