// LEGACY-UTTAK: Slettes når feature toggle NYTT_UTTAK_PANEL fjernes. Ikke endre.
interface KvoteInfo {
  maxDato?: string;
  totaltForbruktKvote: number;
}

export type { KvoteInfo as default };
