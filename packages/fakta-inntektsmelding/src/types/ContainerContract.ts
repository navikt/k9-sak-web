import { HttpErrorHandler } from '@navikt/k9-fe-http-utils';
import Aksjonspunkt from './Aksjonspunkt';
import AksjonspunktRequestPayload from './AksjonspunktRequestPayload';

export type ArbeidsgiverOpplysninger = Readonly<{
  navn: string;
  fødselsdato?: string;
}>;

export type DokumentOpplysninger = Readonly<{
  journalpostId: string;
  href: string;
}>;

interface ContainerContract {
  readOnly: boolean;
  arbeidsforhold: Record<string, ArbeidsgiverOpplysninger>;
  dokumenter?: DokumentOpplysninger[];
  httpErrorHandler?: HttpErrorHandler;
  endpoints: {
    kompletthetBeregning: string;
  };
  onFinished: (data: AksjonspunktRequestPayload) => void;
  aksjonspunkter: Aksjonspunkt[];
}

export default ContainerContract;
