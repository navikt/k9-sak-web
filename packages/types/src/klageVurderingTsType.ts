import Kodeverk from './kodeverkTsType';

export type KlageVurderingResultat = Readonly<{
  klageVurdertAv: string;
  klageVurdering?: Kodeverk;
  fritekstTilBrev?: string;
  klageMedholdArsak?: Kodeverk;
  klageVurderingOmgjoer?: Kodeverk;
  godkjentAvMedunderskriver: boolean;
  begrunnelse?: string;
}>;

type KlageVurdering = Readonly<{
  klageVurderingResultatNK?: KlageVurderingResultat;
  klageVurderingResultatNFP?: KlageVurderingResultat;
  klageFormkravResultatKA?: {
    avvistArsaker: {
      navn?: string;
    }[];
    paKlagdBehandlingId: number;
    paklagdBehandlingType: Kodeverk;
    begrunnelse: string;
    erKlagerPart: boolean;
    erKlageKonkret: boolean;
    erKlagefirstOverholdt: boolean;
    erSignert: boolean;
  };
  klageFormkravResultatNFP?: {
    avvistArsaker: {
      navn?: string;
    }[];
    paKlagdBehandlingId: number;
    paklagdBehandlingType: Kodeverk;
    begrunnelse: string;
    erKlagerPart: boolean;
    erKlageKonkret: boolean;
    erKlagefirstOverholdt: boolean;
    erSignert: boolean;
  };
}>;

export default KlageVurdering;
