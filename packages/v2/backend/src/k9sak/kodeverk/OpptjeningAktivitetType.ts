import type { OpptjeningAktivitetDto } from '../generated';
import type { Kodeverk } from '../../shared/Kodeverk.ts';

export type OpptjeningAktivitetType = Exclude<OpptjeningAktivitetDto['aktivitetType'], undefined>;

export type OpptjeningAktivitetTypeKodeverk = Kodeverk<OpptjeningAktivitetType, 'OPPTJENING_AKTIVITET_TYPE'>;

// lager enum ut av typen så ein kan bruke den der det er ønskelig
export const opptjeningAktivitetType: Readonly<Record<OpptjeningAktivitetType, OpptjeningAktivitetType>> = {
  ARBEID: 'ARBEID',
  FRISINN: 'FRISINN',
  AAP: 'AAP',
  DAGPENGER: 'DAGPENGER',
  ETTERLØNN_SLUTTPAKKE: 'ETTERLØNN_SLUTTPAKKE',
  FORELDREPENGER: 'FORELDREPENGER',
  FRILANS: 'FRILANS',
  MELLOM_ARBEID: 'MELLOM_ARBEID',
  NÆRING: 'NÆRING',
  MILITÆR_ELLER_SIVILTJENESTE: 'MILITÆR_ELLER_SIVILTJENESTE',
  OMSORGSPENGER: 'OMSORGSPENGER',
  OPPLÆRINGSPENGER: 'OPPLÆRINGSPENGER',
  PLEIEPENGER: 'PLEIEPENGER',
  PLEIEPENGER_AV_DAGPENGER: 'PLEIEPENGER_AV_DAGPENGER',
  SVANGERSKAPSPENGER: 'SVANGERSKAPSPENGER',
  SYKEPENGER: 'SYKEPENGER',
  SYKEPENGER_AV_DAGPENGER: 'SYKEPENGER_AV_DAGPENGER',
  UTDANNINGSPERMISJON: 'UTDANNINGSPERMISJON',
  UTENLANDSK_ARBEIDSFORHOLD: 'UTENLANDSK_ARBEIDSFORHOLD',
  VENTELØNN_VARTPENGER: 'VENTELØNN_VARTPENGER',
  VIDERE_ETTERUTDANNING: 'VIDERE_ETTERUTDANNING',
  '-': '-',
};
