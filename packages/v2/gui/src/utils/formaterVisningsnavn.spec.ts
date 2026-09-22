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

  describe('når visningsnavn er OPPHØR_VED_MAKSDATO', () => {
    it('skal returnere "Opphør ved maksdato"', () => {
      const result = formaterVisningsnavn(ung_sak_kontrakt_behandling_BehandlingVisningsnavn.OPPHØR_VED_MAKSDATO);
      expect(result).toBe('Opphør ved maksdato');
    });
  });

  describe('når visningsnavn er UNGDOMSPROGRAM_OPPHØR_OPPHEVET', () => {
    it('skal returnere "Ungdomsprogramopphør opphevet"', () => {
      const result = formaterVisningsnavn(
        ung_sak_kontrakt_behandling_BehandlingVisningsnavn.UNGDOMSPROGRAM_OPPHØR_OPPHEVET,
      );
      expect(result).toBe('Ungdomsprogramopphør opphevet');
    });
  });

  describe('når visningsnavn er UNGDOMSPROGRAM_OPPHØR_MOTTATT_OG_AVBRUTT_I_SAMME_BEHANDLING', () => {
    it('skal returnere "Ungdomsprogramopphør avbrutt"', () => {
      const result = formaterVisningsnavn(
        ung_sak_kontrakt_behandling_BehandlingVisningsnavn.UNGDOMSPROGRAM_OPPHØR_MOTTATT_OG_AVBRUTT_I_SAMME_BEHANDLING,
      );
      expect(result).toBe('Ungdomsprogramopphør avbrutt');
    });
  });

  describe('når visningsnavn er FLERE_BEHANDLINGÅRSAKER', () => {
    it('skal returnere "Flere behandlingsårsaker"', () => {
      const result = formaterVisningsnavn(ung_sak_kontrakt_behandling_BehandlingVisningsnavn.FLERE_BEHANDLINGÅRSAKER);
      expect(result).toBe('Flere behandlingsårsaker');
    });
  });
  describe('når visningsnavn er ukjent', () => {
    it('skal returnere verdien som nytt behandlingsårsak streng', () => {
      const originalWarn = console.warn;
      try {
        console.warn = () => {};
        const result = formaterVisningsnavn('UKJENT' as unknown as ung_sak_kontrakt_behandling_BehandlingVisningsnavn);
        expect(result).toBe('Nytt behandlingsårsak (UKJENT)');
      } finally {
        console.warn = originalWarn;
      }
    });
  });
});
