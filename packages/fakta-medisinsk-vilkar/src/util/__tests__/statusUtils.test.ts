import { finnNesteSteg } from '../statusUtils';
import StatusResponse from '../../types/SykdomsstegStatusResponse';
import { StepId } from '../../types/Step';

describe('statusUtils', () => {
    describe('finnNesteSteg', () => {
        describe('dokumentsteget', () => {
            it('harUklassifiserteDokumenter=true should give Step.Dokument', () => {
                const nesteSteg = finnNesteSteg({ harUklassifiserteDokumenter: true } as StatusResponse);
                expect(nesteSteg.id).toBe(StepId.Dokument);
            });

            it('manglerDiagnosekode=true should give Step.Dokument', () => {
                const nesteSteg = finnNesteSteg({ manglerDiagnosekode: true } as StatusResponse);
                expect(nesteSteg.id).toBe(StepId.Dokument);
            });

            it('manglerGodkjentLegeerklæring=true should give Step.Dokument', () => {
                const nesteSteg = finnNesteSteg({ manglerGodkjentLegeerklæring: true } as StatusResponse);
                expect(nesteSteg.id).toBe(StepId.Dokument);
            });
        });

        describe('tilsynOgPleie-steget', () => {
            it('manglerVurderingAvKontinuerligTilsynOgPleie should give Step.TilsynOgPleie', () => {
                const nesteSteg = finnNesteSteg({
                    manglerVurderingAvKontinuerligTilsynOgPleie: true,
                } as StatusResponse);
                expect(nesteSteg.id).toBe(StepId.TilsynOgPleie);
            });
        });

        describe('toOmsorgspersoner-steget', () => {
            it('manglerVurderingAvToOmsorgspersoner should give Step.TilsynOgPleie', () => {
                const nesteSteg = finnNesteSteg({ manglerVurderingAvToOmsorgspersoner: true } as StatusResponse);
                expect(nesteSteg.id).toBe(StepId.ToOmsorgspersoner);
            });
        });
    });
});
