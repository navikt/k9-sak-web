import { describe } from 'vitest';
import { isK9SakErrorData, type K9SakErrorData } from './errorData.js';

describe('isK9SakErrorData', () => {
  it('should identify instance of K9SakErrorData type', () => {
    const inp1: K9SakErrorData = {
      type: 'VALIDERINGS_FEIL',
      feilmelding: 'feil melding',
    };
    expect(isK9SakErrorData(inp1)).toBe(true);
    const inp2: K9SakErrorData = {
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
    expect(isK9SakErrorData(inp2)).toBe(true);
  });
});
