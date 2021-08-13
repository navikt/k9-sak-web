import Kodeverk from './kodeverkTsType';

type Risikoklassifisering = Readonly<{
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
