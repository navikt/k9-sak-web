import { Period } from '@fpsak-frontend/utils';
import { describe, expect, it } from 'vitest';
import type EtablertTilsynType from '../../../types/EtablertTilsynType';
import Kilde from '../../../types/Kilde';
import { mapDagerPerUkedag, mapSmurtDagerPerUkedag } from './EtablertTilsynRowContent';

describe('EtablertTilsynRowContent - ukedagslogikk', () => {
  describe('mapDagerPerUkedag', () => {
    it('skal mappe en hel uke korrekt', () => {
      const etablertTilsyn: EtablertTilsynType[] = [
        {
          periode: new Period('2023-01-02', '2023-01-06'), // Mandag til fredag
          tidPerDag: 5,
          kilde: Kilde.SØKER,
        },
      ];

      const result = mapDagerPerUkedag(etablertTilsyn);

      expect(result.get(1)).toEqual({ date: '2023-01-02', tidPerDag: 5, kilde: Kilde.SØKER });
      expect(result.get(2)).toEqual({ date: '2023-01-03', tidPerDag: 5, kilde: Kilde.SØKER });
      expect(result.get(3)).toEqual({ date: '2023-01-04', tidPerDag: 5, kilde: Kilde.SØKER });
      expect(result.get(4)).toEqual({ date: '2023-01-05', tidPerDag: 5, kilde: Kilde.SØKER });
      expect(result.get(5)).toEqual({ date: '2023-01-06', tidPerDag: 5, kilde: Kilde.SØKER });
    });

    it('skal håndtere kun mandag og fredag', () => {
      const etablertTilsyn: EtablertTilsynType[] = [
        {
          periode: new Period('2023-01-02', '2023-01-02'), // Mandag
          tidPerDag: 3,
          kilde: Kilde.SØKER,
        },
        {
          periode: new Period('2023-01-06', '2023-01-06'), // Fredag
          tidPerDag: 5,
          kilde: Kilde.ANDRE,
        },
      ];

      const result = mapDagerPerUkedag(etablertTilsyn);

      expect(result.get(1)).toEqual({ date: '2023-01-02', tidPerDag: 3, kilde: Kilde.SØKER });
      expect(result.get(2)).toBeUndefined();
      expect(result.get(3)).toBeUndefined();
      expect(result.get(4)).toBeUndefined();
      expect(result.get(5)).toEqual({ date: '2023-01-06', tidPerDag: 5, kilde: Kilde.ANDRE });
    });

    it('skal ignorere helgedager', () => {
      const etablertTilsyn: EtablertTilsynType[] = [
        {
          periode: new Period('2023-01-07', '2023-01-08'), // Lørdag til søndag
          tidPerDag: 5,
          kilde: Kilde.SØKER,
        },
      ];

      const result = mapDagerPerUkedag(etablertTilsyn);

      expect(result.get(1)).toBeUndefined();
      expect(result.get(2)).toBeUndefined();
      expect(result.get(3)).toBeUndefined();
      expect(result.get(4)).toBeUndefined();
      expect(result.get(5)).toBeUndefined();
    });

    it('skal overskrive med siste verdi når samme ukedag forekommer flere ganger', () => {
      const etablertTilsyn: EtablertTilsynType[] = [
        {
          periode: new Period('2023-01-02', '2023-01-02'), // Mandag
          tidPerDag: 3,
          kilde: Kilde.SØKER,
        },
        {
          periode: new Period('2023-01-02', '2023-01-02'), // Samme mandag
          tidPerDag: 5,
          kilde: Kilde.ANDRE,
        },
      ];

      const result = mapDagerPerUkedag(etablertTilsyn);

      // Skal ha siste verdi
      expect(result.get(1)).toEqual({ date: '2023-01-02', tidPerDag: 5, kilde: Kilde.ANDRE });
    });

    it('skal håndtere tom array', () => {
      const result = mapDagerPerUkedag([]);

      expect(result.get(1)).toBeUndefined();
      expect(result.get(2)).toBeUndefined();
      expect(result.get(3)).toBeUndefined();
      expect(result.get(4)).toBeUndefined();
      expect(result.get(5)).toBeUndefined();
    });
  });

  describe('mapSmurtDagerPerUkedag', () => {
    it('skal mappe smurte dager korrekt', () => {
      const etablertTilsynSmurt: EtablertTilsynType[] = [
        {
          periode: new Period('2023-01-02', '2023-01-04'), // Man-ons
          tidPerDag: 4.5,
          kilde: Kilde.SØKER,
        },
      ];

      const result = mapSmurtDagerPerUkedag(etablertTilsynSmurt);

      expect(result.get(1)).toEqual({ date: '2023-01-02', tidPerDag: 4.5 });
      expect(result.get(2)).toEqual({ date: '2023-01-03', tidPerDag: 4.5 });
      expect(result.get(3)).toEqual({ date: '2023-01-04', tidPerDag: 4.5 });
      expect(result.get(4)).toBeUndefined();
      expect(result.get(5)).toBeUndefined();
    });

    it('skal håndtere tom array', () => {
      const result = mapSmurtDagerPerUkedag([]);

      expect(result.get(1)).toBeUndefined();
      expect(result.get(2)).toBeUndefined();
      expect(result.get(3)).toBeUndefined();
      expect(result.get(4)).toBeUndefined();
      expect(result.get(5)).toBeUndefined();
    });

    it('skal håndtere periode over flere uker', () => {
      const etablertTilsynSmurt: EtablertTilsynType[] = [
        {
          periode: new Period('2023-01-02', '2023-01-06'), // Man-fre
          tidPerDag: 3.5,
          kilde: Kilde.SØKER,
        },
        {
          periode: new Period('2023-01-09', '2023-01-13'), // Man-fre neste uke
          tidPerDag: 4.0,
          kilde: Kilde.ANDRE,
        },
      ];

      const result = mapSmurtDagerPerUkedag(etablertTilsynSmurt);

      // Skal ha siste verdier for hver ukedag
      expect(result.get(1)?.tidPerDag).toBe(4.0);
      expect(result.get(2)?.tidPerDag).toBe(4.0);
      expect(result.get(3)?.tidPerDag).toBe(4.0);
      expect(result.get(4)?.tidPerDag).toBe(4.0);
      expect(result.get(5)?.tidPerDag).toBe(4.0);
    });
  });
});
