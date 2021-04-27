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
}
