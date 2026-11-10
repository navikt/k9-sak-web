import { describe, expect, it } from 'vitest';
import type { VilkårSplittPanelPeriod } from '../../shared/vilkårSplittPanel/VilkårSplittPanel.js';
import { getDefaultSelectedMedlemskapPeriodId } from './ForutgåendeMedlemskap.js';

const createPeriod = (
  id: string,
  fom: string,
  status: VilkårSplittPanelPeriod['status'],
  vurderesIBehandlingen: boolean,
) =>
  ({
    id,
    status,
    label: id,
    periode: { fom },
    vurderesIBehandlingen,
  }) satisfies VilkårSplittPanelPeriod;

describe('getDefaultSelectedMedlemskapPeriodId', () => {
  it('velger nyeste periode når aksjonspunktet er utført, selv om flere vurderes i behandlingen', () => {
    const periods = [
      createPeriod('periode-eldst', '2020-01-01', 'success', true),
      createPeriod('periode-nyest', '2021-01-01', 'success', true),
    ];

    expect(getDefaultSelectedMedlemskapPeriodId(periods, true)).toBe('periode-nyest');
  });

  it('prioriterer første vurderte periode når aksjonspunktet ikke er utført, også med eksisterende utfall', () => {
    const periods = [
      createPeriod('periode-eldre-success', '2020-01-01', 'success', true),
      createPeriod('periode-nyere-warning', '2021-01-01', 'warning', false),
    ];

    expect(getDefaultSelectedMedlemskapPeriodId(periods, false)).toBe('periode-eldre-success');
  });

  it('beholder første vurderte periode når flere perioder vurderes', () => {
    const periods = [
      createPeriod('periode-første', '2020-01-01', 'warning', true),
      createPeriod('periode-andre', '2021-01-01', 'warning', true),
    ];

    expect(getDefaultSelectedMedlemskapPeriodId(periods, false)).toBe('periode-første');
  });

  it('velger nyeste periode når ingen vurderes i behandlingen', () => {
    const periods = [
      createPeriod('periode-nyest', '2021-01-01', 'success', false),
      createPeriod('periode-eldst', '2020-01-01', 'warning', false),
    ];

    expect(getDefaultSelectedMedlemskapPeriodId(periods, false)).toBe('periode-nyest');
  });

  it('returnerer tom streng for tom liste uansett aksjonspunktstatus', () => {
    expect(getDefaultSelectedMedlemskapPeriodId([], false)).toBe('');
    expect(getDefaultSelectedMedlemskapPeriodId([], true)).toBe('');
  });
});
