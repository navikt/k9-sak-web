export type BeregningAvklaringsbehov = Readonly<{
  definisjon: string;
  status: string;
  kanLoses: boolean;
  erTrukket?: boolean;
  begrunnelse?: string;
  vurdertAv?: string;
  vurdertTidspunkt?: string;
}>;
