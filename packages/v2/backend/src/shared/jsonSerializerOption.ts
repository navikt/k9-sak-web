// Disse verdier er også hardkoda i k9-sak ObjectMapperResolver.java
// Ved å legge til denne header verdi instruerer ein server til å serialisere respons slik at den alltid stemmer med generert
// openapi spesifikasjon. (Enum verdier må alltid serialiserast til ein string.)
export const jsonSerializerOption = {
  xJsonSerializerOptionHeader: 'X-Json-Serializer-Option',
  xJsonSerializerOptionValue: 'openapi-compat',
} as const;
