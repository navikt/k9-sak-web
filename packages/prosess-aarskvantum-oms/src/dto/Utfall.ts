import stringEnum from '@k9-sak-web/types/src/tsUtils';

export const UtfallEnum = stringEnum({
  INNVILGET: 'Innvilget',
  AVSLÅTT: 'Avslått',
});

type Utfalltype = typeof UtfallEnum[keyof typeof UtfallEnum];

export default Utfalltype;
