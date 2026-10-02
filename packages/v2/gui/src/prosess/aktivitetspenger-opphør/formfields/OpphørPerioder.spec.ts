import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import { AksjonspunktStatus } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktStatus.js';
import type { AksjonspunktDto } from '@k9-sak-web/backend/ungsak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import { describe, expect, it } from 'vitest';
import { getOpphørPeriods, type OpphørPeriodInput } from './OpphørPerioder.js';

const lagAksjonspunkt = (status: AksjonspunktStatus, toTrinnsBehandlingGodkjent?: boolean): AksjonspunktDto => ({
  definisjon: AksjonspunktDefinisjon.VURDER_FAKTA_OM_BOSTED,
  status,
  kanLoses: status === AksjonspunktStatus.OPPRETTET,
  erAktivt: status === AksjonspunktStatus.OPPRETTET,
  toTrinnsBehandlingGodkjent,
});

const perioder: OpphørPeriodInput[] = [
  { fom: '2026-01-01', tom: '2026-12-31', status: 'success' },
  { fom: '2027-01-01', status: 'warning' },
];

describe('getOpphørPeriods', () => {
  it('legger til en Ikke satt-periode for et åpent aksjonspunkt', () => {
    expect(
      getOpphørPeriods({
        aksjonspunkt: lagAksjonspunkt(AksjonspunktStatus.OPPRETTET),
        perioder,
      }),
    ).toEqual([
      { id: 'ikke-satt', status: 'warning', label: 'Ikke satt' },
      {
        id: '2027-01-01',
        status: 'warning',
        label: '01.01.2027',
      },
      {
        id: '2026-01-01',
        status: 'success',
        label: '01.01.2026 - 31.12.2026',
        periode: { fom: '2026-01-01', tom: '2026-12-31' },
      },
    ]);
  });

  it('utelater Ikke satt når aksjonspunktet er utført', () => {
    const result = getOpphørPeriods({
      aksjonspunkt: lagAksjonspunkt(AksjonspunktStatus.UTFØRT),
      perioder,
    });

    expect(result[0]?.id).toBe('2027-01-01');
  });

  it('utelater Ikke satt når saken er sendt tilbake fra beslutter', () => {
    const result = getOpphørPeriods({
      aksjonspunkt: lagAksjonspunkt(AksjonspunktStatus.OPPRETTET, false),
      perioder,
    });

    expect(result[0]?.id).toBe('2027-01-01');
  });

  it('returnerer periodene uten Ikke satt når aksjonspunkt mangler', () => {
    const result = getOpphørPeriods({ perioder });

    expect(result).toHaveLength(2);
    expect(result.map(period => period.id)).toEqual(['2027-01-01', '2026-01-01']);
  });
});
