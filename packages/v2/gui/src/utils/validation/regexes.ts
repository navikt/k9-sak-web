// invalidTextRegex finner ugyldige tegn i fritekst, i tråd med ADR for feltvalidering (sif-team adr/felt-input-validering.md).
// ADR-en bruker v-flagget, men u gir samme tegnmengde og støttes av byggemålet.
export const invalidTextRegex = /[^\p{L}\p{M}\p{N}\p{P}\p{S}\p{White_Space}]/gu;

/**
 * @deprecated Gammel tegnvalidering for fritekst. Brukes bare der backend ennå ikke validerer etter ADR-regelen
 * (k9-sak Patterns.FRITEKST/FRITEKSTBREV og fp-felles InputValideringRegex.FRITEKST i fptilbake), slik at backend ikke
 * avviser tekst som frontend har godtatt. Alle kallsteder skal over på invalidTextRegex når backend er oppdatert.
 *
 * Merk: Meldinger (sak/meldinger/FritekstInput.tsx) forhåndsutfylles fra brevmaler som bruker [ og ] til å markere
 * plassholdere. Den må fortsatt avvise [ og ] etter overgangen, så saksbehandler ikke kan sende brev med uredigerte
 * plassholdere.
 */
export const legacyInvalidTextRegex =
  /[^0-9a-zA-ZæøåÆØÅAaÁáBbCcČčDdĐđEeFfGgHhIiJjKkLlMmNnŊŋOoPpRrSsŠšTtŦŧUuVvZzŽžéôèÉöüäÖÜÄ .'\-‐–‑/%§!?@_()#+:;,="&\s<>~*]/g;

export const saksnummerOrFodselsnummerPattern = /^[a-zA-Z0-9_-]{0,18}$/;
