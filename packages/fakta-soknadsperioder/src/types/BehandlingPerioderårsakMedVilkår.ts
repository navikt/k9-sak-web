interface BehandlingPerioderårsakMedVilkår {
  perioderMedÅrsak: PerioderMedÅrsak;
  periodeMedUtfall: PeriodeMedUtfall[];
  forrigeVedtak: any[];
}

export interface PeriodeMedUtfall {
  periode: Periode;
  utfall: Utfall;
}

export interface Periode {
  fom: string;
  tom: string;
}

export interface Utfall {
  kode: string;
  kodeverk: string;
}

export interface PerioderMedÅrsak {
  perioderTilVurdering: Periode[];
  perioderMedÅrsak: PerioderMedÅrsakElement[];
  dokumenterTilBehandling: DokumenterTilBehandling[];
}

export interface DokumenterTilBehandling {
  journalpostId: string;
  innsendingsTidspunkt: string;
  type: string;
  søktePerioder: SøktePerioder[];
}

export interface SøktePerioder {
  periode: Periode;
  type: null;
  arbeidsgiver: null;
  arbeidsforholdRef: null;
}

export interface PerioderMedÅrsakElement {
  periode: Periode;
  årsaker: string[];
}

export default BehandlingPerioderårsakMedVilkår;
