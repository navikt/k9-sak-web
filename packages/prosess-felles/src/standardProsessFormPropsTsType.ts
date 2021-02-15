import { Aksjonspunkt, Behandling, KodeverkMedNavn, Vilkar } from '@k9-sak-web/types';

interface StandardProsessFormProps {
  behandling: Behandling;
  alleKodeverk: { [key: string]: KodeverkMedNavn[] };
  submitCallback: (aksjonspunktData: { kode: string }[]) => Promise<any>;
  status: string;
  isReadOnly: boolean;
  readOnlySubmitButton: boolean;
  aksjonspunkter: Aksjonspunkt[];
  vilkar: Vilkar[];
  isAksjonspunktOpen: boolean;
}

export default StandardProsessFormProps;
