import Periode from './periodeTsType';
export default interface BehandlingPerioderType {
  perioderTilVurdering: Periode[];
  perioderMedÅrsak: PerioderMedAarsak[];
  dokumenterTilBehandling: DokumenterTilBehandling[];
}

interface DokumenterTilBehandling {
  journalpostId: string;
  innsendingsTidspunkt: string;
  type: string;
  søktePerioder: SoktePerioder[];
}

interface SoktePerioder {
  periode: Periode;
  type: null;
  arbeidsgiver: null;
  arbeidsforholdRef: null;
}

interface PerioderMedAarsak {
  periode: Periode;
  årsaker: string[];
}
