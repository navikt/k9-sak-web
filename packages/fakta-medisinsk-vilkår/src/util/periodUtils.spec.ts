import { Period } from '@fpsak-frontend/utils';
import { slåSammenSammenhengendePerioder } from './periodUtils';

const sammenhengendePerioder = [
  { fom: '2021-06-14', tom: '2021-06-20' },
  { fom: '2021-06-21', tom: '2021-06-30' },
  { fom: '2021-07-01', tom: '2021-09-01' },
  { fom: '2021-09-02', tom: '2021-09-10' },
  { fom: '2021-09-11', tom: '2021-09-15' },
  { fom: '2021-09-16', tom: '2021-09-20' },
  { fom: '2021-09-21', tom: '2021-10-14' },
  { fom: '2021-10-15', tom: '2021-10-22' },
  { fom: '2021-10-23', tom: '2021-10-29' },
  { fom: '2021-10-30', tom: '2021-12-07' },
  { fom: '2021-12-08', tom: '2021-12-08' },
  { fom: '2021-12-09', tom: '2021-12-13' },
  { fom: '2021-12-14', tom: '2021-12-21' },
  { fom: '2021-12-22', tom: '2021-12-31' },
  { fom: '2022-01-01', tom: '2022-02-01' },
  { fom: '2022-02-02', tom: '2022-02-09' },
  { fom: '2022-02-10', tom: '2022-03-02' },
  { fom: '2022-03-03', tom: '2022-03-29' },
  { fom: '2022-03-30', tom: '2022-04-27' },
  { fom: '2022-04-28', tom: '2022-06-10' },
].map(period => new Period(period.fom, period.tom));

const overlappendePerioder = [
  { fom: '2021-06-14', tom: '2021-06-25' },
  { fom: '2021-06-21', tom: '2021-07-01' },
  { fom: '2021-07-01', tom: '2021-09-09' },
  { fom: '2021-09-02', tom: '2021-09-10' },
].map(period => new Period(period.fom, period.tom));

const perioderSomIkkeHengerSammen = [
  { fom: '2021-06-14', tom: '2021-06-17' },
  { fom: '2021-06-21', tom: '2021-06-25' },
  { fom: '2021-07-01', tom: '2021-09-01' },
  { fom: '2021-09-06', tom: '2021-09-10' },
].map(period => new Period(period.fom, period.tom));

const blandedePerioder = [
  { fom: '2021-06-14', tom: '2021-06-25' },
  { fom: '2021-06-21', tom: '2021-07-01' },
  { fom: '2021-07-01', tom: '2021-09-09' },
  { fom: '2021-09-12', tom: '2021-09-17' },
  { fom: '2021-09-18', tom: '2021-09-25' },
  { fom: '2021-09-27', tom: '2021-09-30' },
  { fom: '2021-10-02', tom: '2021-10-07' },
].map(period => new Period(period.fom, period.tom));

describe('periodUtils', () => {
  test('slår sammen sammenhengende perioder', () => {
    const perioder = slåSammenSammenhengendePerioder(sammenhengendePerioder);
    expect(perioder.length).toEqual(1);
    expect(perioder[0].fom).toEqual('2021-06-14');
    expect(perioder[0].tom).toEqual('2022-06-10');
  });
  test('slår sammen overlappende perioder', () => {
    const perioder = slåSammenSammenhengendePerioder(overlappendePerioder);
    expect(perioder.length).toEqual(1);
    expect(perioder[0].fom).toEqual('2021-06-14');
    expect(perioder[0].tom).toEqual('2021-09-10');
  });
  test('slår ikke sammen perioder som ikke henger sammen', () => {
    const perioder = slåSammenSammenhengendePerioder(perioderSomIkkeHengerSammen);
    expect(perioder.length).toEqual(4);
    expect(perioder.every((periode, index) => periode === perioderSomIkkeHengerSammen[index])).toEqual(true);
  });
  test('håndterer at noen perioder slås sammen og andre ikke', () => {
    const perioder = slåSammenSammenhengendePerioder(blandedePerioder);
    expect(perioder.length).toEqual(4);
    expect(perioder[0].fom).toEqual(blandedePerioder[0].fom);
    expect(perioder[0].tom).toEqual(blandedePerioder[2].tom);
    expect(perioder[1].fom).toEqual(blandedePerioder[3].fom);
    expect(perioder[1].tom).toEqual(blandedePerioder[4].tom);
    expect(perioder[2].fom).toEqual(blandedePerioder[5].fom);
    expect(perioder[2].tom).toEqual(blandedePerioder[5].tom);
    expect(perioder[3].fom).toEqual(blandedePerioder[6].fom);
    expect(perioder[3].tom).toEqual(blandedePerioder[6].tom);
  });
});
