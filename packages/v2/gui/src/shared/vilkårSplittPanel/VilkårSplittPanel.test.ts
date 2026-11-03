import { Utfall } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/Utfall.js';
import { describe, expect, it } from 'vitest';
import {
  getDefaultSelectedPeriodId,
  getPeriodStatus,
  sortPeriods,
  type VilkårSplittPanelPeriod,
} from './VilkårSplittPanel.js';

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

describe('getDefaultSelectedPeriodId', () => {
  it('returnerer tom streng for tom liste', () => {
    expect(getDefaultSelectedPeriodId([])).toBe('');
  });

  it('returnerer den ene perioden', () => {
    const periods = [{ id: 'periode-1', status: 'success', label: 'Periode 1' }] satisfies VilkårSplittPanelPeriod[];

    expect(getDefaultSelectedPeriodId(periods)).toBe('periode-1');
  });

  it('velger nyeste vurderte periode uavhengig av inndatarekkefølge', () => {
    const periods = [
      { id: 'eldre', status: 'success', label: 'Eldre', periode: { fom: '2024-01-01', tom: '2024-01-31' } },
      { id: 'nyere', status: 'error', label: 'Nyere', periode: { fom: '2024-03-01', tom: '2024-03-31' } },
      { id: 'midterste', status: 'success', label: 'Midterste', periode: { fom: '2024-02-01', tom: '2024-02-29' } },
    ] satisfies VilkårSplittPanelPeriod[];

    expect(getDefaultSelectedPeriodId(periods)).toBe('nyere');
  });

  it('velger datert nyeste periode fremfor en udatert ikke-warning-periode', () => {
    const periods = [
      { id: '2099-12-31', status: 'success', label: 'Udatert' },
      { id: 'nyeste', status: 'success', label: 'Nyeste', periode: { fom: '2024-03-01', tom: '2024-03-31' } },
      { id: 'eldre', status: 'success', label: 'Eldre', periode: { fom: '2024-01-01', tom: '2024-01-31' } },
    ] satisfies VilkårSplittPanelPeriod[];

    expect(getDefaultSelectedPeriodId(periods)).toBe('nyeste');
  });

  it('prioriterer en eldre periode med warning foran en nyere vurdert periode', () => {
    const periods = [
      { id: 'nyere', status: 'success', label: 'Nyere', periode: { fom: '2024-03-01', tom: '2024-03-31' } },
      { id: 'eldre', status: 'warning', label: 'Eldre', periode: { fom: '2024-01-01', tom: '2024-01-31' } },
    ] satisfies VilkårSplittPanelPeriod[];

    expect(getDefaultSelectedPeriodId(periods)).toBe('eldre');
  });

  it('beholder første warning i opprinnelig rekkefølge når flere har warning', () => {
    const periods = [
      { id: 'første', status: 'warning', label: 'Første', periode: { fom: '2024-02-01', tom: '2024-02-28' } },
      { id: 'andre', status: 'warning', label: 'Andre', periode: { fom: '2024-01-01', tom: '2024-01-31' } },
    ] satisfies VilkårSplittPanelPeriod[];

    expect(getDefaultSelectedPeriodId(periods)).toBe('første');
  });
});

describe('sortPeriods', () => {
  it('sorterer fallende etter fom og legger perioder uten dato sist', () => {
    const periods = [
      { id: 'z-id', status: 'success', label: 'Fom først', periode: { fom: '2024-01-01', tom: '2024-01-31' } },
      { id: 'a-id', status: 'success', label: 'Fom sist', periode: { fom: '2024-03-01', tom: '2024-03-31' } },
      { id: '2099-12-31', status: 'success', label: 'Uten dato' },
    ] satisfies VilkårSplittPanelPeriod[];

    expect(sortPeriods(periods).map(period => period.id)).toEqual(['a-id', 'z-id', '2099-12-31']);
  });

  it('beholder rekkefølgen for flere perioder uten dato uavhengig av id', () => {
    const periods = [
      { id: 'z-id', status: 'success', label: 'Første uten dato' },
      { id: '2099-12-31', status: 'success', label: 'Andre uten dato' },
      { id: 'a-id', status: 'success', label: 'Tredje uten dato' },
    ] satisfies VilkårSplittPanelPeriod[];

    expect(sortPeriods(periods).map(period => period.id)).toEqual(['z-id', '2099-12-31', 'a-id']);
  });

  it('sorterer tom liste', () => {
    expect(sortPeriods([])).toEqual([]);
  });

  it('returnerer sorterte perioder uten å mutere inndata', () => {
    const periods = [
      { id: 'eldre', status: 'success', label: 'Eldre', periode: { fom: '2024-01-01', tom: '2024-01-31' } },
      { id: 'nyere', status: 'success', label: 'Nyere', periode: { fom: '2024-03-01', tom: '2024-03-31' } },
    ] satisfies VilkårSplittPanelPeriod[];

    const sortedPeriods = sortPeriods(periods);

    expect(sortedPeriods.map(period => period.id)).toEqual(['nyere', 'eldre']);
    expect(sortedPeriods).not.toBe(periods);
    expect(periods.map(period => period.id)).toEqual(['eldre', 'nyere']);
  });
});
