import { Period } from '@fpsak-frontend/utils';
import type {
  k9_sak_kontrakt_kompletthet_ArbeidsgiverArbeidsforholdStatus,
  k9_kodeverk_beregningsgrunnlag_kompletthet_Vurdering as VurderingKodeType,
} from '@navikt/k9-sak-typescript-client/types';
import { k9_kodeverk_beregningsgrunnlag_kompletthet_Vurdering } from '@navikt/k9-sak-typescript-client/types';
export type InntektsmeldingVurderingKodeType = VurderingKodeType;

export interface Kompletthet {
  tilstand: Tilstand[];
}

export interface Tilstand {
  periode: Period;
  status: Status[];
  begrunnelse?: string;
  tilVurdering: boolean;
  vurdering?: InntektsmeldingVurderingKodeType;
  periodeOpprinneligFormat: string;
  vurdertAv?: string;
  vurdertTidspunkt?: string;
}

export interface TilstandBeriket extends Tilstand {
  redigeringsmodus: boolean;
  setRedigeringsmodus: (state: boolean) => void;
  begrunnelseFieldName: `begrunnelse${string}`;
  beslutningFieldName: `beslutning${string}`;
}

export type Status = k9_sak_kontrakt_kompletthet_ArbeidsgiverArbeidsforholdStatus;

export interface Arbeidsgiver {
  arbeidsgiver: string;
  arbeidsforhold: string | null;
}

export const InntektsmeldingVurderingKode = k9_kodeverk_beregningsgrunnlag_kompletthet_Vurdering;
export enum InntektsmeldingKode {
  FORTSETT = 'FORTSETT',
  MANGLENDE_GRUNNLAG = 'MANGLENDE_GRUNNLAG',
  IKKE_INNTEKTSTAP = 'IKKE_INNTEKTSTAP',
  TOM = 'UDEFINERT',
}
