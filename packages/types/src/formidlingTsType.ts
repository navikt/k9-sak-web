import Kodeverk from './kodeverkTsType';

type ForhåndsvisRequest = Readonly<{
  eksternReferanse: string;
  ytelseType: any;
  saksnummer: string;
  aktørId: string;
  avsenderApplikasjon: string;
  dokumentMal: Kodeverk;
  dokumentdata?: any;
}>;

export default ForhåndsvisRequest;
