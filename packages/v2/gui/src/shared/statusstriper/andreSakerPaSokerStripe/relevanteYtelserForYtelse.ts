import { fagsakYtelsesType, type FagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';

export const finnRelevanteYtelserForYtelse = (fagsakYtelseType: FagsakYtelsesType) => {
  const ytelser: FagsakYtelsesType[] = [fagsakYtelseType];

  const ytelseGruppe = ytelsesGrupper[fagsakYtelseType];
  if (ytelseGruppe) {
    ytelseGruppe.forEach(ytelse => {
      if (ytelse !== fagsakYtelseType) {
        ytelser.push(ytelse);
      }
    });
  }

  return ytelser;
};

const pleiepengerGruppe = [
  fagsakYtelsesType.PLEIEPENGER_SYKT_BARN,
  fagsakYtelsesType.PLEIEPENGER_NÆRSTÅENDE,
  fagsakYtelsesType.OPPLÆRINGSPENGER,
];

const omsorgspengerGruppe = [
  fagsakYtelsesType.OMSORGSPENGER,
  fagsakYtelsesType.OMSORGSPENGER_AO,
  fagsakYtelsesType.OMSORGSPENGER_MA,
  fagsakYtelsesType.OMSORGSPENGER_KS,
];

const ytelsesGrupper: Partial<Record<FagsakYtelsesType, FagsakYtelsesType[]>> = {
  [fagsakYtelsesType.PLEIEPENGER_SYKT_BARN]: pleiepengerGruppe,
  [fagsakYtelsesType.PLEIEPENGER_NÆRSTÅENDE]: pleiepengerGruppe,
  [fagsakYtelsesType.OPPLÆRINGSPENGER]: pleiepengerGruppe,
  [fagsakYtelsesType.OMSORGSPENGER]: omsorgspengerGruppe,
  [fagsakYtelsesType.OMSORGSPENGER_AO]: omsorgspengerGruppe,
  [fagsakYtelsesType.OMSORGSPENGER_MA]: omsorgspengerGruppe,
  [fagsakYtelsesType.OMSORGSPENGER_KS]: omsorgspengerGruppe,
};
