import { Rammevedtak, RammevedtakEnum, RammevedtakType } from '@k9-sak-web/types/src/omsorgspenger/Rammevedtak';
import mapDtoTilFormValues from './mapping';

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
    overføringFårRammevedtak(RammevedtakEnum.OVERFØRING_FÅR, 'P1D'),
    overføringFårRammevedtak(RammevedtakEnum.FORDELING_FÅR, 'P2D'),
    overføringFårRammevedtak(RammevedtakEnum.KORONAOVERFØRING_FÅR, 'P3D'),
    overføringGirRammevedtak(RammevedtakEnum.OVERFØRING_GIR, 'P4D'),
    overføringGirRammevedtak(RammevedtakEnum.FORDELING_GIR, 'P5D'),
    overføringGirRammevedtak(RammevedtakEnum.KORONAOVERFØRING_GIR, 'P6D'),
  ];

  const { overføringFår, fordelingFår, koronaoverføringFår, overføringGir, fordelingGir, koronaoverføringGir } =
    mapDtoTilFormValues(rammevedtak);

  const assertOverføring = (overføring, expectedDager, expectedMottakerAvsender, expectedFom, expectedTom) => {
    expect(overføring).toEqual([
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
});
