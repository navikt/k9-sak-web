import type { Behandling } from '../types/Behandling';
import { sortBehandlinger } from './behandlingVelgerUtils';

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
});
