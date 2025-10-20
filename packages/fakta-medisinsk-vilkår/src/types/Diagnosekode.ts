interface Diagnosekode {
  kode: string;
  beskrivelse: string;
}

type DiagnosekodeWrapper = { koder: Array<Diagnosekode>; hasLoaded: boolean };

export default Diagnosekode;
