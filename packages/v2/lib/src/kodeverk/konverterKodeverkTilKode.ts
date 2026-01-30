/*
 * Rekursivt konverterer kodeverkobjekter til kodeverkstrenger
 */
export const konverterKodeverkTilKode = (data: any, erTilbakekreving: boolean) => {
  if (data === undefined || data === null) return;

  const lengdeKodeverkObjekt = erTilbakekreving ? 3 : 2;

  Object.keys(data).forEach(key => {
    if (data[key]?.kode) {
      const antallAttr = Object.keys(data[key]).length;
      if (
        (data[key]?.kodeverk && antallAttr === lengdeKodeverkObjekt) ||
        antallAttr === 1 ||
        [
          'AKSJONSPUNKT_DEF', // Skrive om denne foreløpig, de ekstra attributtene skal fjernes i backend
          'BEHANDLING_RESULTAT_TYPE', // Skrive om denne foreløpig, de ekstra attributtene skal fjernes i backend
        ].includes(data[key]?.kodeverk)
      ) {
        data[key] = data[key].kode; // eslint-disable-line no-param-reassign
      }
    }
    if (typeof data[key] === 'object' && data[key] !== null) {
      konverterKodeverkTilKode(data[key], erTilbakekreving);
    }
  });
};

/**
 * Immutable versjon som returnerer det konverterte objektet.
 * Kloner objektet med JSON.parse(JSON.stringify()) før konvertering.
 *
 * @template TInput - Type for input data
 * @template TOutput - Type for output data (default samme som input)
 */
export const konverterKodeverkTilKodeImmutable = <TInput, TOutput = TInput>(
  data: TInput,
  erTilbakekreving: boolean,
): TOutput => {
  if (data === undefined || data === null) return data as unknown as TOutput;

  const clonedData = JSON.parse(JSON.stringify(data));
  konverterKodeverkTilKode(clonedData, erTilbakekreving);
  return clonedData as TOutput;
};
