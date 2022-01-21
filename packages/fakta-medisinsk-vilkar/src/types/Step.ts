export enum StepId {
    Dokument = 'dokument',
    TilsynOgPleie = 'tilsynOgPleie',
    ToOmsorgspersoner = 'toOmsorgspersoner',
}

interface Step {
    id: StepId;
    title: string;
}

export const dokumentSteg: Step = {
    id: StepId.Dokument,
    title: 'Dokumentasjon av sykdom',
};

export const tilsynOgPleieSteg: Step = {
    id: StepId.TilsynOgPleie,
    title: 'Tilsyn og pleie',
};

export const toOmsorgspersonerSteg: Step = {
    id: StepId.ToOmsorgspersoner,
    title: 'To omsorgspersoner',
};

export default Step;
