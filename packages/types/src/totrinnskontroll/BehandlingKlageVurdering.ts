import KlageVurderingResultat from './KlageVurderingResultat';

interface BehandlingKlageVurdering {
  klageVurdering: string;
  klageVurderingOmgjoer: string;
  klageVurderingResultatNFP: KlageVurderingResultat;
  klageVurderingResultatNK: KlageVurderingResultat;
}

export default BehandlingKlageVurdering;
