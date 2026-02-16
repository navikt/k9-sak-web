import type { k9_sak_kontrakt_vilkår_VilkårMedPerioderDto as VilkårMedPerioderDto } from '@k9-sak-web/backend/k9sak/generated/types.js';
import type { BeregningReferanse } from '@k9-sak-web/types';

type Periode = { fom: string; tom: string };

const erForlengelse = (beregningreferanserTilVurdering: BeregningReferanse[], periode: Periode) => {
  const referanse = beregningreferanserTilVurdering.find(r => r.skjæringstidspunkt === periode.fom);
  if (referanse) {
    return referanse.erForlengelse;
  }
  return undefined;
};

const mapVilkar = (vilkar: VilkårMedPerioderDto, beregningreferanserTilVurdering: BeregningReferanse[]) => {
  if (vilkar.perioder == null) {
    throw new Error(`vilkar.perioder must be defined.`);
  }
  return {
    vilkarType: vilkar?.vilkarType,
    overstyrbar: vilkar?.overstyrbar,
    perioder: vilkar?.perioder?.map(p => ({
      avslagKode: p.avslagKode,
      begrunnelse: p.begrunnelse,
      vurderesIBehandlingen: p.vurderesIBehandlingen,
      merknad: p.merknad,
      merknadParametere: p.merknadParametere,
      periode: p.periode,
      vilkarStatus: p.vilkarStatus,
      erForlengelse: erForlengelse(beregningreferanserTilVurdering, p.periode),
    })),
  };
};

export default mapVilkar;
