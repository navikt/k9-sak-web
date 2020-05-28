import stringEnum from '../tsUtils';

export const RammevedtakEnum = stringEnum({
  UIDENTIFISERT: 'UidentifisertRammevedtak',
  SMITTEVERNDAGER: 'Smittevern',
  OVERFØRING_FÅR: 'OverføringFår',
  OVERFØRING_GIR: 'OverføringGir',
  FORDELING_FÅR: 'FordeligFår',
  FORDELING_GIR: 'FordelingGir',
  KORONAOVERFØRING_FÅR: 'KoronaOverføringFår',
  KORONAOVERFØRING_GIR: 'KoronaOverføringGir',
  UTVIDET_RETT: 'UtvidetRett',
  ALENEOMSORG: 'AleneOmOmsorgen',
  MIDLERTIDIG_ALENEOMSORG: 'MidlertidigAleneOmOmsorgen',
});

export type RammevedtakType = typeof RammevedtakEnum[keyof typeof RammevedtakEnum];

interface Rammevedtak {
  type: RammevedtakType;
  gyldigFraOgMed?: string;
  gyldigTilOgMed?: string;
  vedtatt?: string;
  fritekst?: string;
  avsender?: string;
  mottaker?: string;
  utvidetRettFor?: string;
  aleneOmOmsorgenFor?: string;
  lengde?: string; // Duration (smittevernsdager)
}

export default Rammevedtak;
