export type AksjonspunktDefinisjon = Readonly<{
  kode: string;
  kodeverk: string;
  skalAvbrytesVedTilbakeføring: boolean;
}>;

export type Aksjonspunkt = Readonly<{
  definisjon: AksjonspunktDefinisjon;
  status: string;
  begrunnelse?: string;
  vilkarType?: string;
  toTrinnsBehandling?: boolean;
  toTrinnsBehandlingGodkjent?: boolean;
  vurderPaNyttArsaker?: string[];
  besluttersBegrunnelse?: string;
  aksjonspunktType?: string;
  kanLoses: boolean;
  erAktivt: boolean;
  venteårsakVariant?: string;
}>;

export default Aksjonspunkt;
