import { describe } from 'vitest';
import { isK9KlageErrorData, type K9KlageErrorData } from './errorData.js';

describe('isK9KlageErrorData', () => {
  it('should identify instance of K9KlageErrorData type', () => {
    const inp1: K9KlageErrorData = {
      type: 'GENERELL_FEIL',
      feilmelding: 'feil melding',
    };
    expect(isK9KlageErrorData(inp1)).toBe(true);
    const inp2: K9KlageErrorData = {
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
      type: 'MANGLER_TILGANG_FEIL',
    };
    expect(isK9KlageErrorData(inp2)).toBe(true);
  });
});
