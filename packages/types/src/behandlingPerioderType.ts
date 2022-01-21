import Periode from './periodeTsType';
export default interface BehandlingPerioderType {
  perioderTilVurdering: Periode[];
  perioderMedÅrsak: PerioderMedÅrsak[];
  dokumenterTilBehandling: DokumenterTilBehandling[];
}

interface DokumenterTilBehandling {
  journalpostId: string;
  innsendingsTidspunkt: string;
  type: string;
  søktePerioder: SøktePerioder[];
}

interface SøktePerioder {
  periode: Periode;
  type: null;
  arbeidsgiver: null;
  arbeidsforholdRef: null;
}

interface PerioderMedÅrsak {
  periode: Periode;
  årsaker: string[];
}
