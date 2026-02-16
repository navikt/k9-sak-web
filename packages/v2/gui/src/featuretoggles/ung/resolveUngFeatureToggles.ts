import type { FeatureToggles } from '../FeatureToggles.js';
import { prodFeatureToggles, qFeatureToggles } from './featureToggles.js';

type ResolveUngFeatureTogglesParams = Readonly<{ useQVersion: boolean }>;

export const resolveUngFeatureToggles = ({ useQVersion }: ResolveUngFeatureTogglesParams): FeatureToggles => {
  if (useQVersion) {
    return qFeatureToggles;
  }
  return prodFeatureToggles;
};
