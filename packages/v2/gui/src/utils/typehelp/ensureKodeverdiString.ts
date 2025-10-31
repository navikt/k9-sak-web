/**
 * Viss ein i overgang frå legacy til v2 har ein kodeverdi property som er deklarert til å vere string kodeverdi (v2 format), men
 * som kanskje faktisk er "kodeverdi som objekt", slik legacy klient henter det ut, kan ein med denne funksjon konvertere evt
 * legacy format til v2 format. Viss gitt kodeverdi allereie er i v2 format gjere denne ingenting.
 */
export const ensureKodeVerdiString = <KV extends string>(maybeObjectValue: KV | { kode: KV }): KV => {
  if (typeof maybeObjectValue == 'object' && 'kode' in maybeObjectValue) {
    return maybeObjectValue.kode;
  }
  return maybeObjectValue;
};
