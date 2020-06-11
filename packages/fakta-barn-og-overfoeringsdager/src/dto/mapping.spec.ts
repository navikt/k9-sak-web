import { expect } from 'chai';
import { Rammevedtak, RammevedtakEnum, RammevedtakType } from '@k9-sak-web/types/src/omsorgspenger/Rammevedtak';
import mapDtoTilFormValues from './mapping';

const barnFnr = '12312312312';
const annetBarnFnr = '78978978978';

const utvidetRettManglendeFnr: Rammevedtak = {
  type: RammevedtakEnum.UTVIDET_RETT,
  gyldigFraOgMed: '2020-01-01',
  gyldigTilOgMed: '2028-12-31',
};

const utvidetRett: Rammevedtak = {
  ...utvidetRettManglendeFnr,
  utvidetRettFor: barnFnr,
};

const aleneOmOmsorgen: Rammevedtak = {
  type: RammevedtakEnum.ALENEOMSORG,
  aleneOmOmsorgenFor: barnFnr,
  gyldigFraOgMed: '2020-01-01',
  gyldigTilOgMed: '2020-12-31',
};

const fosterbarn: Rammevedtak = {
  type: RammevedtakEnum.FOSTERBARN,
  mottaker: '010119',
  gyldigFraOgMed: '2019-02-20',
  gyldigTilOgMed: '2021-12-31',
};

const utenlandskBarn: Rammevedtak = {
  type: RammevedtakEnum.UTENLANDSK_BARN,
  fødselsdato: '030318',
  gyldigFraOgMed: '2019-02-20',
  gyldigTilOgMed: '2021-12-31',
};

const midlertidigAleneOmOmsorgen: Rammevedtak = {
  type: RammevedtakEnum.MIDLERTIDIG_ALENEOMSORG,
  gyldigFraOgMed: '2020-01-01',
  gyldigTilOgMed: '2020-12-31',
};

const uidentifisertRammevedtak: Rammevedtak = {
  type: RammevedtakEnum.UIDENTIFISERT,
  fritekst: 'Utolkbar tekst beep boop',
};

const avsender = '02028920544';
const gyldigFraOgMedFår = '2020-01-01';
const gyldigTilOgMedFår = '2020-12-31';
const overføringFårRammevedtak = (type: RammevedtakType, lengde): Rammevedtak => ({
  type,
  lengde,
  avsender,
  gyldigFraOgMed: gyldigFraOgMedFår,
  gyldigTilOgMed: gyldigTilOgMedFår,
});

const mottaker = '03058945104';
const gyldigFraOgMedGir = '2019-01-01';
const gyldigTilOgMedGir = '2019-12-31';
const overføringGirRammevedtak = (type: RammevedtakType, lengde): Rammevedtak => ({
  type,
  lengde,
  mottaker,
  gyldigFraOgMed: gyldigFraOgMedGir,
  gyldigTilOgMed: gyldigTilOgMedGir,
});

it('mapping fra DTO til formValues', () => {
  const rammevedtak: Rammevedtak[] = [
    utvidetRett,
    utvidetRettManglendeFnr,
    aleneOmOmsorgen,
    { ...aleneOmOmsorgen, aleneOmOmsorgenFor: annetBarnFnr },
    fosterbarn,
    utenlandskBarn,
    midlertidigAleneOmOmsorgen,
    uidentifisertRammevedtak,
    overføringFårRammevedtak(RammevedtakEnum.OVERFØRING_FÅR, 'P1D'),
    overføringFårRammevedtak(RammevedtakEnum.FORDELING_FÅR, 'P2D'),
    overføringFårRammevedtak(RammevedtakEnum.KORONAOVERFØRING_FÅR, 'P3D'),
    overføringGirRammevedtak(RammevedtakEnum.OVERFØRING_GIR, 'P4D'),
    overføringGirRammevedtak(RammevedtakEnum.FORDELING_GIR, 'P5D'),
    overføringGirRammevedtak(RammevedtakEnum.KORONAOVERFØRING_GIR, 'P6D'),
  ];

  const {
    barn,
    midlertidigAleneansvar,
    overføringFår,
    fordelingFår,
    koronaoverføringFår,
    overføringGir,
    fordelingGir,
    koronaoverføringGir,
  } = mapDtoTilFormValues(rammevedtak);

  expect(barn).to.have.length(4);
  expect(barn[0].fødselsnummer).to.equal(barnFnr);
  expect(barn[0].kroniskSykdom).to.eql({ fom: utvidetRett.gyldigFraOgMed, tom: utvidetRett.gyldigTilOgMed });
  expect(barn[0].aleneomsorg).to.eql({ fom: aleneOmOmsorgen.gyldigFraOgMed, tom: aleneOmOmsorgen.gyldigTilOgMed });
  expect(barn[1].kroniskSykdom).to.equal(undefined);
  expect(barn[1].aleneomsorg).to.eql({ fom: aleneOmOmsorgen.gyldigFraOgMed, tom: aleneOmOmsorgen.gyldigTilOgMed });
  expect(barn[2].fødselsnummer).to.eql(fosterbarn.mottaker);
  expect(barn[2].fosterbarn).to.eql({ fom: fosterbarn.gyldigFraOgMed, tom: fosterbarn.gyldigTilOgMed });
  expect(barn[3].fødselsnummer).to.eql(utenlandskBarn.fødselsdato);
  expect(barn[3].utenlandskBarn).to.eql({ fom: utenlandskBarn.gyldigFraOgMed, tom: utenlandskBarn.gyldigTilOgMed });

  const assertOverføring = (overføring, expectedDager, expectedMottakerAvsender, expectedFom, expectedTom) => {
    expect(overføring).to.eql([
      {
        antallDager: expectedDager,
        mottakerAvsenderFnr: expectedMottakerAvsender,
        fom: expectedFom,
        tom: expectedTom,
      },
    ]);
  };

  assertOverføring(overføringFår, 1, avsender, gyldigFraOgMedFår, gyldigTilOgMedFår);
  assertOverføring(fordelingFår, 2, avsender, gyldigFraOgMedFår, gyldigTilOgMedFår);
  assertOverføring(koronaoverføringFår, 3, avsender, gyldigFraOgMedFår, gyldigTilOgMedFår);
  assertOverføring(overføringGir, 4, mottaker, gyldigFraOgMedGir, gyldigTilOgMedGir);
  assertOverføring(fordelingGir, 5, mottaker, gyldigFraOgMedGir, gyldigTilOgMedGir);
  assertOverføring(koronaoverføringGir, 6, mottaker, gyldigFraOgMedGir, gyldigTilOgMedGir);

  expect(midlertidigAleneansvar).to.eql(midlertidigAleneansvar);
});
