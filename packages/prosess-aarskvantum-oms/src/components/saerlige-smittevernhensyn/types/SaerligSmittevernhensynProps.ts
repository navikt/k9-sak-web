import { FormStateType } from '@fpsak-frontend/form/src/types/FormStateType';

export interface SaerligSmittevernhensynProps {
  behandlingsID: string;
  lesemodus: boolean;
  aksjonspunktLost: boolean;
  informasjonTilLesemodus?: {
    begrunnelse: string;
    vilkarOppfylt: boolean;
    antallDagerDelvisInnvilget: number;
  };
  losAksjonspunkt: (fravaerGrunnetSmittevernhensynEllerStengt, begrunnelse, antallDagerDelvisInnvilget) => void;
  formState: FormStateType;
}
