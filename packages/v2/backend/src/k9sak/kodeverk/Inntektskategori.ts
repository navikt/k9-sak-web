import type { K9SakKodeverkArbeidsforhold } from '@navikt/k9-sak-typescript-client';
import type { Kodeverk } from '../../shared/Kodeverk';

export type Inntektskategori = Exclude<K9SakKodeverkArbeidsforhold['inntektskategori'], undefined>;

export type InntektskategoriKodeverk = Kodeverk<Inntektskategori, 'INNTEKTSKATEGORI'>;

export const inntektskategorier: Readonly<Record<Inntektskategori, Inntektskategori>> = {
  ARBEIDSTAKER: 'ARBEIDSTAKER',
  FRILANSER: 'FRILANSER',
  SELVSTENDIG_NÆRINGSDRIVENDE: 'SELVSTENDIG_NÆRINGSDRIVENDE',
  DAGPENGER: 'DAGPENGER',
  ARBEIDSAVKLARINGSPENGER: 'ARBEIDSAVKLARINGSPENGER',
  SJØMANN: 'SJØMANN',
  DAGMAMMA: 'DAGMAMMA',
  JORDBRUKER: 'JORDBRUKER',
  FISKER: 'FISKER',
  ARBEIDSTAKER_UTEN_FERIEPENGER: 'ARBEIDSTAKER_UTEN_FERIEPENGER',
  '-': '-',
};
