import { describe, expect } from 'vitest';
import type { FeatureToggles } from './FeatureToggles.js';
import { qFeatureToggles as k9QFeatureToggles } from './k9/featureToggles.js';
import { qFeatureToggles as ungQFeatureToggles } from './ung/featureToggles.js';

/**
 * Brukast i tester der ein ønsker å sende inn k9 featuretoggles til komponent, og potensielt overskrive ein/fleire toggle verdier.
 * @param override
 */
export const k9QFeatureTogglesOverride = (override: Partial<Omit<FeatureToggles, 'isFor'>>): FeatureToggles => {
  return {
    ...k9QFeatureToggles,
    ...override,
  };
};

/**
 * Brukast i tester der ein ønsker å sende inn ung featuretoggles til komponent, og potensielt overskrive ein/fleire toggle verdier.
 * @param override
 */
export const ungQFeatureTogglesOverride = (override: Partial<Omit<FeatureToggles, 'isFor'>>): FeatureToggles => {
  return {
    ...ungQFeatureToggles,
    ...override,
  };
};

describe('This is just a utils file for other tests', () => {
  it('has a dummy test to avoid failure', () => {
    expect(true).toBe(true);
  });
});
