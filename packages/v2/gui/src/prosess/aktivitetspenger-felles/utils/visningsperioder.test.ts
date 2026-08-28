import { Avslagsårsak } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/Avslagsårsak.js';
import { Utfall } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/Utfall.js';
import { vilkarType } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/VilkårType.js';
import type { VilkårMedPerioderDto } from '@k9-sak-web/backend/ungsak/kontrakt/vilkår/VilkårMedPerioderDto.js';
import { describe, expect, it } from 'vitest';
import { byggVisningsperioder } from './visningsperioder.js';

const lagVilkår = (perioder: VilkårMedPerioderDto['perioder']): VilkårMedPerioderDto => ({
  vilkarType: vilkarType.ANDRE_LIVSOPPHOLDSYTELSER_VILKÅR,
  perioder,
});

describe('byggVisningsperioder', () => {
  it('tar med vilkårsperioden uten avkortingsperiode når ingen avkorting er mulig', () => {
    const vilkår = lagVilkår([{ periode: { fom: '2024-01-01', tom: '2024-12-31' }, vilkarStatus: Utfall.OPPFYLT }]);

    const resultat = byggVisningsperioder(vilkår, []);

    expect(resultat).toHaveLength(1);
    expect(resultat[0]?.periode).toEqual({ fom: '2024-01-01', tom: '2024-12-31' });
    expect(resultat[0]?.muligAvkortingPeriode).toBeUndefined();
  });

  it('knytter mulig avkortingsperiode til vilkårsperioden den dekker', () => {
    const vilkår = lagVilkår([{ periode: { fom: '2024-01-01', tom: '2024-12-31' }, vilkarStatus: Utfall.OPPFYLT }]);

    const resultat = byggVisningsperioder(vilkår, [{ fom: '2024-01-02', tom: '2024-12-31' }]);

    expect(resultat).toHaveLength(1);
    expect(resultat[0]?.muligAvkortingPeriode).toEqual({ fom: '2024-01-02', tom: '2024-12-31' });
    expect(resultat[0]?.avkortetPeriodeInfo).toBeUndefined();
  });

  it('slår sammen oppfylt periode med påfølgende avkortet avslagsperiode', () => {
    const vilkår = lagVilkår([
      { periode: { fom: '2024-01-01', tom: '2024-06-30' }, vilkarStatus: Utfall.OPPFYLT, begrunnelse: 'Innvilget' },
      {
        periode: { fom: '2024-07-01', tom: '2024-12-31' },
        vilkarStatus: Utfall.IKKE_OPPFYLT,
        avslagKode: Avslagsårsak.AVKORTET,
        begrunnelse: 'Avkortet fordi ...',
      },
    ]);

    const resultat = byggVisningsperioder(vilkår, [{ fom: '2024-01-02', tom: '2024-12-31' }]);

    expect(resultat).toHaveLength(1);
    expect(resultat[0]?.periode).toEqual({ fom: '2024-01-01', tom: '2024-06-30' });
    expect(resultat[0]?.avkortetPeriodeInfo).toEqual({
      begrunnelse: 'Avkortet fordi ...',
      periode: { fom: '2024-07-01', tom: '2024-12-31' },
    });
  });

  it('slår ikke sammen når avslagsårsaken er en annen enn avkortet', () => {
    const vilkår = lagVilkår([
      { periode: { fom: '2024-01-01', tom: '2024-06-30' }, vilkarStatus: Utfall.OPPFYLT },
      {
        periode: { fom: '2024-07-01', tom: '2024-12-31' },
        vilkarStatus: Utfall.IKKE_OPPFYLT,
        avslagKode: Avslagsårsak.SØKER_HAR_ANNEN_LIVSOPPHOLDSYTELSE,
      },
    ]);

    const resultat = byggVisningsperioder(vilkår, [{ fom: '2024-01-02', tom: '2024-12-31' }]);

    expect(resultat).toHaveLength(2);
  });

  it('slår ikke sammen når periodene ikke ligger inntil hverandre', () => {
    const vilkår = lagVilkår([
      { periode: { fom: '2024-01-01', tom: '2024-06-30' }, vilkarStatus: Utfall.OPPFYLT },
      {
        periode: { fom: '2024-08-01', tom: '2024-12-31' },
        vilkarStatus: Utfall.IKKE_OPPFYLT,
        avslagKode: Avslagsårsak.AVKORTET,
      },
    ]);

    const resultat = byggVisningsperioder(vilkår, [{ fom: '2024-01-02', tom: '2024-12-31' }]);

    expect(resultat).toHaveLength(2);
  });

  it('tar med perioder utenfor avkortingsperiodene uten å duplisere de som dekkes', () => {
    const vilkår = lagVilkår([
      { periode: { fom: '2024-01-01', tom: '2024-06-30' }, vilkarStatus: Utfall.OPPFYLT },
      { periode: { fom: '2025-01-01', tom: '2025-06-30' }, vilkarStatus: Utfall.IKKE_VURDERT },
    ]);

    const resultat = byggVisningsperioder(vilkår, [
      { fom: '2024-01-02', tom: '2024-06-30' },
      { fom: '2024-08-02', tom: '2024-12-31' },
    ]);

    expect(resultat.map(p => p.periode.fom)).toEqual(['2024-01-01', '2025-01-01']);
    expect(resultat[0]?.muligAvkortingPeriode).toEqual({ fom: '2024-01-02', tom: '2024-06-30' });
    expect(resultat[1]?.muligAvkortingPeriode).toBeUndefined();
  });
});
