import { Aksjonspunkt } from '@k9-sak-web/types';

type StandardFaktaProps = Readonly<{
  aksjonspunkter: Aksjonspunkt[];
  readOnly: boolean;
  submittable: boolean;
  harApneAksjonspunkter: boolean;
  alleMerknaderFraBeslutter: { [key: string]: { notAccepted?: boolean } };
  submitCallback?: (aksjonspunktData: any) => Promise<any>;
}>;

export default StandardFaktaProps;
