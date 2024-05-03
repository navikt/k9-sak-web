import { FormStateType } from '@k9-sak-web/form/src/types/FormStateType';

export interface SaerligSmittevernhensynProps {
  behandlingsID: string;
  lesemodus: boolean;
  aksjonspunktLost: boolean;
  informasjonTilLesemodus?: {
    begrunnelse: string;
    vilkarOppfylt: boolean;
    antallDagerDelvisInnvilget: number;
  };
  konfliktMedArbeidsgiver: boolean;
  losAksjonspunkt: (fravaerGrunnetSmittevernhensynEllerStengt, begrunnelse, antallDagerDelvisInnvilget) => void;
  formState: FormStateType;
}
