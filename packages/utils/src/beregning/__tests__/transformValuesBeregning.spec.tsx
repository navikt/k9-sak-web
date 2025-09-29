import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import beregningAvklaringsbehovCodes from '@fpsak-frontend/kodeverk/src/beregningAvklaringsbehovCodes';
import transformBeregningValues from '../transformValuesBeregning';

describe('transformBeregningValues', () => {
  describe('when processing OVERSTYRING_AV_BEREGNINGSGRUNNLAG', () => {
    it('flattens grunnlag array and maps kode for each item', () => {
      const aksjonspunktData = [
        {
          kode: beregningAvklaringsbehovCodes.OVERSTYRING_AV_BEREGNINGSGRUNNLAG,
          grunnlag: [
            { id: 1, navn: 'Test 1', verdi: 100 },
            { id: 2, navn: 'Test 2', verdi: 200 },
          ],
        },
      ];

      const result = transformBeregningValues(aksjonspunktData);

      expect(result).toEqual([
        {
          kode: aksjonspunktCodes.OVERSTYRING_AV_BEREGNINGSGRUNNLAG,
          id: 1,
          navn: 'Test 1',
          verdi: 100,
        },
        {
          kode: aksjonspunktCodes.OVERSTYRING_AV_BEREGNINGSGRUNNLAG,
          id: 2,
          navn: 'Test 2',
          verdi: 200,
        },
      ]);
    });

    it('returns empty array when grunnlag is empty', () => {
      const aksjonspunktData = [
        {
          kode: beregningAvklaringsbehovCodes.OVERSTYRING_AV_BEREGNINGSGRUNNLAG,
          grunnlag: [],
        },
      ];

      const result = transformBeregningValues(aksjonspunktData);

      expect(result).toEqual([]);
    });

    it('handles multiple items with OVERSTYRING_AV_BEREGNINGSGRUNNLAG', () => {
      const aksjonspunktData = [
        {
          kode: beregningAvklaringsbehovCodes.OVERSTYRING_AV_BEREGNINGSGRUNNLAG,
          grunnlag: [{ id: 1, navn: 'Test 1' }],
        },
        {
          kode: beregningAvklaringsbehovCodes.OVERSTYRING_AV_BEREGNINGSGRUNNLAG,
          grunnlag: [{ id: 2, navn: 'Test 2' }],
        },
      ];

      const result = transformBeregningValues(aksjonspunktData);

      expect(result).toEqual([
        {
          kode: aksjonspunktCodes.OVERSTYRING_AV_BEREGNINGSGRUNNLAG,
          id: 1,
          navn: 'Test 1',
        },
        {
          kode: aksjonspunktCodes.OVERSTYRING_AV_BEREGNINGSGRUNNLAG,
          id: 2,
          navn: 'Test 2',
        },
      ]);
    });
  });

  describe('when processing OVERSTYRING_AV_BEREGNINGSAKTIVITETER', () => {
    it('flattens grunnlag array and maps kode for each item', () => {
      const aksjonspunktData = [
        {
          kode: beregningAvklaringsbehovCodes.OVERSTYRING_AV_BEREGNINGSAKTIVITETER,
          grunnlag: [
            { aktivitet: 'Aktivitet 1', status: 'AKTIV' },
            { aktivitet: 'Aktivitet 2', status: 'INAKTIV' },
          ],
        },
      ];

      const result = transformBeregningValues(aksjonspunktData);

      expect(result).toEqual([
        {
          kode: aksjonspunktCodes.OVERSTYRING_AV_BEREGNINGSAKTIVITETER,
          aktivitet: 'Aktivitet 1',
          status: 'AKTIV',
        },
        {
          kode: aksjonspunktCodes.OVERSTYRING_AV_BEREGNINGSAKTIVITETER,
          aktivitet: 'Aktivitet 2',
          status: 'INAKTIV',
        },
      ]);
    });
  });

  describe('when processing other codes', () => {
    it('transforms single item and maps kode', () => {
      const aksjonspunktData = [
        {
          kode: beregningAvklaringsbehovCodes.FORDEL_BEREGNINGSGRUNNLAG,
          begrunnelse: 'Test begrunnelse',
          data: 'test data',
        },
      ];

      const result = transformBeregningValues(aksjonspunktData);

      expect(result).toEqual([
        {
          kode: aksjonspunktCodes.FORDEL_BEREGNINGSGRUNNLAG,
          begrunnelse: 'Test begrunnelse',
          data: 'test data',
        },
      ]);
    });

    it('preserves all properties except kode which gets mapped', () => {
      const aksjonspunktData = [
        {
          kode: beregningAvklaringsbehovCodes.FORDEL_BEREGNINGSGRUNNLAG,
          begrunnelse: 'Original begrunnelse',
          field1: 'value1',
          field2: { nested: 'object' },
          field3: [1, 2, 3],
        },
      ];

      const result = transformBeregningValues(aksjonspunktData);

      expect(result).toEqual([
        {
          kode: aksjonspunktCodes.FORDEL_BEREGNINGSGRUNNLAG,
          begrunnelse: 'Original begrunnelse',
          field1: 'value1',
          field2: { nested: 'object' },
          field3: [1, 2, 3],
        },
      ]);
    });

    it('does not mutate original data object', () => {
      const originalData = {
        kode: beregningAvklaringsbehovCodes.FORDEL_BEREGNINGSGRUNNLAG,
        begrunnelse: 'Original',
        field: 'value',
      };
      const aksjonspunktData = [originalData];

      transformBeregningValues(aksjonspunktData);

      expect(originalData.kode).toBe(beregningAvklaringsbehovCodes.FORDEL_BEREGNINGSGRUNNLAG);
      expect(originalData.begrunnelse).toBe('Original');
    });
  });

  describe('omitBegrunnelse parameter', () => {
    it('replaces begrunnelse when omitBegrunnelse is true', () => {
      const aksjonspunktData = [
        {
          kode: beregningAvklaringsbehovCodes.FORDEL_BEREGNINGSGRUNNLAG,
          begrunnelse: 'Original begrunnelse',
          data: 'test',
        },
      ];

      const result = transformBeregningValues(aksjonspunktData, true);

      expect(result).toEqual([
        {
          kode: aksjonspunktCodes.FORDEL_BEREGNINGSGRUNNLAG,
          begrunnelse: 'Se i Kalkulus for begrunnelser.',
          data: 'test',
        },
      ]);
    });

    it('preserves original begrunnelse when omitBegrunnelse is false', () => {
      const aksjonspunktData = [
        {
          kode: beregningAvklaringsbehovCodes.FORDEL_BEREGNINGSGRUNNLAG,
          begrunnelse: 'Original begrunnelse',
          data: 'test',
        },
      ];

      const result = transformBeregningValues(aksjonspunktData, false);

      expect(result).toEqual([
        {
          kode: aksjonspunktCodes.FORDEL_BEREGNINGSGRUNNLAG,
          begrunnelse: 'Original begrunnelse',
          data: 'test',
        },
      ]);
    });

    it('preserves original begrunnelse when omitBegrunnelse is undefined', () => {
      const aksjonspunktData = [
        {
          kode: beregningAvklaringsbehovCodes.FORDEL_BEREGNINGSGRUNNLAG,
          begrunnelse: 'Original begrunnelse',
          data: 'test',
        },
      ];

      const result = transformBeregningValues(aksjonspunktData);

      expect(result).toEqual([
        {
          kode: aksjonspunktCodes.FORDEL_BEREGNINGSGRUNNLAG,
          begrunnelse: 'Original begrunnelse',
          data: 'test',
        },
      ]);
    });

    it('does not affect OVERSTYRING codes even when omitBegrunnelse is true', () => {
      const aksjonspunktData = [
        {
          kode: beregningAvklaringsbehovCodes.OVERSTYRING_AV_BEREGNINGSGRUNNLAG,
          grunnlag: [{ id: 1, begrunnelse: 'Grunnlag begrunnelse' }],
        },
      ];

      const result = transformBeregningValues(aksjonspunktData, true);

      expect(result).toEqual([
        {
          kode: aksjonspunktCodes.OVERSTYRING_AV_BEREGNINGSGRUNNLAG,
          id: 1,
          begrunnelse: 'Grunnlag begrunnelse',
        },
      ]);
    });
  });

  describe('mixed data types', () => {
    it('handles mix of OVERSTYRING and other codes', () => {
      const aksjonspunktData = [
        {
          kode: beregningAvklaringsbehovCodes.OVERSTYRING_AV_BEREGNINGSGRUNNLAG,
          grunnlag: [{ id: 1, type: 'grunnlag' }],
        },
        {
          kode: beregningAvklaringsbehovCodes.FORDEL_BEREGNINGSGRUNNLAG,
          begrunnelse: 'Test',
          type: 'standard',
        },
        {
          kode: beregningAvklaringsbehovCodes.OVERSTYRING_AV_BEREGNINGSAKTIVITETER,
          grunnlag: [{ id: 2, type: 'aktivitet' }],
        },
      ];

      const result = transformBeregningValues(aksjonspunktData);

      expect(result).toEqual([
        {
          kode: aksjonspunktCodes.OVERSTYRING_AV_BEREGNINGSGRUNNLAG,
          id: 1,
          type: 'grunnlag',
        },
        {
          kode: aksjonspunktCodes.FORDEL_BEREGNINGSGRUNNLAG,
          begrunnelse: 'Test',
          type: 'standard',
        },
        {
          kode: aksjonspunktCodes.OVERSTYRING_AV_BEREGNINGSAKTIVITETER,
          id: 2,
          type: 'aktivitet',
        },
      ]);
    });
  });

  describe('edge cases', () => {
    it('handles empty input array', () => {
      const result = transformBeregningValues([]);
      expect(result).toEqual([]);
    });

    it('handles items without grunnlag property for OVERSTYRING codes', () => {
      const aksjonspunktData = [
        {
          kode: beregningAvklaringsbehovCodes.OVERSTYRING_AV_BEREGNINGSGRUNNLAG,
          // Missing grunnlag property
        },
      ];

      expect(() => transformBeregningValues(aksjonspunktData)).toThrow();
    });

    it('handles items with null/undefined grunnlag for OVERSTYRING codes', () => {
      const aksjonspunktData = [
        {
          kode: beregningAvklaringsbehovCodes.OVERSTYRING_AV_BEREGNINGSGRUNNLAG,
          grunnlag: null,
        },
      ];

      expect(() => transformBeregningValues(aksjonspunktData)).toThrow();
    });
  });
});
