import { FormState } from './FormState';

export interface KorrigerePerioderProps {
  behandlingsID: string;
  lesemodus: boolean;
  aksjonspunktLost: boolean;
  informasjonTilLesemodus?: KorrigerePerioderLesemodus;
  losAksjonspunkt: (fravaerGrunnetSmittevernhensynEllerStengt, begrunnelse, antallDagerDelvisInnvilget) => void;
  konfliktMedArbeidsgiver: boolean;
  formState: FormState;
}

interface KorrigerePerioderLesemodus {
  begrunnelse: string;
  vilkarOppfylt: boolean;
  antallDagerDelvisInnvilget: number;
}
