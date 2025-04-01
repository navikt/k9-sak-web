import type { Kodeverk } from '@k9-sak-web/backend/shared/Kodeverk.js';


// aksjonspunkt med kodeverk
export type Aksjonspunkt = Readonly<{
  definisjon: Kodeverk<string, string>;
  status: Kodeverk<string, string>;
  begrunnelse?: string;
  vilkarType?: Kodeverk<string, string>;
  toTrinnsBehandling?: boolean;
  toTrinnsBehandlingGodkjent?: boolean;
  vurderPaNyttArsaker?: Kodeverk<string, string>[];
  besluttersBegrunnelse?: string;
  aksjonspunktType?: Kodeverk<string, string>;
  kanLoses: boolean;
  erAktivt: boolean;
  venteårsakVariant?: string;
  opprettetAv?: string;
}>;
