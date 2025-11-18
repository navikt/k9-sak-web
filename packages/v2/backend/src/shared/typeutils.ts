/**
 * For å gjere det enklare å deklarere ein type for ein dto med ein discriminator property med standard namn '@type'.
 * Dette kan vere nyttig når ein skal mappe data til ein konkret subtype av feks 'k9_sak_kontrakt_aksjonspunkt_BekreftetAksjonspunktDto'
 */
export type DTOWithDiscriminatorType<
  DTO extends object,
  DiscriminatorValue extends string,
  DiscriminatorPropname extends string = '@type',
> = { [Name in DiscriminatorPropname]: DiscriminatorValue } & DTO;
