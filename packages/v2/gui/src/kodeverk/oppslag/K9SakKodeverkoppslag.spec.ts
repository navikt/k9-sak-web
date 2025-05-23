import { oppslagKodeverkSomObjektK9Sak } from '../mocks/oppslagKodeverkSomObjektK9Sak.js';
import {
  AndelForFaktaOmBeregningDtoAktivitetStatus,
  type KodeverdiSomObjektAktivitetStatus,
  VenteårsakSomObjektKilde,
} from '@k9-sak-web/backend/k9sak/generated';
import { K9SakKodeverkoppslag } from './K9SakKodeverkoppslag.js';
import { OrUndefined } from './GeneriskKodeverkoppslag.js';

describe('Kodeverkoppslag', () => {
  const oppslag = new K9SakKodeverkoppslag(oppslagKodeverkSomObjektK9Sak);
  const dagpenger: KodeverdiSomObjektAktivitetStatus = {
    kode: 'DP',
    kodeverk: 'AKTIVITET_STATUS',
    navn: 'Dagpenger',
    kilde: 'DP',
  };
  it('skal returnere kodeverdi objekt for gitt kodeverdi enum', () => {
    const found: KodeverdiSomObjektAktivitetStatus | undefined = oppslag.aktivitetStatuser(
      AndelForFaktaOmBeregningDtoAktivitetStatus.DAGPENGER,
      'or undefined',
    );
    expect(found).toEqual(dagpenger);
  });

  it('skal returnere undefined for ugyldig kodeverdi når "or undefined" er gitt', () => {
    // @ts-expect-error Tester at ugyldig enum verdi gir undefined når 'or undefined' er satt (og typescript feil)
    const found: KodeverdiSomObjektAktivitetStatus | undefined = oppslag.aktivitetStatuser('XOXO', OrUndefined);
    expect(found).toBeUndefined();
  });

  it("skal kaste feil ved ugyldig kodeverdi når 'or undefined' ikke er satt", () => {
    // @ts-expect-error Tester at ugyldig enum verdi kaster feil når 'or undefined' ikkje er satt (og typescript feil)
    expect(() => oppslag.aktivitetStatuser('XOXO')).toThrowError();
  });

  it('skal returnere venteårsak med ekstra property satt', () => {
    const venteårsak = oppslag.venteårsaker(VenteårsakSomObjektKilde.LEGEERKLÆRING);
    expect(venteårsak).toEqual({
      kode: 'LEGEERKLÆRING',
      kodeverk: 'VENT_AARSAK',
      navn: 'Legeerklæring fra riktig lege',
      kilde: 'LEGEERKLÆRING',
      kanVelges: true,
    });
    expect(venteårsak?.kanVelges).toEqual(true);
  });

  it('skal ikkje ha undefined som retur type', () => {
    const found: KodeverdiSomObjektAktivitetStatus = oppslag.aktivitetStatuser(
      AndelForFaktaOmBeregningDtoAktivitetStatus.DAGPENGER,
    );
    expect(found).toEqual(dagpenger);
  });

  it('skal returnere objekt med korrekt navn property', () => {
    expect(oppslag.inntektskategorier('ARBEIDSAVKLARINGSPENGER').navn).toEqual('Arbeidsavklaringspenger');
    expect(oppslag.inntektskategorier('ARBEIDSAVKLARINGSPENGER', OrUndefined)?.navn).toEqual('Arbeidsavklaringspenger');

    // Denne har ulikt navn i forhold til k9-klage
    expect(oppslag.fagsakYtelseTyper('OMP_KS').navn).toEqual('Ekstra omsorgsdager kronisk syk');
  });
});
