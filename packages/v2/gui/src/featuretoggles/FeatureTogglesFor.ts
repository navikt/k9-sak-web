export type FeatureTogglesForProd = Readonly<{
  isFor: 'prod';
}>;

export type FeatureTogglesForQ = Readonly<{
  isFor: 'Q';
}>;

export type FeatureTogglesFor = FeatureTogglesForProd | FeatureTogglesForQ;
