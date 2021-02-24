export interface OmsorgProps {
  lesemodus?: boolean;
  harOmsorgen?: boolean;
  barnetsFnr: string[];
  losAksjonspunkt: (omsorgenFor, begrunnelse) => void;
}
