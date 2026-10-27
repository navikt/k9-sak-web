import { ÅrsakTilVurdering as UngÅrsakTilVurdering } from '@k9-sak-web/backend/ungsak/kontrakt/krav/ÅrsakTilVurdering.js';
import type { Behandling } from '../types/Behandling';
import { erAutomatiskBehandlet, filterPerioderForKontrollAvInntekt, sortBehandlinger } from './behandlingVelgerUtils';

describe('<BehandlingPicker>', () => {
  describe('erAutomatiskBehandlet', () => {
    const lagBehandling = (overstyring: Partial<Behandling>): Behandling =>
      ({ status: 'AVSLU', sakstype: 'UNG', behandlingAnsvarlige: {}, ...overstyring }) as Behandling;

    it('skal være automatisk når avsluttet og uten ansvarlig saksbehandler', () => {
      expect(erAutomatiskBehandlet(lagBehandling({ sakstype: 'PSB' }))).toBe(true);
      expect(erAutomatiskBehandlet(lagBehandling({ sakstype: 'UNG' }))).toBe(true);
      expect(erAutomatiskBehandlet(lagBehandling({ sakstype: 'AVP' }))).toBe(true);
    });

    it('skal ikke være automatisk når behandlingen ikke er avsluttet', () => {
      expect(erAutomatiskBehandlet(lagBehandling({ status: 'UTRED' }))).toBe(false);
    });

    it('skal ikke være automatisk når ansvarlig saksbehandler er satt', () => {
      expect(erAutomatiskBehandlet(lagBehandling({ sakstype: 'PSB', ansvarligSaksbehandler: 'Z123' }))).toBe(false);
    });

    it.each(['UNG', 'AVP'] as const)(
      'skal ikke være automatisk for %s når behandlingAnsvarlige har ansvarlig saksbehandler',
      sakstype => {
        const behandling = lagBehandling({
          sakstype,
          behandlingAnsvarlige: { DEL1: { ansvarligSaksbehandler: 'Z123' } },
        });
        expect(erAutomatiskBehandlet(behandling)).toBe(false);
      },
    );
  });

  it('skal sortere behandlingene gitt avsluttet og opprettet datoer', () => {
    const behandlinger = [
      {
        opprettet: '2019-08-13T13:32:57',
        avsluttet: '2019-08-13T13:32:57',
      },
      {
        opprettet: '2019-08-14T13:32:57',
      },
      {
        opprettet: '2019-03-13T13:32:57',
        avsluttet: '2019-09-13T13:32:57',
      },
      {
        opprettet: '2019-08-13T13:32:57',
      },
    ] as Behandling[];

    const sorterteBehandlinger = sortBehandlinger(behandlinger);

    expect(sorterteBehandlinger).toEqual([
      {
        opprettet: '2019-08-14T13:32:57',
      },
      {
        opprettet: '2019-08-13T13:32:57',
      },
      {
        opprettet: '2019-03-13T13:32:57',
        avsluttet: '2019-09-13T13:32:57',
      },
      {
        opprettet: '2019-08-13T13:32:57',
        avsluttet: '2019-08-13T13:32:57',
      },
    ]);
  });

  it('skal filtrere søknadsperioder med kontroll av inntekt som årsak', () => {
    const søknadsperioderData = {
      id: 3000005,
      perioder: [
        {
          fom: '2025-07-01',
          tom: '2025-07-31',
        },
        {
          fom: '2025-08-01',
          tom: '2025-08-31',
        },
        {
          fom: '2025-06-01',
          tom: '2025-06-30',
        },
        {
          fom: '2025-05-14',
          tom: '2025-05-31',
        },
        {
          fom: '2025-09-01',
          tom: '9999-12-31',
        },
      ],
      perioderMedÅrsak: [
        {
          periode: {
            fom: '2025-05-14',
            tom: '2025-05-31',
          },
          årsaker: [UngÅrsakTilVurdering.FØRSTEGANGSVURDERING],
        },
        {
          periode: {
            fom: '2025-06-01',
            tom: '2025-06-30',
          },
          årsaker: [UngÅrsakTilVurdering.KONTROLL_AV_INNTEKT, UngÅrsakTilVurdering.FØRSTEGANGSVURDERING],
        },
        {
          periode: {
            fom: '2025-07-01',
            tom: '2025-07-31',
          },
          årsaker: [UngÅrsakTilVurdering.KONTROLL_AV_INNTEKT, UngÅrsakTilVurdering.FØRSTEGANGSVURDERING],
        },
        {
          periode: {
            fom: '2025-08-01',
            tom: '2025-08-31',
          },
          årsaker: [UngÅrsakTilVurdering.KONTROLL_AV_INNTEKT, UngÅrsakTilVurdering.FØRSTEGANGSVURDERING],
        },
        {
          periode: {
            fom: '2025-09-01',
            tom: '9999-12-31',
          },
          årsaker: [UngÅrsakTilVurdering.FØRSTEGANGSVURDERING],
        },
      ],
    };
    const result = filterPerioderForKontrollAvInntekt(søknadsperioderData);
    expect(result).toEqual([
      { fom: '2025-06-01', tom: '2025-06-30' },
      { fom: '2025-07-01', tom: '2025-07-31' },
      { fom: '2025-08-01', tom: '2025-08-31' },
    ]);
  });
});
