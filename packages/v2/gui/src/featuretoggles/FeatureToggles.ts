import type { FeatureTogglesFor } from './FeatureTogglesFor.ts';
import type { K9FeatureToggles } from './k9/K9FeatureToggles.js';
import type { UngFeatureToggles } from './ung/UngFeatureToggles.js';

export type FeatureToggles = (K9FeatureToggles | UngFeatureToggles) & FeatureTogglesFor;
