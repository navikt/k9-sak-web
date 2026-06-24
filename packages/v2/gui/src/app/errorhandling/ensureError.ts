/**
 * Brukes for å sikre at feilhandtering kan operere på Error type i event handlers der det teknisk sett kan komme inn andre type verdier.
 */
export const ensureError = (error: unknown): Error => {
  if (error instanceof Error) {
    return error;
  }
  if (error == null) {
    return new Error('Feil fanga, men feilobjekt var null/undefined');
  }
  return new Error(String(error));
};
