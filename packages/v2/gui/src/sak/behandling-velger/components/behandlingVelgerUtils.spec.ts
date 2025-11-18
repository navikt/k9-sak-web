import { ung_sak_kontrakt_krav_ÅrsakTilVurdering as UngÅrsakTilVurdering } from '@k9-sak-web/backend/ungsak/generated/types.js';
import type { Behandling } from '../types/Behandling';
import { filterPerioderForKontrollAvInntekt, sortBehandlinger } from './behandlingVelgerUtils';

describe('<BehandlingPicker>', () => {
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
