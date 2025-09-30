import { describe, it, expect } from 'vitest';
import lagUttaksperiodeliste from './uttaksperioder';
import { YYYYMMDD_DATE_FORMAT } from '@k9-sak-web/lib/dateUtils/formats.js';
import dayjs from 'dayjs';

const key = (fom: string, tom: string) => `${fom}/${tom}`;

describe('lagUttaksperiodeliste', () => {
  it('returnerer perioder i reversert kronologisk rekkefølge', () => {
    const perioder = {
      [key('2024-01-01', '2024-01-07')]: { some: 'a' },
      [key('2024-02-01', '2024-02-07')]: { some: 'b' },
      [key('2024-03-01', '2024-03-07')]: { some: 'c' },
    } as any;
    const liste = lagUttaksperiodeliste(perioder);
    const fomDatoer = liste.map(p => p.periode.fom);
    expect(fomDatoer).toEqual(['2024-03-01', '2024-02-01', '2024-01-01']);
  });

  it('markerer opphold mellom ikke-kontinuerlige uker', () => {
    const perioder = {
      [key('2024-01-01', '2024-01-07')]: {},
      [key('2024-01-15', '2024-01-21')]: {},
    } as any;
    const liste = lagUttaksperiodeliste(perioder);
    const første = liste.find(p => p.periode.fom === '2024-01-01');
    expect(første?.harOppholdTilNestePeriode).toBe(true);
  });

  it('setter ikke opphold når perioder er kant i kant (sammenhengende uker)', () => {
    const perioder = {
      [key('2024-01-01', '2024-01-07')]: {}, // uke 1
      [key('2024-01-08', '2024-01-14')]: {}, // uke 2
    } as any;
    const liste = lagUttaksperiodeliste(perioder);
    const earlier = liste.find(p => p.periode.fom === '2024-01-01');
    expect(earlier?.harOppholdTilNestePeriode).toBe(false);
  });

  it('håndterer årsskifte for uke-sammenheng', () => {
    const lastWeek = dayjs('2024-12-30');
    const nextYear = dayjs('2025-01-06');
    const perioder = {
      [key(lastWeek.format(YYYYMMDD_DATE_FORMAT), lastWeek.add(6, 'day').format(YYYYMMDD_DATE_FORMAT))]: {},
      [key(nextYear.format(YYYYMMDD_DATE_FORMAT), nextYear.add(6, 'day').format(YYYYMMDD_DATE_FORMAT))]: {},
    } as any;
    const liste = lagUttaksperiodeliste(perioder);
    const earlier = liste.find(p => p.periode.fom === lastWeek.format(YYYYMMDD_DATE_FORMAT));
    expect(earlier?.harOppholdTilNestePeriode).toBe(false);
  });
});
