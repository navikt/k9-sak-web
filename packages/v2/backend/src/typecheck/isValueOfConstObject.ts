/**
 * Viss man har verdi frå eit "kombinert" konstant kodeverdi objekt beståande av mange ulike konstante objekt og trenger
 * å konvertere denne verdi til å ha verditypen til eit av dei kombinerte objekta kan denne funksjon brukast.
 * @param value verdi frå objekt returnert frå `safeConstCombine`
 * @param obj eit av objekta sendt inn til `safeConstCombine`
 * @return true (type assertion til verdi-type frå obj) viss value finnast som verdi i obj
 */
export const isValueOfConstObject = <const Obj extends Readonly<Record<string, string>>>(
  value: string,
  obj: Obj,
): value is Obj[keyof Obj] => {
  return Object.values(obj).some(v => v === value);
};
