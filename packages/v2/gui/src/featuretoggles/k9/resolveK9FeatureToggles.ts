import type { K9FeatureToggles } from './K9FeatureToggles.js';
import { devFeatureToggles } from './devFeatureToggles.js';
import { qFeatureToggles } from './qFeatureToggles.js';
import { prodFeatureToggles } from './prodFeatureToggles.js';

type ResolveK9FeatureTogglesParams = Readonly<{ isQ: boolean; isDev: boolean }>;

export const resolveK9FeatureToggles = ({ isQ, isDev }: ResolveK9FeatureTogglesParams): K9FeatureToggles => {
  if (isDev) {
    return devFeatureToggles;
  }
  if (isQ) {
    return qFeatureToggles;
  }
  return prodFeatureToggles;
};
