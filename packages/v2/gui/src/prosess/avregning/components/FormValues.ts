import type { k9_sak_kontrakt_aksjonspunkt_AksjonspunktDto } from '@k9-sak-web/backend/k9sak/generated/types.js';
import type { ung_sak_kontrakt_aksjonspunkt_AksjonspunktDto } from '@k9-sak-web/backend/ungsak/generated/types.js';

export interface FormValues {
  videreBehandling: string;
  varseltekst: string;
  begrunnelse: string;
  aksjonspunkter: k9_sak_kontrakt_aksjonspunkt_AksjonspunktDto[] | ung_sak_kontrakt_aksjonspunkt_AksjonspunktDto[];
}
