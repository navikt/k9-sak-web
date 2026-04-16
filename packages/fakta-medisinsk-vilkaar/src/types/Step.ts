export enum StepId {
  Dokument = 'dokument',
  TilsynOgPleie = 'tilsynOgPleie',
  ToOmsorgspersoner = 'toOmsorgspersoner',
  LivetsSluttfase = 'livetsSluttfase',
  LangvarigSykdom = 'langvarigSykdom',
}

interface Step {
  id: StepId;
  title: string;
}

export const dokumentSteg: Step = {
  id: StepId.Dokument,
  title: 'Dokumentasjon av sykdom',
};

export const sluttfaseDokumentSteg: Step = {
  id: StepId.Dokument,
  title: 'Dokumentasjon av livets sluttfase',
};

export const opplæringspengerDokumentSteg: Step = {
  id: StepId.Dokument,
  title: 'Dokumentasjon av opplæringspenger',
};

export const tilsynOgPleieSteg: Step = {
  id: StepId.TilsynOgPleie,
  title: 'Tilsyn og pleie',
};

export const livetsSluttfaseSteg: Step = {
  id: StepId.LivetsSluttfase,
  title: 'Livets sluttfase',
};
export const langvarigSykdomSteg: Step = {
  id: StepId.LangvarigSykdom,
  title: 'Langvarig sykdom',
};

export const toOmsorgspersonerSteg: Step = {
  id: StepId.ToOmsorgspersoner,
  title: 'To omsorgspersoner',
};

export default Step;
