interface Diagnosekode {
    kode: string;
    beskrivelse: string;
}

export type DiagnosekodeWrapper = { koder: Array<Diagnosekode>, hasLoaded: boolean }

export default Diagnosekode;
