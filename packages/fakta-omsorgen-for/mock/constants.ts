const { DEV: IS_DEV, VITE_LOCAL_STORYBOOK } = import.meta.env;
const mockUrlPrepend = VITE_LOCAL_STORYBOOK || IS_DEV ? '' : '/k9-sak-web';

export { mockUrlPrepend };
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type _VenterPåSletting =
  import('@k9-sak-web/gui/featuretoggles/FeatureToggles.js').FeatureToggles['BRUK_OMSORGEN_FOR_V2'];
