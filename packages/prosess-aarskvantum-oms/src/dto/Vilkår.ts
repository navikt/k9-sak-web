import stringEnum from '@k9-sak-web/types/src/tsUtils';

export const VilkårEnum = stringEnum({
  OMSORGSVILKÅRET: 'OMSORGSVILKÅRET',
  NOK_DAGER: 'NOK_DAGER',
  INNGANGSVILKÅR: 'INNGANGSVILKÅR',
  ALDERSVILKÅR_SØKER: 'ALDERSVILKÅR_SØKER',
  ALDERSVILKÅR_BARN: 'ALDERSVILKÅR_BARN',
  SMITTEVERN: 'SMITTEVERN',
  UIDENTIFISERT_RAMMEVEDTAK: 'UIDENTIFISERT_RAMMEVEDTAK',
  ARBEIDSFORHOLD: 'ARBEIDSFORHOLD'
});

type Vilkår = typeof VilkårEnum[keyof typeof VilkårEnum];

export default Vilkår;
