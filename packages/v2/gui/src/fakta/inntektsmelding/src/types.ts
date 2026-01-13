import type { AksjonspunktDto } from '@k9-sak-web/backend/k9sak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import type { Period } from '@navikt/ft-utils';
import type {
  k9_sak_kontrakt_kompletthet_ArbeidsgiverArbeidsforholdStatus,
  k9_sak_kontrakt_kompletthet_aksjonspunkt_KompletthetsPeriode,
  k9_kodeverk_beregningsgrunnlag_kompletthet_Vurdering as VurderingKodeType,
  k9_sak_kontrakt_kompletthet_KompletthetsTilstandPåPeriodeDto,
  k9_sak_kontrakt_dokument_DokumentDto,
  k9_sak_kontrakt_kompletthet_ArbeidsgiverArbeidsforholdId,
  k9_sak_kontrakt_arbeidsforhold_ArbeidsgiverOpplysningerDto,
} from '@navikt/k9-sak-typescript-client/types';
import { k9_kodeverk_beregningsgrunnlag_kompletthet_Vurdering } from '@navikt/k9-sak-typescript-client/types';

// Re-exports av backend-typer med lesbare navn
export type ArbeidsgiverOpplysninger = k9_sak_kontrakt_arbeidsforhold_ArbeidsgiverOpplysningerDto;
export type ArbeidsgiverArbeidsforholdId = k9_sak_kontrakt_kompletthet_ArbeidsgiverArbeidsforholdId;
export type DokumentOpplysninger = k9_sak_kontrakt_dokument_DokumentDto;
export type Status = k9_sak_kontrakt_kompletthet_ArbeidsgiverArbeidsforholdStatus;
export type KompletthetsPeriode = k9_sak_kontrakt_kompletthet_aksjonspunkt_KompletthetsPeriode;
export type InntektsmeldingVurderingKodeType = VurderingKodeType;
export type KompletthetsTilstandPåPeriode = k9_sak_kontrakt_kompletthet_KompletthetsTilstandPåPeriodeDto;
// Vurderingskoder
export const InntektsmeldingVurderingResponseKode = k9_kodeverk_beregningsgrunnlag_kompletthet_Vurdering;

export enum InntektsmeldingVurderingRequestKode {
  FORTSETT = 'FORTSETT',
  MANGLENDE_GRUNNLAG = 'MANGLENDE_GRUNNLAG',
  IKKE_INNTEKTSTAP = 'IKKE_INNTEKTSTAP',
  UDEFINERT = 'UDEFINERT',
}

// Feltnavn for skjema
export enum FieldName {
  BESLUTNING = 'beslutning',
  BEGRUNNELSE = 'begrunnelse',
}

export interface Tilstand extends Omit<KompletthetsTilstandPåPeriode, 'periode'> {
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
  arbeidsforhold: Record<string, ArbeidsgiverOpplysninger>;
  dokumenter?: DokumentOpplysninger[];
  onFinished: (data: InntektsmeldingRequestPayload) => void;
  aksjonspunkter: AksjonspunktDto[];
}
