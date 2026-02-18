import { FagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import Kodeverk from './kodeverkTsType';

export type ForhåndsvisRequest = Readonly<{
  eksternReferanse: string;
  ytelseType: FagsakYtelsesType;
  saksnummer: string;
  aktørId: string;
  avsenderApplikasjon: string;
  dokumentMal: Kodeverk;
  dokumentdata?: any;
}>;

export type Fritekstbrev = Readonly<{
  brødtekst: string;
  overskrift: string;
}>;

export default ForhåndsvisRequest;
