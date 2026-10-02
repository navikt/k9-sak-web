import { Resultat } from '@k9-sak-web/backend/k9sak/kodeverk/sykdom/Resultat.js';
import type { OmsorgenForDto } from '@k9-sak-web/backend/k9sak/kontrakt/omsorg/OmsorgenForDto.js';
import type { OmsorgenForOversiktDto } from '@k9-sak-web/backend/k9sak/kontrakt/omsorg/OmsorgenForOversiktDto.js';
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

export const hentResultatFraPeriode = (periode: OmsorgenForDto) => {
  if (periode.resultat === Resultat.IKKE_VURDERT) {
    return periode.resultatEtterAutomatikk;
  }
  if (periode.resultatEtterAutomatikk === Resultat.IKKE_VURDERT) {
    return periode.resultat;
  }
  return periode.resultat || periode.resultatEtterAutomatikk;
};

export const erOppfylt = (periode: OmsorgenForDto) => hentResultatFraPeriode(periode) === Resultat.OPPFYLT;

export const erIkkeOppfylt = (periode: OmsorgenForDto) => hentResultatFraPeriode(periode) === Resultat.IKKE_OPPFYLT;
