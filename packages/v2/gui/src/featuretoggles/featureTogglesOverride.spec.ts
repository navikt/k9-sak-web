import { describe, expect } from 'vitest';
import type { FeatureToggles } from './FeatureToggles.js';
import { qFeatureToggles as k9QFeatureToggles } from './k9/featureToggles.js';
import { prodFeatureToggles as k9ProdFeatureToggles } from './k9/featureToggles.js';
import { qFeatureToggles as ungQFeatureToggles } from './ung/featureToggles.js';
import { prodFeatureToggles as ungProdFeatureToggles } from './ung/featureToggles.js';

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
    console.info('======= k9 Q toggles ======');
    console.log(k9QFeatureToggles);
    console.info('===========================');

    console.info('======= k9 PROD toggles ======');
    console.log(k9ProdFeatureToggles);
    console.info('===========================');

    console.info('======= ung Q toggles ======');
    console.log(ungQFeatureToggles);
    console.info('===========================');

    console.info('======= ung PROD toggles ======');
    console.log(ungProdFeatureToggles);
    console.info('===========================');
    expect(true).toBe(true);
  });
});
