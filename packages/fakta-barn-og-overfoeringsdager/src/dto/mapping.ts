import moment from 'moment';
import { Rammevedtak, RammevedtakEnum, RammevedtakType } from '@k9-sak-web/types';
import FormValues from '../types/FormValues';
import Barn from '../types/Barn';
import Overføring from '../types/Overføring';

const mapOverføring = (type: RammevedtakType, rammevedtak: Rammevedtak[]): Overføring[] =>
  rammevedtak
    .filter(rv => rv.type === type)
    .map(({ gyldigFraOgMed, gyldigTilOgMed, mottaker, avsender, lengde }) => ({
      antallDager: moment.duration(lengde).asDays(),
      fom: gyldigFraOgMed,
      tom: gyldigTilOgMed,
      mottakerAvsenderFnr: mottaker || avsender,
    }));

const mapDtoTilFormValues = (rammevedtak: Rammevedtak[]): FormValues => {
  const barn: Barn[] = Object.values(
    rammevedtak.reduce((tmpBarn, rv) => {
      if (rv.type === RammevedtakEnum.UTVIDET_RETT) {
        const fnr = rv.utvidetRettFor;
        if (!fnr) {
          return tmpBarn;
        }
        const kroniskSyktBarn = tmpBarn[fnr] || {};
        return {
          ...tmpBarn,
          [fnr]: {
            ...kroniskSyktBarn,
            fødselsnummer: fnr,
            kroniskSykdom: {
              fom: rv.gyldigFraOgMed,
              tom: rv.gyldigTilOgMed,
            },
          },
        };
      }

      if (rv.type === RammevedtakEnum.ALENEOMSORG) {
        const fnr = rv.aleneOmOmsorgenFor;
        if (!fnr) {
          return tmpBarn;
        }
        const aleneomsorgsbarn = tmpBarn[fnr] || {};
        return {
          ...tmpBarn,
          [fnr]: {
            ...aleneomsorgsbarn,
            fødselsnummer: fnr,
            aleneomsorg: {
              fom: rv.gyldigFraOgMed,
              tom: rv.gyldigTilOgMed,
            },
          },
        };
      }

      if (rv.type === RammevedtakEnum.FOSTERBARN) {
        const fnr = rv.mottaker;
        if (!fnr) {
          return tmpBarn;
        }
        const fosterbarn = tmpBarn[fnr] || {};
        return {
          ...tmpBarn,
          [fnr]: {
            ...fosterbarn,
            fødselsnummer: fnr,
            fosterbarn: {
              fom: rv.gyldigFraOgMed,
              tom: rv.gyldigTilOgMed,
            },
          },
        };
      }

      return tmpBarn;
    }, {}),
  );

  return {
    barn,
    midlertidigAleneansvar: rammevedtak.find(rv => rv.type === RammevedtakEnum.MIDLERTIDIG_ALENEOMSORG),
    overføringGir: mapOverføring(RammevedtakEnum.OVERFØRING_GIR, rammevedtak),
    overføringFår: mapOverføring(RammevedtakEnum.OVERFØRING_FÅR, rammevedtak),
    fordelingGir: mapOverføring(RammevedtakEnum.FORDELING_GIR, rammevedtak),
    fordelingFår: mapOverføring(RammevedtakEnum.FORDELING_FÅR, rammevedtak),
    koronaoverføringGir: mapOverføring(RammevedtakEnum.KORONAOVERFØRING_GIR, rammevedtak),
    koronaoverføringFår: mapOverføring(RammevedtakEnum.KORONAOVERFØRING_FÅR, rammevedtak),
  };
};

export default mapDtoTilFormValues;
