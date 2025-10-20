interface Gyldighetsperiode {
  fom: string;
  tom: string;
}

export default interface BarnMedRammevedtak {
  kroniskSykdom?: Gyldighetsperiode[];
  aleneomsorg?: Gyldighetsperiode;
  fosterbarn?: Gyldighetsperiode;
  utenlandskBarn?: Gyldighetsperiode;
  deltBosted?: Gyldighetsperiode;
  personIdent: string;
}
