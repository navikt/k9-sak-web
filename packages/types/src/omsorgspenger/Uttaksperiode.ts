import stringEnum from '../tsUtils';

export const VilkårEnum = stringEnum({
  OMSORGSVILKÅRET: 'OMSORGSVILKÅRET',
  NOK_DAGER: 'NOK_DAGER',
  INNGANGSVILKÅR: 'INNGANGSVILKÅR',
  ALDERSVILKÅR_SØKER: 'ALDERSVILKÅR_SØKER',
  ALDERSVILKÅR_BARN: 'ALDERSVILKÅR_BARN',
  SMITTEVERN: 'SMITTEVERN',
  UIDENTIFISERT_RAMMEVEDTAK: 'UIDENTIFISERT_RAMMEVEDTAK',
  ARBEIDSFORHOLD: 'ARBEIDSFORHOLD',
  ANDRE_SKAL_DEKKE_DAGENE: 'ANDRE_SKAL_DEKKE_DAGENE',
});

export type Vilkår = typeof VilkårEnum[keyof typeof VilkårEnum];

export const UtfallEnum = stringEnum({
  INNVILGET: 'INNVILGET',
  AVSLÅTT: 'AVSLÅTT',
  UAVKLART: 'UAVKLART',
});

export type Utfalltype = typeof UtfallEnum[keyof typeof UtfallEnum];

export type Map<Key extends string | number, Value> = {
  [key in Key]?: Value;
};

export type VurderteVilkår = Map<Vilkår, Utfalltype>;

export type Uttaksperiode = {
  bekreftet?: string;
  periode: string; // fom/tom
  delvisFravær?: string; // Duration
  fraværÅrsak: string;
  søknadÅrsak?: string;
  utfall: Utfalltype;
  utbetalingsgrad: number;
  vurderteVilkår: {
    vilkår: VurderteVilkår;
  };
  hjemler: string[];
  nøkkeltall?: Nøkkeltall;
  opprinneligBehandlingUuid?: string;
};

export type Nøkkeltall = {
  totaltAntallDager: number;
  antallKoronadager: number;
  antallDagerArbeidsgiverDekker: number;
  antallDagerFraværRapportertSomNyoppstartet: number;
  antallDagerInfotrygd: number;
  antallForbrukteDager: number;
  restTid: string; // Duration
  forbruktTid: string; // Duration
  smittevernTid: string; // Duration
  migrertData: boolean;
};

export const FraværÅrsakEnum = stringEnum({
  STENGT_SKOLE_ELLER_BARNEHAGE: 'STENGT_SKOLE_ELLER_BARNEHAGE',
  SMITTEVERNHENSYN: 'SMITTEVERNHENSYN',
  ORDINÆRT_FRAVÆR: 'ORDINÆRT_FRAVÆR',
  UDEFINERT: 'UDEFINERT',
});

export default Uttaksperiode;
