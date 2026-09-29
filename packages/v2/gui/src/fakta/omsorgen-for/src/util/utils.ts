import { fagsakYtelsesType, type FagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import { Resultat } from '@k9-sak-web/backend/k9sak/kodeverk/sykdom/Resultat.js';
import type { OmsorgenForDto } from '@k9-sak-web/backend/k9sak/kontrakt/omsorg/OmsorgenForDto.js';
import type { OmsorgenForOversiktDto } from '@k9-sak-web/backend/k9sak/kontrakt/omsorg/OmsorgenForOversiktDto.js';
import type { Periode } from '@k9-sak-web/backend/k9sak/kontrakt/Periode.js';

import { prettifyDateString } from '@k9-sak-web/lib/dateUtils/dateUtils.js';
import { initializeDate } from '@k9-sak-web/lib/dateUtils/initializeDate.js';
import * as messages from '../../nb_NO';

type TeksterForSakstype = Omit<typeof messages.omsorgspenger, 'vurdering.hjemmel.hjelpetekst'> &
  Partial<Pick<typeof messages.omsorgspenger, 'vurdering.hjemmel.hjelpetekst'>>;

export const teksterForSakstype = (sakstype?: FagsakYtelsesType): TeksterForSakstype => {
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

/** Perioder som tvinges til manuell vurdering er ferdig vurdert, men skal likevel åpnes i redigeringsmodus. */
export const skalVisesIRedigeringsmodus = (periode: OmsorgenForDto) =>
  periodeManglerVurdering(periode) || !!periode.skalTvingesTilManuellVurdering;

export const finnRedigerbarePerioder = (omsorgsperioder: OmsorgenForOversiktDto['omsorgsperioder']) =>
  omsorgsperioder?.filter(omsorgsperiode => skalVisesIRedigeringsmodus(omsorgsperiode)) ?? [];

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

export const erOppfylt = (periode: OmsorgenForDto) => hentResultatFraPeriode(periode) === Resultat.OPPFYLT;

export const erIkkeOppfylt = (periode: OmsorgenForDto) => hentResultatFraPeriode(periode) === Resultat.IKKE_OPPFYLT;
