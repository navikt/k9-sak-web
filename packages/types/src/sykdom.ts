import {
  Periode,
  Legeerklæring,
  PeriodeMedTilsynOgPleieResponse,
  PeriodeMedUtvidetTilsynOgPleieResponse,
} from './medisinsk-vilkår/MedisinskVilkår';

export type Sykdom = Readonly<{
  periodeTilVurdering: Periode;
  legeerklæringer: Legeerklæring[];
  perioderMedKontinuerligTilsynOgPleie: PeriodeMedTilsynOgPleieResponse[];
  perioderMedUtvidetKontinuerligTilsynOgPleie: PeriodeMedUtvidetTilsynOgPleieResponse[];
}>;

export default Sykdom;
