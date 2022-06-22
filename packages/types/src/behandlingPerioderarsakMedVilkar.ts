interface BehandlingPerioderårsakMedVilkår {
  perioderMedÅrsak: PerioderMedÅrsak;
  periodeMedUtfall: PeriodeMedUtfall[];
  forrigeVedtak: PeriodeMedUtfall[];
}

export interface PeriodeMedUtfall {
  periode: Periode;
  utfall: string;
}

export interface Periode {
  fom: string;
  tom: string;
}

export interface PerioderMedÅrsak {
  perioderTilVurdering: Periode[];
  perioderMedÅrsak: PerioderMedÅrsakElement[];
  årsakMedPerioder: ÅrsakMedPerioder[];
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

export interface ÅrsakMedPerioder {
  årsak: string;
  perioder: Periode[];
}

export default BehandlingPerioderårsakMedVilkår;
