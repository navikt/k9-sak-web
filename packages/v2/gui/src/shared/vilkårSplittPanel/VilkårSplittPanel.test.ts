import { Utfall } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/Utfall.js';
import { describe, expect, it } from 'vitest';
import { getPeriodStatus } from './VilkårSplittPanel.js';

describe('getPeriodStatus', () => {
  it('returnerer success for OPPFYLT', () => {
    expect(getPeriodStatus(Utfall.OPPFYLT)).toBe('success');
  });

  it('returnerer error for IKKE_OPPFYLT', () => {
    expect(getPeriodStatus(Utfall.IKKE_OPPFYLT)).toBe('error');
  });

  it('returnerer warning for andre utfall', () => {
    expect(getPeriodStatus(Utfall.IKKE_VURDERT)).toBe('warning');
  });
});
