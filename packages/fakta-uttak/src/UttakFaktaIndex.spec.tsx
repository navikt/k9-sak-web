import { expect } from 'chai';
import ArbeidDto from './components/dto/ArbeidDto';
import { mapDtoTilInternobjekt } from './UttakFaktaIndex';

describe('<UttakFaktaIndex>', () => {
  it('mapper om dto til internobjekt', () => {
    const arbeidDto: ArbeidDto[] = [
      {
        arbeidsforhold: {
          aktørId: null,
          arbeidsforholdId: '123456',
          organisasjonsnummer: '999999999',
          type: 'Arbeidsgiver',
        },
        perioder: {
          '2020-01-01/2020-02-01': {
            jobberNormaltPerUke: 37.5,
            skalJobbeProsent: 80,
          },
        },
      },
    ];

    const arbeid = mapDtoTilInternobjekt(arbeidDto);

    expect(arbeid).to.eql([
      {
        ...arbeidDto[0],
        perioder: [
          {
            fom: '2020-01-01',
            tom: '2020-02-01',
            timerIJobbTilVanlig: 37.5,
            timerFårJobbet: 30,
          },
        ],
      },
    ]);
  });
});
