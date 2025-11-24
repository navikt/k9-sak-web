import type { UngFeatureToggles } from './UngFeatureToggles.js';
import { qFeatureToggles } from './qFeatureToggles.js';
import { prodFeatureToggles } from './prodFeatureToggles.js';

type ResolveUngFeatureTogglesParams = Readonly<{ useQVersion: boolean }>;

export const resolveUngFeatureToggles = ({ useQVersion }: ResolveUngFeatureTogglesParams): UngFeatureToggles => {
  if (useQVersion) {
    return qFeatureToggles;
  }
  return prodFeatureToggles;
};
