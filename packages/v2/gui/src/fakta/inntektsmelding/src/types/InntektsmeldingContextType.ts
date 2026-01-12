import type { Aksjonspunkt } from '@k9-sak-web/types';
import type AksjonspunktRequestPayload from './AksjonspunktRequestPayload';

export type ArbeidsgiverOpplysninger = Readonly<{
  navn: string;
  fødselsdato?: string;
}>;

export type DokumentOpplysninger = Readonly<{
  journalpostId: string;
  href: string;
}>;

export interface InntektsmeldingContextType {
  behandlingUuid: string;
  readOnly: boolean;
  arbeidsforhold: Record<string, ArbeidsgiverOpplysninger>;
  dokumenter?: DokumentOpplysninger[];
  onFinished: (data: AksjonspunktRequestPayload) => void;
  aksjonspunkter: Aksjonspunkt[];
}
