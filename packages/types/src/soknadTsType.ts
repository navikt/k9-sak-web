import Arbeidsgiver from './arbeidsgiverTsType';
import Kodeverk from './kodeverkTsType';

export type ManglendeVedleggSoknad = Readonly<{
  dokumentType: Kodeverk;
  arbeidsgiver: Arbeidsgiver;
  brukerHarSagtAtIkkeKommer: boolean;
}>;

type Soknad = Readonly<{
  fodselsdatoer?: Record<number, string>;
  termindato?: string;
  antallBarn: number;
  utstedtdato?: string;
  soknadType: Kodeverk;
  manglendeVedlegg: ManglendeVedleggSoknad[];
}>;

export default Soknad;
