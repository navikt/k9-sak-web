import type { KravDokumentMedSøktePerioder } from '@navikt/k9-sak-typescript-client';

export type KravDokumentStatusType = KravDokumentMedSøktePerioder['type'];

export const kravDokumentStatusType: Readonly<
  Record<KravDokumentMedSøktePerioder['type'], KravDokumentMedSøktePerioder['type']>
> = {
  INNTEKTSMELDING: 'INNTEKTSMELDING',
  SØKNAD: 'SØKNAD',
};
