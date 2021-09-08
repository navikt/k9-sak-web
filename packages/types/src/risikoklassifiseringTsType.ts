import Kodeverk from './kodeverkTsType';

export type Risikoklassifisering = Readonly<{
  kontrollresultat: Kodeverk;
  faresignalVurdering?: Kodeverk;
  iayFaresignaler?: {
    faresignaler: string[];
  };
  medlFaresignaler?: {
    faresignaler: string[];
  };
}>;

export default Risikoklassifisering;
