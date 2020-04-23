import stringEnum from '@k9-sak-web/types/src/tsUtils';

export const ÅrsakEnum = stringEnum({
  INNVILGET_ORDINÆR: 'INNVILGET_ORDINÆR',
  INNVILGET_DOKUMENTERT: 'INNVILGET_DOKUMENTERT',
  AVSLÅTT_IKKE_RETT: 'AVSLÅTT_IKKE_RETT',
  AVSLÅTT_IKKE_FLERE_DAGER: 'AVSLÅTT_IKKE_FLERE_DAGER',
  AVSLÅTT_OPPTJENING: 'AVSLÅTT_OPPTJENING',
  AVSLÅTT_MEDLEMSKAP: 'AVSLÅTT_MEDLEMSKAP',
  AVSLÅTT_70ÅR: 'AVSLÅTT_70ÅR'
})

type Årsak = typeof ÅrsakEnum[keyof typeof ÅrsakEnum];

export default Årsak;
