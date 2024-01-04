export interface LosteBehovsliste {
  VURDERE_KRONISK_SYKT_BARN?: LostBehov<Legeerklaering>;
  VURDERE_OMSORGEN_FOR?: LostBehov<OmsorgenFor>;
  VURDER_MIDLERTIDIG_ALENE?: LostBehov<MidlertidigAlene>;
}

export interface UlosteBehovsliste {
  VURDERE_KRONISK_SYKT_BARN?: UlostBehov;
  VURDERE_OMSORGEN_FOR?: UlostBehov;
  VURDER_MIDLERTIDIG_ALENE?: UlostBehov;
}

export interface BehovslisteInnsending {
  VURDERE_KRONISK_SYKT_BARN?: Legeerklaering;
  VURDERE_OMSORGEN_FOR?: OmsorgenFor;
  VURDER_MIDLERTIDIG_ALENE?: MidlertidigAlene;
}

interface LostBehov<T> {
  grunnlag: any;
  lovhenvisninger: {
    innvilget: { [henvisning: string]: string };
    avslått: { [henvisning: string]: string };
  };
  løsning: T;
}

type UlostBehov = Record<string, never>;

interface MidlertidigAlene {
  vurdering: string;
  erSøkerenMidlertidigAleneOmOmsorgen: boolean;
  gyldigFraOgMed: string;
  gyldigTilOgMed: string;
}

interface Legeerklaering {
  vurdering: string;
  barnetErKroniskSyktEllerHarEnFunksjonshemning: boolean;
  erSammenhengMedSøkersRisikoForFraværFraArbeid: boolean;
}

export interface OmsorgenFor {
  harOmsorgen?: boolean; // TODO: Avklare formatet på dette aksjonspunktet
}
