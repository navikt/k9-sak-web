import Arbeidsgiver from './arbeidsgiverTsType';

export type ManglendeVedleggSoknad = Readonly<{
  dokumentType: string;
  arbeidsgiver: Arbeidsgiver;
  brukerHarSagtAtIkkeKommer: boolean;
}>;

export type Soknad = Readonly<{
  fodselsdatoer?: Record<number, string>;
  termindato?: string;
  antallBarn: number;
  utstedtdato?: string;
  soknadType: string;
  manglendeVedlegg: ManglendeVedleggSoknad[];
}>;

export default Soknad;
