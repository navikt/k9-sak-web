import type { ArbeidsgiverOversiktDto } from '@k9-sak-web/backend/combined/kontrakt/arbeidsgiver/ArbeidsgiverOversiktDto.js';
import { arbeidstypeTilVisning } from '../constants/Arbeidstype.js';

// Backend-typen er string, så oppslaget må tåle ukjente verdier
const arbeidstypeVisningsnavn: Partial<Record<string, string>> = arbeidstypeTilVisning;

const formatArbeidsgiverNavn = (navn?: string, identifikator?: string): string | undefined => {
  if (navn && identifikator) {
    return `${navn} (${identifikator})`;
  }
  if (navn) {
    return navn;
  }
  if (identifikator) {
    return `Mangler navn (${identifikator})`;
  }
  return undefined;
};

export const utledArbeidsgiverNavn = (
  arbeidsgiverIdentifikator: string | null | undefined,
  arbeidsgivere: ArbeidsgiverOversiktDto['arbeidsgivere'] | undefined,
): string | undefined => {
  if (!arbeidsgiverIdentifikator) {
    return undefined;
  }

  const arbeidsforholdData = arbeidsgivere?.[arbeidsgiverIdentifikator];
  return formatArbeidsgiverNavn(
    arbeidsforholdData?.navn,
    arbeidsforholdData?.identifikator || arbeidsgiverIdentifikator || undefined,
  );
};

export const utledAktivitetVisningsnavn = (
  type: string | null | undefined,
  arbeidsgiverIdentifikator: string | null | undefined,
  arbeidsgivere: ArbeidsgiverOversiktDto['arbeidsgivere'] | undefined,
): string => {
  const arbeidsgiverNavn = utledArbeidsgiverNavn(arbeidsgiverIdentifikator, arbeidsgivere);
  if (arbeidsgiverNavn) {
    return arbeidsgiverNavn;
  }

  return utledArbeidstypeVisningsnavn(type) ?? 'Mangler navn';
};

export const utledArbeidstypeVisningsnavn = (type: string | null | undefined): string | undefined => {
  return type && Object.hasOwn(arbeidstypeVisningsnavn, type) ? arbeidstypeVisningsnavn[type] : undefined;
};
