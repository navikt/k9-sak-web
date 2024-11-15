export interface Kompletthet {
  vurderinger: KompletthetVurderinger[];
}

export interface KompletthetVurderinger {
  periode: Periode;
  vurderinger: Vurderinger[];
}

export interface Periode {
  fom: string;
  tom: string;
}

export interface Vurderinger {
  arbeidsgiver: VurderingerArbeidsgiver;
  vurdering: string;
  journalpostId: string;
  førsteFraværsdag: string;
  mottatt: string;
  eksternReferanse: string;
  erstattetAv: any[];
}

export interface VurderingerArbeidsgiver {
  arbeidsgiver: ArbeidsgiverArbeidsgiver;
  arbeidsforhold: null;
}

export interface ArbeidsgiverArbeidsgiver {
  arbeidsgiverOrgnr: string;
  arbeidsgiverAktørId: null;
}
