import type { K9FeatureToggles } from './K9FeatureToggles.js';
import { qFeatureToggles } from './qFeatureToggles.js';
import { prodFeatureToggles } from './prodFeatureToggles.js';

type ResolveUngFeatureTogglesParams = Readonly<{ useQVersion: boolean }>;

export const resolveK9FeatureToggles = ({ useQVersion }: ResolveUngFeatureTogglesParams): K9FeatureToggles => {
  if (useQVersion) {
    return qFeatureToggles;
  }
  return prodFeatureToggles;
};
