import { FormState } from './FormState';

export interface KorrigerePerioderProps {
  behandlingsID: string;
  lesemodus: boolean;
  aksjonspunktLost: boolean;
  informasjonTilLesemodus?: KorrigerePerioderLesemodus;
  losAksjonspunkt: (fravaerGrunnetSmittevernhensynEllerStengt, begrunnelse, antallDagerDelvisInnvilget) => Promise<void>;
  konfliktMedArbeidsgiver: boolean;
  formState: FormState;
}

export interface KorrigerePerioderLesemodus {
  begrunnelse: string;
  vilkarOppfylt: boolean;
  antallDagerDelvisInnvilget: number;
}
