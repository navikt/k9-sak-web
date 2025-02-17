import type { Inntektsforhold, VurderInntektsforholdPeriode } from '../../types/BeregningsgrunnlagFordeling';
import { slaaSammenPerioder } from './TilkommetAktivitetUtils';

const lagInntektsforhold = (aktivitetStatus: string, arbeidsgiverId: string): Inntektsforhold => ({
  aktivitetStatus,
  arbeidsgiverId,
  arbeidsforholdId: '',
  skalRedusereUtbetaling: false,
});

const lagInntektsperiode = (fom: string, tom: string, andeler?: Inntektsforhold[]): VurderInntektsforholdPeriode => ({
  fom,
  tom,
  inntektsforholdListe: andeler || [],
});

describe('<TilkommetAktivitetUtils>', () => {
  it('skal slå sammen to perioder som går vegg i vegg', () => {
    const inntektsforhold = lagInntektsforhold('AT', '123');
    const perioder = [
      lagInntektsperiode('2023-04-03', '2023-04-05', [inntektsforhold]),
      lagInntektsperiode('2023-04-06', '2023-04-07', [inntektsforhold]),
    ];
    const resultat = slaaSammenPerioder(perioder, []);
    expect(resultat).toHaveLength(1);
    expect(resultat[0]?.fom).toBe('2023-04-03');
    expect(resultat[0]?.tom).toBe('2023-04-07');
  });

  it('skal slå sammen tre perioder som går vegg i vegg med helg mellom', () => {
    const inntektsforhold = lagInntektsforhold('AT', '123');
    const perioder = [
      lagInntektsperiode('2023-04-03', '2023-04-05', [inntektsforhold]),
      lagInntektsperiode('2023-04-06', '2023-04-07', [inntektsforhold]),
      lagInntektsperiode('2023-04-10', '2023-04-13', [inntektsforhold]),
    ];
    const resultat = slaaSammenPerioder(perioder, []);
    expect(resultat).toHaveLength(1);
    expect(resultat[0]?.fom).toBe('2023-04-03');
    expect(resultat[0]?.tom).toBe('2023-04-13');
  });

  it('skal ikke slå sammen perioder med en dag i mellom som ikke er helg', () => {
    const inntektsforhold = lagInntektsforhold('AT', '123');
    const perioder = [
      lagInntektsperiode('2023-04-03', '2023-04-04', [inntektsforhold]),
      lagInntektsperiode('2023-04-06', '2023-04-07', [inntektsforhold]),
    ];
    const resultat = slaaSammenPerioder(perioder, []);
    expect(resultat).toHaveLength(2);
    expect(resultat[0]?.fom).toBe('2023-04-03');
    expect(resultat[0]?.tom).toBe('2023-04-04');
    expect(resultat[1]?.fom).toBe('2023-04-06');
    expect(resultat[1]?.tom).toBe('2023-04-07');
  });

  it('skal slå sammen perioder med helg i mellom, og ikke slå sammen perioder med virkedager i mellom', () => {
    const inntektsforhold = lagInntektsforhold('AT', '123');
    const perioder = [
      lagInntektsperiode('2023-04-03', '2023-04-04', [inntektsforhold]),
      lagInntektsperiode('2023-04-06', '2023-04-07', [inntektsforhold]),
      lagInntektsperiode('2023-04-11', '2023-04-14', [inntektsforhold]),
      lagInntektsperiode('2023-04-17', '2023-04-21', [inntektsforhold]),
    ];
    const resultat = slaaSammenPerioder(perioder, []);
    expect(resultat).toHaveLength(3);
    expect(resultat[0]?.fom).toBe('2023-04-03');
    expect(resultat[0]?.tom).toBe('2023-04-04');
    expect(resultat[1]?.fom).toBe('2023-04-06');
    expect(resultat[1]?.tom).toBe('2023-04-07');
    expect(resultat[2]?.fom).toBe('2023-04-11');
    expect(resultat[2]?.tom).toBe('2023-04-21');
  });
});
