interface BehandlingPerioderårsakMedVilkår {
  perioderMedÅrsak: PerioderMedÅrsak;
  periodeMedUtfall: PeriodeMedUtfall[];
  forrigeVedtak: PeriodeMedUtfall[];
}

interface PeriodeMedUtfall {
  periode: Periode;
  utfall: Utfall;
}

interface Periode {
  fom: string;
  tom: string;
}

interface Utfall {
  kode: string;
  kodeverk: string;
}

interface PerioderMedÅrsak {
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

interface SøktePerioder {
  periode: Periode;
  type: null | string;
  arbeidsgiver: null | Arbeidsgiver;
  arbeidsforholdRef: null;
}

interface Arbeidsgiver {
  arbeidsgiverOrgnr: string;
  arbeidsgiverAktørId: any;
}

interface PerioderMedÅrsakElement {
  periode: Periode;
  årsaker: string[];
}

interface ÅrsakMedPerioder {
  årsak: string;
  perioder: Periode[];
}

export default BehandlingPerioderårsakMedVilkår;
