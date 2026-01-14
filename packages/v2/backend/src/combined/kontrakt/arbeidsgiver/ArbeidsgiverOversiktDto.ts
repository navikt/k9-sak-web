import type { k9_sak_kontrakt_arbeidsforhold_ArbeidsgiverOversiktDto } from '@k9-sak-web/backend/k9sak/generated/types.js';
import type { ung_sak_kontrakt_arbeidsforhold_ArbeidsgiverOversiktDto } from '@navikt/ung-sak-typescript-client/types';

export type ArbeidsgiverOversiktDto =
  | ung_sak_kontrakt_arbeidsforhold_ArbeidsgiverOversiktDto
  | k9_sak_kontrakt_arbeidsforhold_ArbeidsgiverOversiktDto;
