import stringEnum from '../tsUtils';

export const RammevedtakEnum = stringEnum({
  UIDENTIFISERT: 'UidentifisertRammevedtak',
  SMITTEVERNDAGER: 'Smittevern',
  OVERFØRING_FÅR: 'OverføringFår',
  OVERFØRING_GIR: 'OverføringGir',
  FORDELING_FÅR: 'FordelingFår',
  FORDELING_GIR: 'FordelingGir',
  KORONAOVERFØRING_FÅR: 'KoronaOverføringFår',
  KORONAOVERFØRING_GIR: 'KoronaOverføringGir',
  UTVIDET_RETT: 'UtvidetRett',
  ALENEOMSORG: 'AleneOmOmsorgen',
  MIDLERTIDIG_ALENEOMSORG: 'MidlertidigAleneOmOmsorgen',
  FOSTERBARN: 'Fosterbarn',
  UTENLANDSK_BARN: 'UtenlandskBarn',
  DELT_BOSTED: 'DeltBosted',
});

export type RammevedtakType = (typeof RammevedtakEnum)[keyof typeof RammevedtakEnum];

export type Rammevedtak = {
  type: RammevedtakType;
  gyldigFraOgMed?: string;
  gyldigTilOgMed?: string;
  vedtatt?: string;
  fritekst?: string;
  avsender?: string;
  mottaker?: string;
  utvidetRettFor?: string;
  aleneOmOmsorgenFor?: string;
  deltBostedMed?: string;
  fosterbarnFor?: string;
  fødselsdato?: string;
  lengde?: string; // Duration (smittevernsdager)
};

export default Rammevedtak;
