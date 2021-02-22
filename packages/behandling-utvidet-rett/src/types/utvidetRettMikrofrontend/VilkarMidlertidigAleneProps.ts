export interface VilkarMidlertidigAleneProps {
  lesemodus: boolean;
  soknadsopplysninger: VilkarMidlertidigSoknadsopplysninger;
  informasjonTilLesemodus?: VilkarMidlertidigGrunnlagForBeslutt;
  onSubmit: (VilkarMidlertidigGrunnlagForBeslutt) => void;
}

interface VilkarMidlertidigAleneDato {
  til: string;
  fra: string;
}

interface VilkarMidlertidigSoknadsopplysninger {
  årsak: string;
  beskrivelse?: string;
  periode: string;
}

interface VilkarMidlertidigGrunnlagForBeslutt {
  begrunnelse: string;
  vilkarOppfylt: boolean;
  dato: VilkarMidlertidigAleneDato;
}
