type BeregningAvklaringsbehov = Readonly<{
  definisjon: string;
  status: string;
  begrunnelse?: string;
  kanLoses: boolean;
}>;

export default BeregningAvklaringsbehov;
