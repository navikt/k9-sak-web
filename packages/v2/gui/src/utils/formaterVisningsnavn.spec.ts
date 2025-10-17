import { ung_sak_kontrakt_behandling_BehandlingVisningsnavn } from '@k9-sak-web/backend/ungsak/generated/types.js';
import { describe, expect, it } from 'vitest';
import { formaterVisningsnavn } from './formaterVisningsnavn';

describe('formaterVisningsnavn', () => {
  describe('når visningsnavn er undefined', () => {
    it('skal returnere tom streng', () => {
      const result = formaterVisningsnavn(undefined);
      expect(result).toBe('');
    });
  });

  describe('når visningsnavn er INGEN_RELEVANT_BEHANDLINGÅRSAK', () => {
    it('skal returnere tom streng', () => {
      const result = formaterVisningsnavn(
        ung_sak_kontrakt_behandling_BehandlingVisningsnavn.INGEN_RELEVANT_BEHANDLINGÅRSAK,
      );
      expect(result).toBe('');
    });
  });

  describe('når visningsnavn er KONTROLL_AV_INNTEKT', () => {
    it('skal returnere "Kontroll av inntekt"', () => {
      const result = formaterVisningsnavn(ung_sak_kontrakt_behandling_BehandlingVisningsnavn.KONTROLL_AV_INNTEKT);
      expect(result).toBe('Kontroll av inntekt');
    });
  });

  describe('når visningsnavn er BEREGNING_AV_HØY_SATS', () => {
    it('skal returnere "Beregning av høy sats"', () => {
      const result = formaterVisningsnavn(ung_sak_kontrakt_behandling_BehandlingVisningsnavn.BEREGNING_AV_HØY_SATS);
      expect(result).toBe('Beregning av høy sats');
    });
  });

  describe('når visningsnavn er ENDRING_AV_BARNETILLEGG', () => {
    it('skal returnere "Endring av barnetillegg"', () => {
      const result = formaterVisningsnavn(ung_sak_kontrakt_behandling_BehandlingVisningsnavn.ENDRING_AV_BARNETILLEGG);
      expect(result).toBe('Endring av barnetillegg');
    });
  });

  describe('når visningsnavn er BRUKERS_DØDSFALL', () => {
    it('skal returnere "Brukers dødsfall"', () => {
      const result = formaterVisningsnavn(ung_sak_kontrakt_behandling_BehandlingVisningsnavn.BRUKERS_DØDSFALL);
      expect(result).toBe('Brukers dødsfall');
    });
  });

  describe('når visningsnavn er UNGDOMSPROGRAMENDRING', () => {
    it('skal returnere "Ungdomsprogramendring"', () => {
      const result = formaterVisningsnavn(ung_sak_kontrakt_behandling_BehandlingVisningsnavn.UNGDOMSPROGRAMENDRING);
      expect(result).toBe('Ungdomsprogramendring');
    });
  });
});
