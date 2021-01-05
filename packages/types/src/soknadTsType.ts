import Kodeverk from './kodeverkTsType';

type Soknad = Readonly<{
  fodselsdatoer?: Record<number, string>;
  termindato?: string;
  antallBarn: number;
  utstedtdato?: string;
  soknadType: Kodeverk;
}>;

export default Soknad;
