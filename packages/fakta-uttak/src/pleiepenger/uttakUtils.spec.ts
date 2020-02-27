import { expect } from 'chai';
import { ArbeidsforholdPeriode } from './UttakFaktaIndex2';
import { beregnNyePerioder } from './uttakUtils';

describe('beregner nye perioder fra en periodeendring', () => {
  const periode1 = {
    fom: '2020-01-01',
    tom: '2020-01-31',
    timerIJobbTilVanlig: 30,
    fårJobbetProsent: 20,
  };
  const periode2 = {
    fom: '2020-02-01',
    tom: '2020-02-29',
    timerIJobbTilVanlig: 30,
    fårJobbetProsent: 20,
  };

  const perioder: ArbeidsforholdPeriode[] = [periode1, periode2];

  it('ny periode innenfor en eksisterende, splitter opp den eksisterende', () => {
    const periodeInniFørstePeriode: ArbeidsforholdPeriode = {
      fom: '2020-01-07',
      tom: '2020-01-14',
      timerIJobbTilVanlig: 20,
      fårJobbetProsent: 10,
    };

    const nyePerioder = beregnNyePerioder(perioder, periodeInniFørstePeriode);

    expect(nyePerioder).to.have.length(4);
    expect(nyePerioder[0]).to.eql({
      ...periode1,
      tom: '2020-01-06',
    });
    expect(nyePerioder[1]).to.eql(periodeInniFørstePeriode);
    expect(nyePerioder[2]).to.eql({
      ...periode1,
      fom: '2020-01-15',
    });
    expect(nyePerioder[3]).to.eql(periode2);
  });

  it('ny periode lik eksisterende, erstatter den eksisterende', () => {
    const nyPeriode: ArbeidsforholdPeriode = {
      ...periode2,
      timerIJobbTilVanlig: 40,
      fårJobbetProsent: 50,
    };

    const nyePerioder = beregnNyePerioder(perioder, nyPeriode);

    expect(nyePerioder).to.have.length(2);
    expect(nyePerioder[0]).to.eql(periode1);
    expect(nyePerioder[1]).to.eql(nyPeriode);
  });

  it('ny periode som overlapper eksisterende periode, overksriver overlappende del', () => {
    const nyPeriode: ArbeidsforholdPeriode = {
      fom: '2020-01-15',
      tom: '2020-02-15',
      timerIJobbTilVanlig: 10,
      fårJobbetProsent: 50,
    };

    const nyePerioder = beregnNyePerioder(perioder, nyPeriode);

    expect(nyePerioder).to.have.length(3);
    expect(nyePerioder[0]).to.eql({
      ...periode1,
      tom: '2020-01-14',
    });
    expect(nyePerioder[1]).to.eql(nyPeriode);
    expect(nyePerioder[2]).to.eql({
      ...periode2,
      fom: '2020-02-16',
    });
  });

  it('ny periode starter før første og slutter etter siste eksisterende perioder, erstatter alt', () => {
    const nyPeriode: ArbeidsforholdPeriode = {
      fom: '2019-01-01',
      tom: '2021-01-01',
      timerIJobbTilVanlig: 50,
      fårJobbetProsent: 50,
    };

    const nyePerioder = beregnNyePerioder(perioder, nyPeriode);

    expect(nyePerioder).to.eql([nyPeriode]);
  });
});
