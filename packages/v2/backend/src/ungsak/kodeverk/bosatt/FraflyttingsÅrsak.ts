/**
 * Årsak til at saksbehandler vurderer bruker som fraflyttet fra Trondheim.
 * Speilar Java-enum {@code no.nav.ung.kodeverk.bosatt.FraflyttingsÅrsak}.
 */
export const FraflyttingsÅrsak = {
  IKKE_BOSATTADRESSE_I_TRONDHEIM: 'IKKE_BOSATTADRESSE_I_TRONDHEIM',
  IKKE_BOSTEDSADRESSE_OG_IKKE_FOLKEREGISTRERT_I_TRONDHEIM: 'IKKE_BOSTEDSADRESSE_OG_IKKE_FOLKEREGISTRERT_I_TRONDHEIM',
  STUDIE_ELLER_ARBEIDSSTED_UTENFOR_TRONDHEIM: 'STUDIE_ELLER_ARBEIDSSTED_UTENFOR_TRONDHEIM',
  ANNET: 'ANNET',
} as const;

export type FraflyttingsÅrsak = (typeof FraflyttingsÅrsak)[keyof typeof FraflyttingsÅrsak];

/** Lesbare etiketter per årsak, til bruk i nedtrekksliste. */
export const fraflyttingsÅrsakLabels: Record<FraflyttingsÅrsak, string> = {
  IKKE_BOSATTADRESSE_I_TRONDHEIM: 'Ikke bosattadresse i Trondheim',
  IKKE_BOSTEDSADRESSE_OG_IKKE_FOLKEREGISTRERT_I_TRONDHEIM: 'Ikke bostedsadresse i Trondheim og ikke folkeregistrert i Trondheim',
  STUDIE_ELLER_ARBEIDSSTED_UTENFOR_TRONDHEIM: 'Har studie- eller arbeidssted utenfor Trondheim',
  ANNET: 'Annet',
};
