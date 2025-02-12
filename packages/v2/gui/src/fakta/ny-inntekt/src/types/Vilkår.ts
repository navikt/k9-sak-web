export type Vilkårperiode = Readonly<{
  avslagKode?: string;
  begrunnelse?: string;
  vurderesIBehandlingen: boolean;
  erForlengelse?: boolean;
  merknad?: string;
  merknadParametere: { [name: string]: string };
  periode: { fom: string; tom: string };
  vilkarStatus: string;
}>;

export type Vilkår = Readonly<{
  vilkarType: string;
  overstyrbar: boolean;
  perioder: Vilkårperiode[];
}>;
