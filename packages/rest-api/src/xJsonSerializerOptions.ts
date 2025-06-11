// Verdier som kan brukast for request header X-Json-Serializer-Option for å styre korleis serialisering/deserialisering skal fungere.
// Disse kan brukast opp mot ulike backends, men alle backends støtter kanskje ikkje alle verdier, og vil i så fall falle tilbake til standard serialisering/deserialisering.
export const xJsonSerializerOptions = {
  default: '', // Matcher ingen spesifikk serialisering/deserialisering på server, så vil bruke standard.
  // Deaktivert sidan denne berre blir brukt i legacy kode der denne verdi ikkje vil vere korrekt å bruke:
  // openapiCompat: "openapi-compat", // Bruk denne for å serialisere/deserialisere i henhold til generert typescript fra openapi spesifikasjon.
  kodeverdiObjekt: 'kodeverdi-objekt', // Bruk denne for å serialisere/deserialisere Kodeverdi implementasjoner som objekt.
  kodeverdiString: 'kodeverdi-string', // Bruk denne for å serialisere/deserialisere Kodeverdi implementasjoner som objekt.
} as const;
