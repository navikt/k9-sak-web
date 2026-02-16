import {
  type Rammevedtak,
  RammevedtakEnum,
  type RammevedtakType,
} from '@k9-sak-web/types/src/omsorgspenger/Rammevedtak';
import moment from 'moment';
import type FormValues from '../types/FormValues';
import type Overføring from '../types/Overføring';

const mapOverføring = (type: RammevedtakType, rammevedtak: Rammevedtak[]): Overføring[] =>
  rammevedtak
    .filter(rv => rv.type === type)
    .map(({ gyldigFraOgMed, gyldigTilOgMed, mottaker, avsender, lengde }) => ({
      antallDager: moment.duration(lengde).asDays(),
      fom: gyldigFraOgMed,
      tom: gyldigTilOgMed,
      mottakerAvsenderFnr: mottaker || avsender,
    }));

const mapDtoTilFormValues = (rammevedtak: Rammevedtak[]): FormValues => ({
  overføringGir: mapOverføring(RammevedtakEnum.OVERFØRING_GIR, rammevedtak),
  overføringFår: mapOverføring(RammevedtakEnum.OVERFØRING_FÅR, rammevedtak),
  fordelingGir: mapOverføring(RammevedtakEnum.FORDELING_GIR, rammevedtak),
  fordelingFår: mapOverføring(RammevedtakEnum.FORDELING_FÅR, rammevedtak),
  koronaoverføringGir: mapOverføring(RammevedtakEnum.KORONAOVERFØRING_GIR, rammevedtak),
  koronaoverføringFår: mapOverføring(RammevedtakEnum.KORONAOVERFØRING_FÅR, rammevedtak),
});

export default mapDtoTilFormValues;
