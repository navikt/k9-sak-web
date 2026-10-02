// LEGACY-UTTAK: Slettes når feature toggle NYTT_UTTAK_PANEL fjernes. Ikke endre.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { prodFeatureToggles } from '../../featuretoggles/k9/featureToggles.js';

const MARKØR = 'LEGACY-UTTAK';
const srcRoot = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const legacyMapper = [join(srcRoot, 'prosess', 'uttak-legacy'), join(srcRoot, 'storybook', 'legacy-uttak')];

const alleFiler = (mappe: string): string[] =>
  readdirSync(mappe).flatMap(navn => {
    const sti = join(mappe, navn);
    return statSync(sti).isDirectory() ? alleFiler(sti) : [sti];
  });

describe('Gammelt uttak-panel (slettes når NYTT_UTTAK_PANEL fjernes)', () => {
  it('alle filer er merket med LEGACY-UTTAK', () => {
    const manglerMarkør = legacyMapper
      .flatMap(alleFiler)
      .filter(fil => !fil.endsWith('.module.css.d.ts'))
      .filter(fil => !readFileSync(fil, 'utf-8').includes(MARKØR));
    expect(manglerMarkør).toEqual([]);
  });

  it('feature toggle NYTT_UTTAK_PANEL finnes så lenge gammel kode finnes', () => {
    expect(prodFeatureToggles).toHaveProperty('NYTT_UTTAK_PANEL');
  });

  it('gammelt panel er standard i prod', () => {
    expect(prodFeatureToggles.NYTT_UTTAK_PANEL).toBe(false);
  });
});
