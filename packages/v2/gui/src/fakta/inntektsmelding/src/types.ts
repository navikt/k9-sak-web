import type { AksjonspunktDto } from '@k9-sak-web/backend/k9sak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import type { Period } from '@navikt/ft-utils';
import type { KompletthetsTilstandPåPeriodeDto } from '@k9-sak-web/backend/k9sak/kontrakt/kompletthet/KompletthetsTilstandPåPeriodeDto.js';
import type { KompletthetsPeriode } from '@k9-sak-web/backend/k9sak/kontrakt/kompletthet/KompletthetsPeriode.js';
import type { ArbeidsgiverOpplysningerDto } from '@k9-sak-web/backend/k9sak/kontrakt/arbeidsforhold/ArbeidsgiverOpplysningerDto.js';
import type { DokumentDto } from '@k9-sak-web/backend/k9sak/kontrakt/dokument/DokumentDto.js';

export const InntektsmeldingVurderingRequestKode = {
  FORTSETT: 'FORTSETT',
  MANGLENDE_GRUNNLAG: 'MANGLENDE_GRUNNLAG',
  IKKE_INNTEKTSTAP: 'IKKE_INNTEKTSTAP',
  UDEFINERT: 'UDEFINERT',
} as const;

// Feltnavn for skjema
export const FieldName = {
  BESLUTNING: 'beslutning',
  BEGRUNNELSE: 'begrunnelse',
} as const;

export interface Tilstand extends Omit<KompletthetsTilstandPåPeriodeDto, 'periode'> {
  periode: Period;
  periodeOpprinneligFormat: string;
}

export interface TilstandMedUiState extends Tilstand {
  redigeringsmodus: boolean;
  setRedigeringsmodus: (state: boolean) => void;
  begrunnelseFieldName: `begrunnelse${string}`;
  beslutningFieldName: `beslutning${string}`;
}

// API request/response typer
export interface InntektsmeldingRequestPayload {
  begrunnelse?: string;
  perioder: KompletthetsPeriode[];
  kode: string;
  '@type': string;
}

// Context type
export interface InntektsmeldingContextType {
  behandlingUuid: string;
  readOnly: boolean;
  arbeidsforhold: Record<string, ArbeidsgiverOpplysningerDto>;
  dokumenter?: DokumentDto[];
  onFinished: (data: InntektsmeldingRequestPayload) => void;
  aksjonspunkter: AksjonspunktDto[];
}
