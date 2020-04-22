import { expect } from 'chai';
import { mapDtoTilFormValues, mapFormValuesTilDto } from './mapping';
import OmsorgsdagerGrunnlagDto from './OmsorgsdagerGrunnlagDto';

const tomOmsorgsdagerGrunnlag: OmsorgsdagerGrunnlagDto = {
  barn: [],
  barnLagtTilAvSakbehandler: [],
  utvidetRett: [],
  overføringFår: [],
  overføringGir: [],
  koronaoverføringFår: [],
  koronaoverføringGir: [],
};

describe('mapping fra DTO til formValues', () => {
  it('mapper rammevedtak om utvidet rett til barn', () => {
    const fnrKroniskSyktBarn = '123';
    const omsorgsdagerGrunnlagDto: OmsorgsdagerGrunnlagDto = {
      ...tomOmsorgsdagerGrunnlag,
      utvidetRett: [
        {
          kilde: 'hentetAutomatisk',
          fnrKroniskSyktBarn,
        },
      ],
      barn: [
        {
          fødselsnummer: fnrKroniskSyktBarn,
          aleneomsorg: false,
        },
        {
          fødselsnummer: '456',
          aleneomsorg: false,
        },
      ],
    };
    const { barn } = mapDtoTilFormValues(omsorgsdagerGrunnlagDto);

    expect(barn).to.have.length(2);
    // eslint-disable-next-line no-unused-expressions
    expect(barn[0].erKroniskSykt).to.be.true;
    // eslint-disable-next-line no-unused-expressions
    expect(barn[1].erKroniskSykt).to.be.false;
  });

  it('kan mappe fra og til DTO uten å miste data', () => {
    const omsorgsdagerGrunnlagDto: OmsorgsdagerGrunnlagDto = {
      barn: [
        {
          aleneomsorg: true,
          fødselsnummer: '123',
        },
      ],
      barnLagtTilAvSakbehandler: [
        {
          aleneomsorg: false,
          fødselsdato: '23.02.2019',
          id: '1',
        },
      ],
      utvidetRett: [
        {
          fnrKroniskSyktBarn: '123',
          kilde: 'hentetAutomatisk',
          fom: '23.03.2020',
          tom: '23.03.2025',
        },
        {
          idKroniskSyktBarn: '1',
          kilde: 'lagtTilAvSaksbehandler',
          fom: '23.03.2020',
          tom: '23.03.2025',
        },
      ],
      midlertidigAleneOmOmsorgen: {
        erMidlertidigAlene: true,
        kilde: 'hentetAutomatisk',
        fom: '23.03.2020',
        tom: '23.03.2025',
      },
      overføringGir: [
        {
          antallDager: 23,
          mottakersFnr: '345',
          kilde: 'hentetAutomatisk',
          fom: '23.03.2020',
          tom: '23.03.2025',
        },
      ],
      overføringFår: [
        {
          antallDager: 23,
          avsendersFnr: '123',
          kilde: 'hentetAutomatisk',
          fom: '23.03.2020',
          tom: '23.03.2025',
        },
      ],
      koronaoverføringGir: [
        {
          antallDager: 23,
          mottakersFnr: '345',
          kilde: 'hentetAutomatisk',
          fom: '23.03.2020',
          tom: '23.03.2025',
        },
      ],
      koronaoverføringFår: [
        {
          antallDager: 23,
          avsendersFnr: '123',
          kilde: 'hentetAutomatisk',
          fom: '23.03.2020',
          tom: '23.03.2025',
        },
      ],
    };

    const mappet = mapFormValuesTilDto(mapDtoTilFormValues(omsorgsdagerGrunnlagDto), omsorgsdagerGrunnlagDto);

    expect(mappet).to.eql(omsorgsdagerGrunnlagDto);
  });
});
