import { KlageVuderingResultat } from "@fpsak-frontend/sak-totrinnskontroll/src/TotrinnskontrollSakIndex";

export default interface BehandlingKlageVurdering {
  klageVurdering: string;
  klageVurderingOmgjoer: string;
  klageVurderingResultatNFP: KlageVuderingResultat;
  klageVurderingResultatNK: KlageVuderingResultat;
}
