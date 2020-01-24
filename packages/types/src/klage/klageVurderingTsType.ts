import KlageVurderingResultat from './klageVurderingResultatType';
import KlageFormkravResultat from './klageFormkravResultatType';

type KlageVurdering = Readonly<{
  klageVurderingResultatNK: KlageVurderingResultat,
  klageVurderingResultatNFP: KlageVurderingResultat,
  klageFormkravResultatKA: KlageFormkravResultat,
  klageFormkravResultatNFP: KlageFormkravResultat,
}>;

export default KlageVurdering;
