import { vilkårStatus } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/VilkårStatus.js';
import { describe, expect, it } from 'vitest';
import { skalViseAksjonspunktIkonForPeriode } from './SoknadsfristVilkarProsessIndex.js';

describe('skalViseAksjonspunktIkonForPeriode', () => {
  it('viser varseltrekant når periode er ikke vurdert og aksjonspunkt er åpent', () => {
    expect(skalViseAksjonspunktIkonForPeriode(vilkårStatus.IKKE_VURDERT, true, false, true)).toBe(true);
  });

  it('viser ikke varseltrekant når periode er oppfylt selv om aksjonspunkt er åpent', () => {
    expect(skalViseAksjonspunktIkonForPeriode(vilkårStatus.OPPFYLT, true, false, true)).toBe(false);
  });

  it('viser ikke varseltrekant når periode ikke vurderes i behandlingen', () => {
    expect(skalViseAksjonspunktIkonForPeriode(vilkårStatus.IKKE_VURDERT, false, false, true)).toBe(false);
  });

  it('viser varseltrekant når overstyring er aktiv', () => {
    expect(skalViseAksjonspunktIkonForPeriode(vilkårStatus.OPPFYLT, false, true, false)).toBe(true);
  });
});
