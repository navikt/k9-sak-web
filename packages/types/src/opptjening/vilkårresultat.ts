export type Vilkårresultat = Readonly<{
  avslagsårsak: string;
  periode: {
    fom: string;
    tom: string;
  };
  utfall: string;
}>;

export default Vilkårresultat;
