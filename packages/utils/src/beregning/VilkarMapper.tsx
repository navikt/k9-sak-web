import { Vilkar as FTVilkarType } from '@navikt/ft-types';
import { BeregningReferanse, Vilkar } from '@k9-sak-web/types';

type Periode = { fom: string; tom: string };

const erForlengelse = (beregningreferanserTilVurdering: BeregningReferanse[], periode: Periode) => {
  const referanse = beregningreferanserTilVurdering.find(r => r.skjæringstidspunkt === periode.fom);
  if (referanse) {
    return referanse.erForlengelse;
  }
  return undefined;
};

const mapVilkar = (vilkar: Vilkar, beregningreferanserTilVurdering: BeregningReferanse[]): FTVilkarType =>
  ({
    vilkarType: vilkar.vilkarType,
    overstyrbar: vilkar.overstyrbar,
    perioder: vilkar.perioder.map(p => ({
      avslagKode: p.avslagKode,
      begrunnelse: p.begrunnelse,
      vurderesIBehandlingen: p.vurderesIBehandlingen,
      merknad: p.merknad,
      merknadParametere: p.merknadParametere,
      periode: p.periode,
      vilkarStatus: p.vilkarStatus,
      erForlengelse: erForlengelse(beregningreferanserTilVurdering, p.periode),
    })),
  }) as FTVilkarType;

export default mapVilkar;
