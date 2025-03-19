// This must be a "factory" function so that the values are not resoved too early in dev server startup, before vite

// has resolved the env variables.
export const featureTogglesFactory = () => [
  {
    key: 'FEATURE_TOGGLES_ENV',
    value: process.env.VITE_FEATURE_TOGGLES_ENV,
  }
];
