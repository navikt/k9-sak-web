import { expect } from 'chai';
import ArbeidDto from './components/dto/ArbeidDto';
import { ISO_8601DurationToHours, mapDtoTilInternobjekt } from './UttakFaktaIndex';

describe('<UttakFaktaIndex>', () => {
  it('gjør om ISO 8601 duration til timer', () => {
    const duration_1 = 'PT7H30M';
    const timer_1 = ISO_8601DurationToHours(duration_1);
    expect(timer_1).to.eql(7.5);

    const duration_2 = 'PT37H30M';
    const timer_2 = ISO_8601DurationToHours(duration_2);
    expect(timer_2).to.eql(37.5);

    const duration_3 = 'PT101H6M';
    const timer_3 = ISO_8601DurationToHours(duration_3);
    expect(timer_3).to.eql(101.1);

    const duration_4 = 'PT7H';
    const timer_4 = ISO_8601DurationToHours(duration_4);
    expect(timer_4).to.eql(7);
  });
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
            jobberNormaltPerUke: 'PT37H30M',
            skalJobbeProsent: '80',
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
