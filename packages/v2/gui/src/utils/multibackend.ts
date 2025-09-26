// Brukast når ein treng ein indikator for kva backend ein skal jobbe mot
export const k9SakOrUngSak = {
  k9Sak: 'k9Sak',
  ungSak: 'ungSak',
} as const;

export type K9SakOrUngSak = (typeof k9SakOrUngSak)[keyof typeof k9SakOrUngSak];

// Legg til tilsvarande for andre backend kombinasjoner ved behov her
