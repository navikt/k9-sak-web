import { qFeatureToggles } from './featureToggles.js';
import { prodFeatureToggles } from './featureToggles.js';
import type { FeatureToggles } from '../FeatureToggles.js';

type ResolveUngFeatureTogglesParams = Readonly<{ useQVersion: boolean }>;

export const resolveK9FeatureToggles = ({ useQVersion }: ResolveUngFeatureTogglesParams): FeatureToggles => {
  if (useQVersion) {
    return qFeatureToggles;
  }
  return prodFeatureToggles;
};
