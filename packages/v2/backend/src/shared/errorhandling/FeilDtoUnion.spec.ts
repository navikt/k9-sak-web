import { describe } from 'vitest';
import { isFeilDtoUnion, type FeilDtoUnion } from './FeilDtoUnion.js';

describe('isFeilDtoUnion', () => {
  it('should identify instance of FeilDtoUnion', () => {
    const inp1: FeilDtoUnion = {
      type: 'GENERELL_FEIL',
      feilmelding: 'feil melding',
    };
    expect(isFeilDtoUnion(inp1)).toBe(true);
    const inp2: FeilDtoUnion = {
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
    expect(isFeilDtoUnion(inp2)).toBe(true);
  });

  it('should block invalid data from being identified as FeilDtoUnion', () => {
    const inp1 = {
      type: 'FEIL',
      feilmelding: 'ikke korrekt feiltype',
    };
    expect(isFeilDtoUnion(inp1)).toBe(false);
    const inp2 = {
      type: 'MANGLER_TILGANG_FEIL',
      feilmelding: 'feil',
      feltFeil: [{ melding: 'feltFeil melding' }],
    };
    expect(isFeilDtoUnion(inp2)).toBe(false);
  });
});
