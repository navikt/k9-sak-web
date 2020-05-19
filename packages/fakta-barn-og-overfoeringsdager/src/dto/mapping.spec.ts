import { expect } from 'chai';
import moment from 'moment';
import { mapDtoTilFormValues, mapFormValuesTilDto } from './mapping';
import OmsorgsdagerGrunnlagDto from './OmsorgsdagerGrunnlagDto';
import { DagerGitt, DagerMottatt, UtvidetRettDto } from './RammevedtakDto';
import FormValues from '../types/FormValues';
import Overføring from '../types/Overføring';
import BarnDto from './BarnDto';
import { InformasjonskildeEnum } from './Informasjonskilde';

const tomOmsorgsdagerGrunnlag: OmsorgsdagerGrunnlagDto = {
  barn: [],
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

  it('legger til fom/tom for nye rammevetdak', () => {
    const nyOverføring: Overføring = {
      mottakerAvsenderFnr: '12312312312',
      kilde: InformasjonskildeEnum.LAGT_TIL_MANUELT,
      antallDager: 2,
    };
    const fnrAutoHentet = '01012040527';
    const idBarnManueltLagtTil = '1';
    const fDatoManueltLagtTil = '2020-01-01';
    const formValues: FormValues = {
      barn: [
        {
          fødselsnummer: fnrAutoHentet,
          erKroniskSykt: true,
          aleneomsorg: true,
        },
      ],
      begrunnelse: 'fordi',
      fordelingFår: [nyOverføring],
      fordelingGir: [nyOverføring],
      koronaoverføringFår: [nyOverføring],
      koronaoverføringGir: [nyOverføring],
      midlertidigAleneansvar: {
        erMidlertidigAlene: true,
        fom: '2020-01-01',
        tom: '2020-12-31',
      },
      overføringFår: [nyOverføring],
      overføringGir: [nyOverføring],
    };
    const initBarn: BarnDto = { fødselsnummer: fnrAutoHentet };

    const {
      barn,
      utvidetRett,
      overføringFår,
      fordelingFår,
      koronaoverføringFår,
      overføringGir,
      fordelingGir,
      koronaoverføringGir,
    } = mapFormValuesTilDto(formValues, { ...tomOmsorgsdagerGrunnlag, barn: [initBarn] });

    expect(barn).to.eql([initBarn]);
    expect(utvidetRett).to.have.length(2);
    const utvidetRettBarnAutomatiskHentet: UtvidetRettDto = utvidetRett.find(
      ({ fnrKroniskSyktBarn }) => fnrKroniskSyktBarn === fnrAutoHentet,
    );
    const utvidetRettManueltLagtTil: UtvidetRettDto = utvidetRett.find(
      ({ idKroniskSyktBarn }) => idKroniskSyktBarn === idBarnManueltLagtTil,
    );

    const currentYear = moment().year();

    expect(utvidetRettBarnAutomatiskHentet).to.eql({
      fnrKroniskSyktBarn: fnrAutoHentet,
      kilde: InformasjonskildeEnum.LAGT_TIL_MANUELT,
      fom: `${currentYear}-01-01`,
      tom: '2038-12-31',
    });
    expect(utvidetRettManueltLagtTil).to.eql({
      idKroniskSyktBarn: idBarnManueltLagtTil,
      fødselsdato: fDatoManueltLagtTil,
      kilde: InformasjonskildeEnum.LAGT_TIL_MANUELT,
      fom: `${currentYear}-01-01`,
      tom: '2038-12-31',
    });
    const dagerMottattExpected: DagerMottatt = {
      antallDager: nyOverføring.antallDager,
      avsendersFnr: nyOverføring.mottakerAvsenderFnr,
      kilde: nyOverføring.kilde,
      fom: `${currentYear}-01-01`,
      tom: `${currentYear}-12-31`,
    };
    const dagerGittExpected: DagerGitt = {
      antallDager: nyOverføring.antallDager,
      mottakersFnr: nyOverføring.mottakerAvsenderFnr,
      kilde: nyOverføring.kilde,
      fom: `${currentYear}-01-01`,
      tom: `${currentYear}-12-31`,
    };

    [overføringFår, fordelingFår, koronaoverføringFår].forEach(dagerMottatt => {
      expect(dagerMottatt).to.eql([dagerMottattExpected]);
    });
    [overføringGir, fordelingGir, koronaoverføringGir].forEach(dagerGitt => {
      expect(dagerGitt).to.eql([dagerGittExpected]);
    });
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
      aleneOmOmsorgen: [
        {
          fnrBarnAleneOm: '123',
          kilde: 'hentetAutomatisk',
          tom: '23.03.2020',
        },
        {
          idBarnAleneOm: '1',
          fødselsdato: '20.04.2018',
          kilde: 'lagtTilManuelt',
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
          kilde: 'lagtTilManuelt',
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
