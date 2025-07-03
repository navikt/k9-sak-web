import { BeregningReferanse } from '@k9-sak-web/types';
import {
  VilkårMedPerioderDto,
  VilkårMedPerioderDtoVilkarType,
  VilkårPeriodeDtoMerknad,
  VilkårPeriodeDtoVilkarStatus,
} from '@navikt/k9-sak-typescript-client';
import { describe, expect, it } from 'vitest';
import mapVilkar from '../VilkarMapper';

describe('VilkarMapper', () => {
  describe('mapVilkar', () => {
    it('maps vilkar with all properties correctly', () => {
      const beregningreferanser: BeregningReferanse[] = [
        {
          skjæringstidspunkt: '2025-01-01',
          referanse: 'ref-1',
          erForlengelse: true,
        },
        {
          skjæringstidspunkt: '2025-02-01',
          referanse: 'ref-2',
          erForlengelse: false,
        },
      ];

      const vilkar: VilkårMedPerioderDto = {
        vilkarType: VilkårMedPerioderDtoVilkarType.OMSORGEN_FOR,
        overstyrbar: true,
        perioder: [
          {
            avslagKode: undefined,
            begrunnelse: 'Test begrunnelse 1',
            vurderesIBehandlingen: true,
            merknad: VilkårPeriodeDtoMerknad.UDEFINERT,
            merknadParametere: { param1: 'value1' },
            periode: { fom: '2025-01-01', tom: '2025-01-31' },
            vilkarStatus: 'OPPFYLT',
          },
          {
            avslagKode: 'AVSLAG_1',
            begrunnelse: 'Test begrunnelse 2',
            vurderesIBehandlingen: false,
            merknad: VilkårPeriodeDtoMerknad.UDEFINERT,
            merknadParametere: { param2: 'value2' },
            periode: { fom: '2025-02-01', tom: '2025-02-28' },
            vilkarStatus: 'IKKE_OPPFYLT',
          },
        ],
        relevanteInnvilgetMerknader: [],
      };

      const result = mapVilkar(vilkar, beregningreferanser);

      expect(result).toEqual({
        vilkarType: VilkårMedPerioderDtoVilkarType.OMSORGEN_FOR,
        overstyrbar: true,
        perioder: [
          {
            avslagKode: undefined,
            begrunnelse: 'Test begrunnelse 1',
            vurderesIBehandlingen: true,
            merknad: '-',
            merknadParametere: { param1: 'value1' },
            periode: { fom: '2025-01-01', tom: '2025-01-31' },
            vilkarStatus: 'OPPFYLT',
            erForlengelse: true,
          },
          {
            avslagKode: 'AVSLAG_1',
            begrunnelse: 'Test begrunnelse 2',
            vurderesIBehandlingen: false,
            merknad: '-',
            merknadParametere: { param2: 'value2' },
            periode: { fom: '2025-02-01', tom: '2025-02-28' },
            vilkarStatus: 'IKKE_OPPFYLT',
            erForlengelse: false,
          },
        ],
      });
    });

    it('handles missing beregning reference correctly', () => {
      const beregningreferanser: BeregningReferanse[] = [
        {
          skjæringstidspunkt: '2025-01-01',
          erForlengelse: true,
          referanse: '',
        },
      ];

      const vilkar: VilkårMedPerioderDto = {
        vilkarType: VilkårMedPerioderDtoVilkarType.MEDLEMSKAPSVILKÅRET,
        overstyrbar: false,
        perioder: [
          {
            avslagKode: undefined,
            begrunnelse: 'Test begrunnelse',
            vurderesIBehandlingen: true,
            merknad: undefined,
            merknadParametere: {},
            periode: { fom: '2025-03-01', tom: '2025-03-31' }, // No matching reference
            vilkarStatus: 'OPPFYLT',
          },
        ],
        relevanteInnvilgetMerknader: [],
      };

      const result = mapVilkar(vilkar, beregningreferanser);

      expect(result.perioder[0].erForlengelse).toBeUndefined();
    });

    it('handles empty beregning references array', () => {
      const beregningreferanser: BeregningReferanse[] = [];

      const vilkar: VilkårMedPerioderDto = {
        vilkarType: VilkårMedPerioderDtoVilkarType.ALDERSVILKÅR,
        overstyrbar: true,
        perioder: [
          {
            avslagKode: undefined,
            begrunnelse: 'Test begrunnelse',
            vurderesIBehandlingen: true,
            merknad: VilkårPeriodeDtoMerknad.UDEFINERT,
            merknadParametere: {},
            periode: { fom: '2025-01-01', tom: '2025-01-31' },
            vilkarStatus: 'OPPFYLT',
          },
        ],
        relevanteInnvilgetMerknader: [],
      };

      const result = mapVilkar(vilkar, beregningreferanser);

      expect(result.perioder[0].erForlengelse).toBeUndefined();
    });

    it('handles empty perioder array', () => {
      const beregningreferanser: BeregningReferanse[] = [
        {
          skjæringstidspunkt: '2025-01-01',
          erForlengelse: true,
          referanse: '',
        },
      ];

      const vilkar: VilkårMedPerioderDto = {
        vilkarType: VilkårMedPerioderDtoVilkarType.MEDISINSKEVILKÅR_UNDER_18_ÅR,
        overstyrbar: false,
        perioder: [],
        relevanteInnvilgetMerknader: [],
      };

      const result = mapVilkar(vilkar, beregningreferanser);

      expect(result.perioder).toEqual([]);
    });

    it('handles multiple periods with same skjæringstidspunkt', () => {
      const beregningreferanser: BeregningReferanse[] = [
        {
          skjæringstidspunkt: '2025-01-01',
          erForlengelse: true,
          referanse: '',
        },
      ];

      const vilkar: VilkårMedPerioderDto = {
        vilkarType: VilkårMedPerioderDtoVilkarType.MEDISINSKEVILKÅR_UNDER_18_ÅR,
        overstyrbar: true,
        perioder: [
          {
            avslagKode: undefined,
            begrunnelse: 'Test begrunnelse 1',
            vurderesIBehandlingen: true,
            merknad: VilkårPeriodeDtoMerknad.UDEFINERT,
            merknadParametere: {},
            periode: { fom: '2025-01-01', tom: '2025-01-15' },
            vilkarStatus: 'OPPFYLT',
          },
          {
            avslagKode: undefined,
            begrunnelse: 'Test begrunnelse 2',
            vurderesIBehandlingen: true,
            merknad: VilkårPeriodeDtoMerknad.UDEFINERT,
            merknadParametere: {},
            periode: { fom: '2025-01-01', tom: '2025-01-31' },
            vilkarStatus: 'OPPFYLT',
          },
        ],
        relevanteInnvilgetMerknader: [],
      };

      const result = mapVilkar(vilkar, beregningreferanser);

      expect(result.perioder[0].erForlengelse).toBe(true);
      expect(result.perioder[1].erForlengelse).toBe(true);
    });

    it('preserves all original period properties', () => {
      const beregningreferanser: BeregningReferanse[] = [];

      const vilkar: VilkårMedPerioderDto = {
        vilkarType: VilkårMedPerioderDtoVilkarType.MEDISINSKEVILKÅR_UNDER_18_ÅR,
        overstyrbar: false,
        perioder: [
          {
            avslagKode: 'CUSTOM_AVSLAG',
            begrunnelse: 'Custom begrunnelse with special characters: æøå',
            vurderesIBehandlingen: false,
            merknad: VilkårPeriodeDtoMerknad.UDEFINERT,
            merknadParametere: {
              complexParam: 'test',
              arrayParam: '123',
              nullParam: 'null',
            },
            periode: { fom: '2025-12-01', tom: '2025-12-31' },
            vilkarStatus: 'IKKE_VURDERT',
          },
        ],
        relevanteInnvilgetMerknader: [],
      };

      const result = mapVilkar(vilkar, beregningreferanser);

      const periode = result.perioder[0];
      expect(periode.avslagKode).toBe('CUSTOM_AVSLAG');
      expect(periode.begrunnelse).toBe('Custom begrunnelse with special characters: æøå');
      expect(periode.vurderesIBehandlingen).toBe(false);
      expect(periode.merknad).toBe(VilkårPeriodeDtoMerknad.UDEFINERT);
      expect(periode.merknadParametere).toEqual({
        complexParam: 'test',
        arrayParam: '123',
        nullParam: 'null',
      });
      expect(periode.periode).toEqual({ fom: '2025-12-01', tom: '2025-12-31' });
      expect(periode.vilkarStatus).toBe('IKKE_VURDERT');
    });

    it('handles null and undefined values correctly', () => {
      const beregningreferanser: BeregningReferanse[] = [
        {
          skjæringstidspunkt: '2025-01-01',
          erForlengelse: false,
          referanse: '',
        },
      ];

      const vilkar: VilkårMedPerioderDto = {
        vilkarType: VilkårMedPerioderDtoVilkarType.UDEFINERT,
        overstyrbar: undefined,
        perioder: [
          {
            avslagKode: undefined,
            begrunnelse: '',
            vurderesIBehandlingen: undefined,
            merknad: undefined,
            periode: { fom: '2025-01-01', tom: '2025-01-31' },
            vilkarStatus: VilkårPeriodeDtoVilkarStatus.UDEFINERT,
          },
        ],
        relevanteInnvilgetMerknader: [],
      };

      const result = mapVilkar(vilkar, beregningreferanser);

      expect(result.vilkarType).toEqual('-');
      expect(result.overstyrbar).toBeUndefined();
      const periode = result.perioder[0];
      expect(periode.avslagKode).toBeUndefined();
      expect(periode.begrunnelse).toEqual('');
      expect(periode.vurderesIBehandlingen).toBeUndefined();
      expect(periode.merknad).toBeUndefined();
      expect(periode.merknadParametere).toBeUndefined();
      expect(periode.vilkarStatus).toEqual(VilkårPeriodeDtoVilkarStatus.UDEFINERT);
      expect(periode.erForlengelse).toBe(false);
    });
  });

  describe('erForlengelse helper function', () => {
    // Note: Since erForlengelse is not exported, we test it indirectly through mapVilkar

    it('finds correct beregning reference by skjæringstidspunkt', () => {
      const beregningreferanser: BeregningReferanse[] = [
        {
          skjæringstidspunkt: '2025-01-01',
          erForlengelse: true,
          referanse: '',
        },
        {
          skjæringstidspunkt: '2025-02-01',
          erForlengelse: false,
          referanse: '',
        },
        {
          skjæringstidspunkt: '2025-03-01',
          erForlengelse: true,
          referanse: '',
        },
      ];

      const vilkar: VilkårMedPerioderDto = {
        vilkarType: VilkårMedPerioderDtoVilkarType.MEDISINSKEVILKÅR_UNDER_18_ÅR,
        overstyrbar: true,
        perioder: [
          {
            avslagKode: undefined,
            begrunnelse: 'Test',
            vurderesIBehandlingen: true,
            merknad: undefined,
            merknadParametere: {},
            periode: { fom: '2025-02-01', tom: '2025-02-28' },
            vilkarStatus: 'OPPFYLT',
          },
        ],
        relevanteInnvilgetMerknader: [],
      };

      const result = mapVilkar(vilkar, beregningreferanser);

      expect(result.perioder[0].erForlengelse).toBe(false);
    });

    it('returns undefined when no matching skjæringstidspunkt found', () => {
      const beregningreferanser: BeregningReferanse[] = [
        {
          skjæringstidspunkt: '2025-01-01',
          erForlengelse: true,
          referanse: '',
        },
      ];

      const vilkar: VilkårMedPerioderDto = {
        vilkarType: VilkårMedPerioderDtoVilkarType.MEDISINSKEVILKÅR_UNDER_18_ÅR,
        overstyrbar: true,
        perioder: [
          {
            avslagKode: undefined,
            begrunnelse: 'Test',
            vurderesIBehandlingen: true,
            merknad: undefined,
            merknadParametere: {},
            periode: { fom: '2025-06-01', tom: '2025-06-30' },
            vilkarStatus: 'OPPFYLT',
          },
        ],
        relevanteInnvilgetMerknader: [],
      };

      const result = mapVilkar(vilkar, beregningreferanser);

      expect(result.perioder[0].erForlengelse).toBeUndefined();
    });

    it('handles erForlengelse being explicitly false', () => {
      const beregningreferanser: BeregningReferanse[] = [
        {
          skjæringstidspunkt: '2025-01-01',
          erForlengelse: false,
          referanse: '',
        },
      ];

      const vilkar: VilkårMedPerioderDto = {
        vilkarType: VilkårMedPerioderDtoVilkarType.MEDISINSKEVILKÅR_UNDER_18_ÅR,
        overstyrbar: true,
        perioder: [
          {
            avslagKode: undefined,
            begrunnelse: 'Test',
            vurderesIBehandlingen: true,
            merknad: undefined,
            merknadParametere: {},
            periode: { fom: '2025-01-01', tom: '2025-01-31' },
            vilkarStatus: 'OPPFYLT',
          },
        ],
        relevanteInnvilgetMerknader: [],
      };

      const result = mapVilkar(vilkar, beregningreferanser);

      expect(result.perioder[0].erForlengelse).toBe(false);
    });
  });

  describe('edge cases', () => {
    it('handles vilkar with undefined properties', () => {
      const beregningreferanser: BeregningReferanse[] = [];

      const vilkar = {} as VilkårMedPerioderDto;

      expect(() => mapVilkar(vilkar, beregningreferanser)).toThrow();
    });

    it('handles large number of periods and references', () => {
      const beregningreferanser: BeregningReferanse[] = Array.from({ length: 100 }, (_, i) => ({
        skjæringstidspunkt: `2025-${String(i + 1).padStart(2, '0')}-01`,
        erForlengelse: i % 2 === 0,
        referanse: '',
      }));

      const vilkar: VilkårMedPerioderDto = {
        vilkarType: VilkårMedPerioderDtoVilkarType.MEDISINSKEVILKÅR_UNDER_18_ÅR,
        overstyrbar: true,
        perioder: Array.from({ length: 50 }, (_, i) => ({
          avslagKode: undefined,
          begrunnelse: `Begrunnelse ${i}`,
          vurderesIBehandlingen: true,
          merknad: undefined,
          merknadParametere: {},
          periode: {
            fom: `2025-${String(i + 1).padStart(2, '0')}-01`,
            tom: `2025-${String(i + 1).padStart(2, '0')}-28`,
          },
          vilkarStatus: 'OPPFYLT',
        })),
        relevanteInnvilgetMerknader: [],
      };

      const result = mapVilkar(vilkar, beregningreferanser);

      expect(result.perioder).toHaveLength(50);
      expect(result.perioder[0].erForlengelse).toBe(true); // Even index (0)
      expect(result.perioder[1].erForlengelse).toBe(false); // Odd index (1)
    });
  });
});
