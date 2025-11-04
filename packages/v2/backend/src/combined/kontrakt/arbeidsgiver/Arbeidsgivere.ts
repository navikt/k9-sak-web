import type { k9_sak_kontrakt_arbeidsforhold_ArbeidsgiverOversiktDto } from '@navikt/k9-sak-typescript-client/types';
import type { ung_sak_kontrakt_arbeidsforhold_ArbeidsgiverOversiktDto } from '@navikt/ung-sak-typescript-client/types';

export type Arbeidsgivere =
  | ung_sak_kontrakt_arbeidsforhold_ArbeidsgiverOversiktDto['arbeidsgivere']
  | k9_sak_kontrakt_arbeidsforhold_ArbeidsgiverOversiktDto['arbeidsgivere'];
