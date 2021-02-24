export interface OmsorgProps {
  lesemodus?: boolean;
  harOmsorgen?: boolean;
  barn: string[];
  losAksjonspunkt: (omsorgenFor, begrunnelse) => void;
}
