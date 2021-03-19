import moment from 'moment';
import { Rammevedtak, RammevedtakEnum, RammevedtakType } from '@k9-sak-web/types/src/omsorgspenger/Rammevedtak';
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

const mapRammevedtakBarn = (
  tmpBarn: Record<string, Barn>,
  rammevedtak: Rammevedtak,
  fnrFeltnavn: string,
  typeFeltnavn: string,
) => {
  const fnr = rammevedtak[fnrFeltnavn];
  if (!fnr) {
    return tmpBarn;
  }
  const eksisterendeBarn = tmpBarn[fnr] || {};
  return {
    ...tmpBarn,
    [fnr]: {
      ...eksisterendeBarn,
      fødselsnummer: fnr,
      [typeFeltnavn]: {
        fom: rammevedtak.gyldigFraOgMed,
        tom: rammevedtak.gyldigTilOgMed,
      },
    },
  };
};

const mapUtvidetRettRammevedtakBarn = (
  tmpBarn: Record<string, Barn>,
  rammevedtak: Rammevedtak[],
  fnrFeltnavn: string,
  typeFeltnavn: string,
) => {
  const fnr = rammevedtak[0][fnrFeltnavn];
  if (!fnr) {
    return tmpBarn;
  }
  const eksisterendeBarn = tmpBarn[fnr] || {};

  const perioderRammevedtak = rammevedtak.map(rv => ({
    fom: rv.gyldigFraOgMed,
    tom: rv.gyldigTilOgMed,
  }));

  const obj = {
    [fnr]: {
      ...eksisterendeBarn,
      fødselsnummer: fnr,
      [typeFeltnavn]: perioderRammevedtak,
    },
  };

  return obj;
};

const mapDtoTilFormValues = (rammevedtak: Rammevedtak[]): FormValues => {
  const barn: Barn[] = Object.values(
    rammevedtak.reduce((tmpBarn, rv) => {
      if (rv.type === RammevedtakEnum.UTVIDET_RETT) {
        const alleUtvidetRettRammevedtak = rammevedtak.filter(rvedtak => rvedtak.utvidetRettFor === rv.utvidetRettFor);
        return mapUtvidetRettRammevedtakBarn(tmpBarn, alleUtvidetRettRammevedtak, 'utvidetRettFor', 'kroniskSykdom');
      }

      if (rv.type === RammevedtakEnum.ALENEOMSORG) {
        return mapRammevedtakBarn(tmpBarn, rv, 'aleneOmOmsorgenFor', 'aleneomsorg');
      }

      if (rv.type === RammevedtakEnum.FOSTERBARN) {
        return mapRammevedtakBarn(tmpBarn, rv, 'mottaker', 'fosterbarn');
      }

      if (rv.type === RammevedtakEnum.UTENLANDSK_BARN) {
        return mapRammevedtakBarn(tmpBarn, rv, 'fødselsdato', 'utenlandskBarn');
      }

      if (rv.type === RammevedtakEnum.DELT_BOSTED) {
        return mapRammevedtakBarn(tmpBarn, rv, 'deltBostedMed', 'deltBosted');
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
