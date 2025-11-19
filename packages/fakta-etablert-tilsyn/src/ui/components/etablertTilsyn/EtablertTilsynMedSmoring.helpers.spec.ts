import { Period } from '@fpsak-frontend/utils';
import { describe, expect, it } from 'vitest';
import EtablertTilsynType from '../../../types/EtablertTilsynType';
import Kilde from '../../../types/Kilde';
import {
  byggDagerSomOverstyrerTilsyn,
  byggDagerSomSkalEkskluderes,
  byggOppdeltSmoring,
  ekspanderTilEnkeltdager,
  erHelg,
  finnUker,
  flettOgSorterTilsyn,
  grupperTilsynPerUke,
  splittSmurtePerioder,
} from './EtablertTilsynMedSmoring';

// Rå test-builder som unngår beregnDagerTimer-transformasjon i klassen
// Vi trenger kun shape: { periode: Period; tidPerDag: number; kilde: Kilde }
const lagTilsyn = (fom: string, tom: string, tidPerDag: number, kilde: Kilde): EtablertTilsynType => {
  return { periode: new Period(fom, tom), tidPerDag, kilde } as unknown as EtablertTilsynType;
};

describe('EtablertTilsynMedSmoring helpers', () => {
  it('byggDagerSomOverstyrerTilsyn lager sett med alle dager', () => {
    const p1 = new Period('2024-01-01', '2024-01-02');
    const p2 = new Period('2024-01-05', '2024-01-05');
    const set = byggDagerSomOverstyrerTilsyn([p1, p2]);
    expect(Array.from(set)).toEqual(['2024-01-01', '2024-01-02', '2024-01-05']);
  });

  it('byggDagerSomSkalEkskluderes ekskluderer kun sykdomsdager som ikke er overstyrt', () => {
    const overstyrer = byggDagerSomOverstyrerTilsyn([new Period('2024-02-01', '2024-02-02')]);
    const sykdom = [new Period('2024-02-01', '2024-02-03')];
    const ekskluderes = byggDagerSomSkalEkskluderes(sykdom, overstyrer);
    expect(Array.from(ekskluderes)).toEqual(['2024-02-03']); // 1 og 2 overstyrt, 3 ikke
  });

  it('ekspanderTilEnkeltdager ekspanderer og filtrerer bort helg', () => {
    const tilsyn = [lagTilsyn('2024-03-01', '2024-03-04', 5, Kilde.SØKER)]; // 1 fre, 2 lør, 3 søn, 4 man
    const enkeltdager = ekspanderTilEnkeltdager(tilsyn, d => !erHelg(d));
    expect(enkeltdager.map(e => e.periode.fom)).toEqual(['2024-03-01', '2024-03-04']);
    expect(enkeltdager.every(e => e.periode.fom === e.periode.tom)).toBe(true);
  });

  it('finnUker returnerer unike uker i kronologisk rekkefølge', () => {
    const tilsyn = [
      lagTilsyn('2024-01-02', '2024-01-02', 5, Kilde.SØKER), // uke 1 (antatt ISO)
      lagTilsyn('2024-01-10', '2024-01-10', 5, Kilde.SØKER), // uke 2
      lagTilsyn('2024-01-11', '2024-01-11', 5, Kilde.SØKER), // uke 2
    ];
    const uker = finnUker(tilsyn);
    expect(uker).toEqual([1, 2]);
  });

  it('grupperTilsynPerUke grupperer riktig', () => {
    const etablert = [
      lagTilsyn('2024-01-02', '2024-01-02', 5, Kilde.SØKER),
      lagTilsyn('2024-01-10', '2024-01-10', 5, Kilde.ANDRE),
    ];
    const smurt = [
      lagTilsyn('2024-01-02', '2024-01-02', 4, Kilde.SØKER),
      lagTilsyn('2024-01-10', '2024-01-10', 6, Kilde.ANDRE),
    ];
    const uker = finnUker(etablert);
    const grupper = grupperTilsynPerUke(uker, etablert, smurt);
    expect(grupper.length).toBe(2);
    expect(grupper[0].uke).toBe(1);
    expect(grupper[0].etablertTilsyn[0].periode.fom).toBe('2024-01-02');
    expect(grupper[1].uke).toBe(2);
  });

  it('splittSmurtePerioder deler i sammenhengende blokker og skiller på hull / tidPerDag', () => {
    const smurt = [
      lagTilsyn('2024-04-01', '2024-04-01', 3, Kilde.SØKER),
      lagTilsyn('2024-04-02', '2024-04-02', 3, Kilde.SØKER), // sammenhengende -> same gruppe
      lagTilsyn('2024-04-04', '2024-04-04', 3, Kilde.SØKER), // hull -> ny gruppe
      lagTilsyn('2024-04-05', '2024-04-05', 4, Kilde.SØKER), // ny tidPerDag -> ny gruppe
      lagTilsyn('2024-04-06', '2024-04-06', 4, Kilde.SØKER), // helg, blir med i samme gruppe
    ];
    const grupper = splittSmurtePerioder(smurt);
    expect(grupper.length).toBe(3);
    expect(grupper[0].map(g => g.periode.fom)).toEqual(['2024-04-01', '2024-04-02']);
    expect(grupper[1].map(g => g.periode.fom)).toEqual(['2024-04-04']);
    expect(grupper[2].map(g => g.periode.fom)).toEqual(['2024-04-05', '2024-04-06']);
  });

  it('byggOppdeltSmoring lager delAvUke når flere blokker i samme uke', () => {
    const ukeGrupper = [
      {
        etablertTilsyn: [lagTilsyn('2024-05-01', '2024-05-01', 5, Kilde.SØKER)],
        etablertTilsynSmurt: [
          lagTilsyn('2024-05-01', '2024-05-01', 3, Kilde.SØKER),
          lagTilsyn('2024-05-03', '2024-05-03', 3, Kilde.SØKER), // hull -> ny gruppe
        ],
        uke: 18,
      },
    ];
    const oppdelt = byggOppdeltSmoring(ukeGrupper);
    expect(oppdelt.length).toBe(2);
    expect(oppdelt.map(o => o.delAvUke)).toEqual([1, 2]);
  });

  it('flettOgSorterTilsyn fletter og sorterer kronologisk', () => {
    const perUke = [
      {
        etablertTilsyn: [lagTilsyn('2024-06-10', '2024-06-10', 5, Kilde.SØKER)],
        etablertTilsynSmurt: [lagTilsyn('2024-06-10', '2024-06-10', 3, Kilde.SØKER)],
        uke: 24,
      },
      {
        etablertTilsyn: [lagTilsyn('2024-06-01', '2024-06-01', 5, Kilde.SØKER)],
        etablertTilsynSmurt: [lagTilsyn('2024-06-01', '2024-06-01', 3, Kilde.SØKER)],
        uke: 23,
      },
    ];
    const oppdelt = byggOppdeltSmoring(perUke);
    const flettet = flettOgSorterTilsyn(perUke, oppdelt);
    expect(flettet[0].etablertTilsynSmurt[0].periode.fom).toBe('2024-06-01');
    expect(flettet[1].etablertTilsynSmurt[0].periode.fom).toBe('2024-06-10');
  });

  it('flettOgSorterTilsyn håndterer oppdelt smøring og enkel uke etterpå', () => {
    const perUke = [
      {
        etablertTilsyn: [lagTilsyn('2024-07-01', '2024-07-01', 5, Kilde.SØKER)],
        etablertTilsynSmurt: [
          lagTilsyn('2024-07-01', '2024-07-01', 3, Kilde.SØKER),
          lagTilsyn('2024-07-03', '2024-07-03', 3, Kilde.SØKER), // hull -> egen gruppe
        ],
        uke: 27,
      },
      {
        etablertTilsyn: [lagTilsyn('2024-07-08', '2024-07-08', 5, Kilde.SØKER)],
        etablertTilsynSmurt: [lagTilsyn('2024-07-08', '2024-07-08', 3, Kilde.SØKER)],
        uke: 28,
      },
    ];
    const oppdelt = byggOppdeltSmoring(perUke);
    const flettet = flettOgSorterTilsyn(perUke, oppdelt);
    const fomRekkefolge = flettet.map(f => f.etablertTilsynSmurt[0].periode.fom);
    expect(fomRekkefolge).toEqual(['2024-07-01', '2024-07-03', '2024-07-08']);
    expect(flettet[0].delAvUke).toBe(1);
    expect(flettet[1].delAvUke).toBe(2);
    expect(flettet[2].delAvUke).toBeUndefined();
  });
});
