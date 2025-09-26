import type {
  k9_sak_kontrakt_dokument_FritekstbrevinnholdDto as FritekstbrevinnholdDto,
  k9_sak_kontrakt_dokument_MottakerDto as MottakerDto,
} from '../../k9sak/generated/types.js';
import type { AvsenderApplikasjon } from './AvsenderApplikasjon.js';
import type { FagsakYtelsesType } from '../../k9sak/kodeverk/FagsakYtelsesType.js';

/**
 * Denne typen finnast ikkje i k9-formidling koden, der er det berre generell JsonNode type. Men ut frå inspeksjon av
 * data sendt, og kva k9-sak har, så trur eg dette er korrekt type.
 */
export interface Dokumentdata {
  readonly fritekst: string;
  readonly fritekstbrev?: FritekstbrevinnholdDto;
}

/**
 * Oppretta ut frå ForhåndsvisDto.kt i k9-formidling
 */
export interface ForhåndsvisDto {
  eksternReferanse: string;
  ytelseType: FagsakYtelsesType;
  saksnummer: string;
  aktørId: string;
  overstyrtMottaker?: MottakerDto; // Bruker denne type frå k9-sak, av same grunn som over, reknar med dei må vere like.
  dokumentMal: string; // dokumentMal har samme verdi som "brevmalkode" i BestillBrevDto til k9-sak. Bruker derfor samme type "string" som der.
  avsenderApplikasjon: AvsenderApplikasjon;
  dokumentdata: Dokumentdata | null;
}
