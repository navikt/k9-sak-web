import Kodeverk from './kodeverkTsType';

type ForhåndsvisRequest = Readonly<{
  behandlingUuid?: string,
  eksternReferanse: string,
  ytelseType: string,
  saksnummer: string,
  aktørId: string,
  avsenderApplikasjon: Kodeverk,
  dokumentMal: Kodeverk
  dokumentdata?: any
}>;

export default ForhåndsvisRequest;
