import { describe } from 'vitest';
import { isUngSakErrorData, type UngSakErrorData } from './errorData.js';

describe('isUngSakErrorData', () => {
  it('should identify instance of UngSakErrorData type', () => {
    const inp1: UngSakErrorData = {
      type: 'VALIDERINGS_FEIL',
      feilmelding: 'feil melding',
    };
    expect(isUngSakErrorData(inp1)).toBe(true);
    const inp2: UngSakErrorData = {
      feilmelding:
        'Det oppstod en valideringsfeil på felt [fritekst]. Vennligst kontroller at alle feltverdier er korrekte.',
      feltFeil: [
        {
          melding:
            '[asdsa🥲dfvd] matcher ikke tillatt pattern [^[\\p{Pd}\\p{Graph}\\p{Space}\\p{Sc}\\p{L}\\p{M}\\p{N}§]*$]',
          metainformasjon: undefined,
          navn: 'fritekst',
        },
      ],
      feilkode: undefined,
      type: 'VALIDERINGS_FEIL',
    };
    expect(isUngSakErrorData(inp2)).toBe(true);
  });
});
