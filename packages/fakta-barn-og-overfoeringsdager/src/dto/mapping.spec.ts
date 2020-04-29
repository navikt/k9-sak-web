import { expect } from 'chai';
import { mapDtoTilFormValues, mapFormValuesTilDto } from './mapping';
import OmsorgsdagerGrunnlagDto from './OmsorgsdagerGrunnlagDto';
import { DagerGitt, DagerMottatt } from './RammevedtakDto';

const tomOmsorgsdagerGrunnlag: OmsorgsdagerGrunnlagDto = {
  barn: [],
  barnLagtTilAvSakbehandler: [],
  aleneOmOmsorgen: [],
  utvidetRett: [],
  overføringFår: [],
  overføringGir: [],
  fordelingFår: [],
  fordelingGir: [],
  koronaoverføringFår: [],
  koronaoverføringGir: [],
  uidentifiserteRammevedtak: [],
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
        },
        {
          fødselsnummer: '456',
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
    const dagerGitt: DagerGitt[] = [
      {
        antallDager: 23,
        mottakersFnr: '345',
        kilde: 'hentetAutomatisk',
        fom: '23.03.2020',
        tom: '23.03.2025',
      },
    ];
    const dagerMottatt: DagerMottatt[] = [
      {
        antallDager: 23,
        avsendersFnr: '123',
        kilde: 'hentetAutomatisk',
        fom: '23.03.2020',
        tom: '23.03.2025',
      },
    ];
    const omsorgsdagerGrunnlagDto: OmsorgsdagerGrunnlagDto = {
      barn: [
        {
          fødselsnummer: '123',
        },
      ],
      barnLagtTilAvSakbehandler: [
        {
          fødselsdato: '23.02.2019',
          id: '1',
        },
      ],
      aleneOmOmsorgen: [
        {
          fnrBarnAleneOm: '123',
          kilde: 'hentetAutomatisk',
          tom: '23.03.2020',
        },
        {
          idBarnAleneOm: '1',
          fødselsdato: '20.04.2018',
          kilde: 'lagtTilAvSaksbehandler',
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
      overføringGir: dagerGitt,
      overføringFår: dagerMottatt,
      fordelingGir: dagerGitt,
      fordelingFår: dagerMottatt,
      koronaoverføringGir: dagerGitt,
      koronaoverføringFår: dagerMottatt,
      uidentifiserteRammevedtak: [],
    };

    const mappet = mapFormValuesTilDto(mapDtoTilFormValues(omsorgsdagerGrunnlagDto), omsorgsdagerGrunnlagDto);

    expect(mappet).to.eql(omsorgsdagerGrunnlagDto);
  });
});
