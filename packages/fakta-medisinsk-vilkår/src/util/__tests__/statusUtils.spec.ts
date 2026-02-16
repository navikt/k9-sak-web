import { StepId } from '../../types/Step';
import type StatusResponse from '../../types/SykdomsstegStatusResponse';
import { finnNesteStegForPleiepenger } from '../statusUtils';

describe('statusUtils', () => {
  describe('finnNesteSteg', () => {
    describe('dokumentsteget', () => {
      it('harUklassifiserteDokumenter=true should give Step.Dokument', () => {
        const nesteSteg = finnNesteStegForPleiepenger({ harUklassifiserteDokumenter: true } as StatusResponse);
        expect(nesteSteg!.id).toBe(StepId.Dokument);
      });

      it('manglerDiagnosekode=true should give Step.Dokument', () => {
        const nesteSteg = finnNesteStegForPleiepenger({ manglerDiagnosekode: true } as StatusResponse);
        expect(nesteSteg!.id).toBe(StepId.Dokument);
      });

      it('manglerGodkjentLegeerklæring=true should give Step.Dokument', () => {
        const nesteSteg = finnNesteStegForPleiepenger({ manglerGodkjentLegeerklæring: true } as StatusResponse);
        expect(nesteSteg!.id).toBe(StepId.Dokument);
      });
    });

    describe('tilsynOgPleie-steget', () => {
      it('manglerVurderingAvKontinuerligTilsynOgPleie should give Step.TilsynOgPleie', () => {
        const nesteSteg = finnNesteStegForPleiepenger({
          manglerVurderingAvKontinuerligTilsynOgPleie: true,
        } as StatusResponse);
        expect(nesteSteg!.id).toBe(StepId.TilsynOgPleie);
      });
    });

    describe('toOmsorgspersoner-steget', () => {
      it('manglerVurderingAvToOmsorgspersoner should give Step.TilsynOgPleie', () => {
        const nesteSteg = finnNesteStegForPleiepenger({ manglerVurderingAvToOmsorgspersoner: true } as StatusResponse);
        expect(nesteSteg!.id).toBe(StepId.ToOmsorgspersoner);
      });
    });
  });
});
