import type { FritekstbrevinnholdDto, MottakerDto } from "@navikt/k9-sak-typescript-client";
import { YtelsesType } from "../../k9sak/extra/ytelseTyper.js";
import { AvsenderApplikasjon } from "./AvsenderApplikasjon.ts";


/**
 * Denne typen finnast ikkje i k9-formidling koden, der er det berre generell JsonNode type. Men ut frå inspeksjon av
 * data sendt, og kva k9-sak har, så trur eg dette er korrekt type.
 */
export interface Dokumentdata {
  readonly fritekst?: string;
  readonly fritekstbrev?: FritekstbrevinnholdDto;
}

/**
 * Oppretta ut frå ForhpndsvisDto.kt i k9-formidling
 */
export interface ForhåndsvisDto {
  eksternReferanse: string;
  // ytelsesType bruker denne kodeverkstypen frå k9-sak, forstår det slik at formidling må handtere samme kodeverk som k9-sak, så det burde dermed vere greit.
  ytelsesType: YtelsesType;
  saksnummer: string;
  aktørId: string;
  overstyrtMottaker?: MottakerDto; // Bruker denne type frå k9-sak, av same grunn som over, reknar med dei må vere like.
  dokumentMal: string; // dokumentMal har samme verdi som "brevmalkode" i BestillBrevDto til k9-sak. Bruker derfor samme type "string" som der.
  avsenderApplikasjon: AvsenderApplikasjon;
  dokumentdata: Dokumentdata | null
}
