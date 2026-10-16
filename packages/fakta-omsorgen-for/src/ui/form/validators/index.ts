export function required(v: string | number): string | boolean {
  if (v === null || v === undefined || v === '') {
    return 'Du må oppgi en verdi';
  }
  return true;
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type _VenterPåSletting =
  import('@k9-sak-web/gui/featuretoggles/FeatureToggles.js').FeatureToggles['BRUK_OMSORGEN_FOR_V2'];
