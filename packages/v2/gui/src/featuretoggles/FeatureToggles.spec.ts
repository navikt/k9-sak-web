import { describe, it, expect } from 'vitest';
import {
  prodFeatureToggles as k9ProdFeatureToggles,
  qFeatureToggles,
  qFeatureToggles as k9QFeatureToggles,
} from './k9/featureToggles.js';
import {
  prodFeatureToggles as ungProdFeatureToggles,
  qFeatureToggles as ungQFeatureToggles,
} from './ung/featureToggles.js';
import { initQFeatureToggles } from './FeatureToggles.js';

describe('FeatureToggles som rapporteres med feil her har samme verdi i alle varianter og skal ryddes vekk', () => {
  const rootKeys = Object.keys(initQFeatureToggles({})({})).filter(k => k != 'isFor') as (keyof Omit<
    typeof qFeatureToggles,
    'isFor'
  >)[];
  it.each(rootKeys)('feature toggle %s', key => {
    const trueInAllVariants =
      k9QFeatureToggles[key] && k9ProdFeatureToggles[key] && ungQFeatureToggles[key] && ungProdFeatureToggles[key];
    expect(trueInAllVariants).toBe(false);
    const falseInAllVariants =
      (k9QFeatureToggles[key] || k9ProdFeatureToggles[key] || ungQFeatureToggles[key] || ungProdFeatureToggles[key]) ===
      false;
    expect(falseInAllVariants).toBe(false);
  });
});
