import type { UngFeatureToggles } from './UngFeatureToggles.js';
import { devFeatureToggles } from './devFeatureToggles.js';
import { qFeatureToggles } from './qFeatureToggles.js';
import { prodFeatureToggles } from './prodFeatureToggles.js';

type ResolveUngFeatureTogglesParams = Readonly<{ isQ: boolean; isDev: boolean }>;

export const resolveUngFeatureToggles = ({ isQ, isDev }: ResolveUngFeatureTogglesParams): UngFeatureToggles => {
  if (isDev) {
    return devFeatureToggles;
  }
  if (isQ) {
    return qFeatureToggles;
  }
  return prodFeatureToggles;
};
