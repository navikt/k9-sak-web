import { KlageVurderingResultat } from './KlageVurderingResultat';

export interface BehandlingKlageVurdering {
  klageVurdering: string;
  klageVurderingOmgjoer: string;
  klageVurderingResultatNFP: KlageVurderingResultat;
  klageVurderingResultatNK: KlageVurderingResultat;
}
