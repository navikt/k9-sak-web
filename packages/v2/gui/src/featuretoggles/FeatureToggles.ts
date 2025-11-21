import type { K9FeatureToggles } from './k9/K9FeatureToggles.js';
import type { UngFeatureToggles } from './ung/UngFeatureToggles.js';
import type { FeatureTogglesFor } from './FeatureTogglesFor.ts';

export type FeatureToggles = (K9FeatureToggles | UngFeatureToggles) & FeatureTogglesFor;
