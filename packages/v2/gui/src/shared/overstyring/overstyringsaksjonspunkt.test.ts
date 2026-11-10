import { aksjonspunktStatus, type AksjonspunktStatus } from '@k9-sak-web/backend/k9sak/kodeverk/AksjonspunktStatus.js';
import { aksjonspunktType, type AksjonspunktType } from '@k9-sak-web/backend/k9sak/kodeverk/AksjonspunktType.js';
import { describe, expect, it } from 'vitest';
import {
  finnOverstyringsaksjonspunktStatus,
  skalViseOverstyringAksjonspunktVarsel,
} from './overstyringsaksjonspunkt.js';

const lagAksjonspunkt = (status: AksjonspunktStatus, type: AksjonspunktType = aksjonspunktType.OVERSTYRING) => ({
  status,
  aksjonspunktType: type,
});

describe('finnOverstyringsaksjonspunktStatus', () => {
  it('gir ÅPENT for åpent overstyringsaksjonspunkt', () => {
    expect(finnOverstyringsaksjonspunktStatus([lagAksjonspunkt(aksjonspunktStatus.OPPRETTET)])).toBe('ÅPENT');
  });

  it('gir UTFØRT for utført overstyringsaksjonspunkt', () => {
    expect(finnOverstyringsaksjonspunktStatus([lagAksjonspunkt(aksjonspunktStatus.UTFØRT)])).toBe('UTFØRT');
  });

  it('lar åpent vinne over utført', () => {
    expect(
      finnOverstyringsaksjonspunktStatus([
        lagAksjonspunkt(aksjonspunktStatus.UTFØRT),
        lagAksjonspunkt(aksjonspunktStatus.OPPRETTET),
      ]),
    ).toBe('ÅPENT');
  });

  it('ignorerer avbrutte, saksbehandleroverstyring og manuelle aksjonspunkter', () => {
    expect(
      finnOverstyringsaksjonspunktStatus([
        lagAksjonspunkt(aksjonspunktStatus.AVBRUTT),
        lagAksjonspunkt(aksjonspunktStatus.OPPRETTET, aksjonspunktType.SAKSBEHANDLEROVERSTYRING),
        lagAksjonspunkt(aksjonspunktStatus.OPPRETTET, aksjonspunktType.MANUELL),
      ]),
    ).toBeUndefined();
  });
});

describe('skalViseOverstyringAksjonspunktVarsel', () => {
  it('viser varsel for saksbehandler uten overstyrerrolle', () => {
    expect(skalViseOverstyringAksjonspunktVarsel([lagAksjonspunkt(aksjonspunktStatus.OPPRETTET)], false, false)).toBe(
      true,
    );
  });

  it('viser ikke varsel for overstyrer', () => {
    expect(skalViseOverstyringAksjonspunktVarsel([lagAksjonspunkt(aksjonspunktStatus.OPPRETTET)], true, false)).toBe(
      false,
    );
  });

  it('viser ikke varsel i readonly', () => {
    expect(skalViseOverstyringAksjonspunktVarsel([lagAksjonspunkt(aksjonspunktStatus.OPPRETTET)], false, true)).toBe(
      false,
    );
  });

  it('viser ikke varsel uten overstyringsaksjonspunkt', () => {
    expect(skalViseOverstyringAksjonspunktVarsel([], false, false)).toBe(false);
  });
});
