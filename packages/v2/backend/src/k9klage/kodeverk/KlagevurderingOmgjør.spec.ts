import { isKlagevurderingOmgjørType, KlagevurderingOmgjør } from './KlagevurderingOmgjør.ts';

describe('isKlagevurderingOmgjørType', () => {
  it('skal returnere true for enum verdier', () => {
    expect(isKlagevurderingOmgjørType(KlagevurderingOmgjør.GUNST_MEDHOLD_I_KLAGE)).toEqual(true);
    expect(isKlagevurderingOmgjørType(KlagevurderingOmgjør.UDEFINERT)).toEqual(true);
  });
  it('skal returnere false for alt anna', () => {
    expect(isKlagevurderingOmgjørType('ANNA')).toEqual(false);
    expect(isKlagevurderingOmgjørType('')).toEqual(false);
    expect(isKlagevurderingOmgjørType(undefined)).toEqual(false);
  });
});
