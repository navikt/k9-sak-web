import type { AksjonspunktDto } from '@k9-sak-web/backend/k9sak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import type { InntektsmeldingRequestPayload } from './InntektsmeldingAPRequest';

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
  onFinished: (data: InntektsmeldingRequestPayload) => void;
  aksjonspunkter: AksjonspunktDto[];
}
