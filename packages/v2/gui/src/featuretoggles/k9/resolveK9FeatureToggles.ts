import type { FeatureToggles } from '../FeatureToggles.js';
import { prodFeatureToggles, qFeatureToggles } from './featureToggles.js';

type ResolveUngFeatureTogglesParams = Readonly<{ useQVersion: boolean }>;

export const resolveK9FeatureToggles = ({ useQVersion }: ResolveUngFeatureTogglesParams): FeatureToggles => {
  if (useQVersion) {
    return qFeatureToggles;
  }
  return prodFeatureToggles;
};
