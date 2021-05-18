import { FormStateType } from '@fpsak-frontend/form/src/types/FormStateType';

export interface SaerligSmittevernhensynProps {
  behandlingsID: string;
  lesemodus: boolean;
  aksjonspunktLost: boolean;
  årsakFraSoknad: string;
  informasjonTilLesemodus?: {
    begrunnelse: string;
    vilkarOppfylt: boolean;
  };
  losAksjonspunkt: (fravaerGrunnetSmittevernhensynEllerStengt, begrunnelse) => void;
  formState: FormStateType;
}
