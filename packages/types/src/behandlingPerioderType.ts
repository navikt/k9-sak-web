import Periode from './periodeTsType';
import PerioderMedAarsak from './PerioderMedAarsak';

export default interface BehandlingPerioderType {
  perioderMedÅrsak: {
    perioderTilVurdering: Periode[];
    perioderMedÅrsak: PerioderMedAarsak[];
    dokumenterTilBehandling: DokumenterTilBehandling[];
  };
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
