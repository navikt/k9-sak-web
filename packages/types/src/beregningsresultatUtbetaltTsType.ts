import Kodeverk from './kodeverkTsType';

type BeregningsresultatUtbetalt = Readonly<{
  opphoersdato?: string;
  perioder: {
    andeler: Kodeverk[];
    dagsats: number;
    fom: string;
    tom: string;
  };
  skalHindreTilbaketrekk: boolean;
  utbetaltePerioder: any[];
}>;

export default BeregningsresultatUtbetalt;
