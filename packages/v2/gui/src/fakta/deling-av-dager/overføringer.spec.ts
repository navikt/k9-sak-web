import type { RammevedtakDto } from '@k9-sak-web/backend/k9sak/kontrakt/omsorgspenger/RammevedtakDto.js';
import { describe, expect, it } from 'vitest';
import { grupperOverføringer } from './overføringer.js';

const avsender = '02028920544';
const mottaker = '03058945104';

const fårRammevedtak = (
  type: 'OverføringFår' | 'FordelingFår' | 'KoronaOverføringFår',
  lengde: string,
): RammevedtakDto => ({ type, lengde, avsender, gyldigFraOgMed: '2020-01-01', gyldigTilOgMed: '2020-12-31' });

const girRammevedtak = (
  type: 'OverføringGir' | 'FordelingGir' | 'KoronaOverføringGir',
  lengde: string,
): RammevedtakDto => ({ type, lengde, mottaker, gyldigFraOgMed: '2019-01-01', gyldigTilOgMed: '2019-12-31' });

describe('grupperOverføringer', () => {
  it('grupperer rammevedtak per retning og type', () => {
    const grupper = grupperOverføringer([
      fårRammevedtak('OverføringFår', 'P1D'),
      fårRammevedtak('FordelingFår', 'P2D'),
      fårRammevedtak('KoronaOverføringFår', 'P3D'),
      girRammevedtak('OverføringGir', 'P4D'),
      girRammevedtak('FordelingGir', 'P5D'),
      girRammevedtak('KoronaOverføringGir', 'P6D'),
    ]);

    expect(grupper.map(({ retning, type, totaltAntallDager }) => [retning, type, totaltAntallDager])).toEqual([
      ['inn', 'fordeling', 2],
      ['inn', 'overføring', 1],
      ['inn', 'koronaoverføring', 3],
      ['ut', 'fordeling', 5],
      ['ut', 'overføring', 4],
      ['ut', 'koronaoverføring', 6],
    ]);
    expect(grupper[1]!.overføringer).toEqual([
      { antallDager: 1, mottakerAvsenderFnr: avsender, fom: '2020-01-01', tom: '2020-12-31' },
    ]);
    expect(grupper[4]!.overføringer).toEqual([
      { antallDager: 4, mottakerAvsenderFnr: mottaker, fom: '2019-01-01', tom: '2019-12-31' },
    ]);
  });

  it('summerer flere overføringer av samme type', () => {
    const grupper = grupperOverføringer([
      fårRammevedtak('OverføringFår', 'P4D'),
      fårRammevedtak('OverføringFår', 'P7D'),
    ]);

    expect(grupper.find(g => g.retning === 'inn' && g.type === 'overføring')?.totaltAntallDager).toBe(11);
  });

  it('ignorerer rammevedtak som ikke er overføringer eller fordelinger', () => {
    const grupper = grupperOverføringer([{ type: 'Smittevern', lengde: 'P10D' }]);

    expect(grupper.every(g => g.overføringer.length === 0)).toBe(true);
  });
});
