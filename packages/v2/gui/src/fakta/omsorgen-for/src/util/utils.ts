import type { k9_sak_typer_Periode as Periode } from '@k9-sak-web/backend/k9sak/generated/types.js';
import {
  k9_kodeverk_sykdom_Resultat as Resultat,
  type k9_sak_kontrakt_omsorg_OmsorgenForDto as OmsorgenForDto,
  type k9_sak_kontrakt_omsorg_OmsorgenForOversiktDto as OmsorgenForOversiktDto,
} from '@k9-sak-web/backend/k9sak/generated/types.js';
import { fagsakYtelsesType, type FagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';

import { initializeDate } from '@k9-sak-web/lib/dateUtils/initializeDate.js';
import { prettifyDateString } from '@navikt/ft-utils';
import * as messages from '../../nb_NO';

export const teksterForSakstype = (sakstype?: FagsakYtelsesType) => {
  if (sakstype === fagsakYtelsesType.PLEIEPENGER_SYKT_BARN) {
    return messages.pleiepenger;
  }

  if (sakstype === fagsakYtelsesType.OMSORGSPENGER) {
    return messages.omsorgspenger;
  }
  if (sakstype === fagsakYtelsesType.OPPLÆRINGSPENGER) {
    return messages.opplaeringspenger;
  }
  return messages.pleiepenger;
};

const periodeManglerVurdering = (periode: OmsorgenForDto) =>
  periode.resultat === Resultat.IKKE_VURDERT && periode.resultatEtterAutomatikk === Resultat.IKKE_VURDERT;

export const erAutomatiskVurdert = (periode: OmsorgenForDto) =>
  periode.resultatEtterAutomatikk === Resultat.OPPFYLT || periode.resultatEtterAutomatikk === Resultat.IKKE_OPPFYLT;

export const erManueltVurdert = (periode: OmsorgenForDto) => {
  return periode.resultat === Resultat.OPPFYLT || periode.resultat === Resultat.IKKE_OPPFYLT;
};

const erVurdert = (periode: OmsorgenForDto) => {
  return erManueltVurdert(periode) || erAutomatiskVurdert(periode);
};

export const finnPerioderTilVurdering = (omsorgsperioder: OmsorgenForOversiktDto['omsorgsperioder']) =>
  omsorgsperioder?.filter(omsorgsperiode => periodeManglerVurdering(omsorgsperiode)) ?? [];

export const finnVurdertePerioder = (omsorgsperioder: OmsorgenForOversiktDto['omsorgsperioder']) =>
  omsorgsperioder?.filter(omsorgsperiode => erVurdert(omsorgsperiode)) ?? [];

export const harPerioderTilVurdering = (omsorgsperioder: OmsorgenForOversiktDto['omsorgsperioder']) =>
  omsorgsperioder?.some(periode => periodeManglerVurdering(periode));

export const prettifyPeriode = (periode: Periode) =>
  `${prettifyDateString(periode.fom)} - ${prettifyDateString(periode.tom)}`;

export const periodeStartsBefore = (thisPeriode: Periode, otherPeriode: Periode) => {
  const dateInQuestion = initializeDate(otherPeriode.fom);
  const periodFom = initializeDate(thisPeriode.fom);
  return periodFom.isBefore(dateInQuestion);
};

export const hentResultatFraPeriode = (periode: OmsorgenForDto) => {
  if (periode.resultat === Resultat.IKKE_VURDERT) {
    return periode.resultatEtterAutomatikk;
  }
  if (periode.resultatEtterAutomatikk === Resultat.IKKE_VURDERT) {
    return periode.resultat;
  }
  return periode.resultat || periode.resultatEtterAutomatikk;
};

export const asListOfDays = (periode: Periode) => {
  const fomDayjs = initializeDate(periode.fom);
  const tomDayjs = initializeDate(periode.tom);

  const list: string[] = [];
  for (let currentDate = fomDayjs; currentDate.isSameOrBefore(tomDayjs); currentDate = currentDate.add(1, 'day')) {
    list.push(currentDate.format('YYYY-MM-DD'));
  }

  return list;
};

export const periodeIncludesDate = (periode: Periode, dateString: string) => {
  const dateInQuestion = initializeDate(dateString);
  const fomDayjs = initializeDate(periode.fom);
  const tomDayjs = initializeDate(periode.tom);
  return (
    (dateInQuestion.isSame(fomDayjs) || dateInQuestion.isAfter(fomDayjs)) &&
    (dateInQuestion.isSame(tomDayjs) || dateInQuestion.isBefore(tomDayjs))
  );
};

export const erOppfylt = (periode: OmsorgenForDto) =>
  periode.resultat === Resultat.OPPFYLT || periode.resultatEtterAutomatikk === Resultat.OPPFYLT;

export const erIkkeOppfylt = (periode: OmsorgenForDto) =>
  periode.resultat === Resultat.IKKE_OPPFYLT || periode.resultatEtterAutomatikk === Resultat.IKKE_OPPFYLT;
