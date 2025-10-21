/**
 * Utility-funksjoner for visningsnavn i forskjellige former
 */

import type { FagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.ts';
import { fagsakYtelsesType as fagsakYtelse } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.ts';

export const ytelseVisningsnavn = (ytelsetype?: FagsakYtelsesType) => {
  switch (ytelsetype) {
    case fagsakYtelse.PLEIEPENGER_SYKT_BARN:
      return {
        ytelseNavn: 'pleiepenger',
        ytelseNavnBestemt: 'pleiepengene',
        ytelseNavnUbestemt: 'pleiepenger',
        ytelsePeriode: 'pleiepengeperiode',
      };
    case fagsakYtelse.PLEIEPENGER_NÆRSTÅENDE:
      return {
        ytelseNavn: 'pleiepenger',
        ytelseNavnBestemt: 'pleiepengene',
        ytelseNavnUbestemt: 'pleiepenger',
        ytelsePeriode: 'pleiepengeperiode',
      };
    case fagsakYtelse.OMSORGSPENGER_AO:
    case fagsakYtelse.OMSORGSPENGER_KS:
    case fagsakYtelse.OMSORGSPENGER_MA:
    case fagsakYtelse.OMSORGSPENGER:
      return {
        ytelseNavn: 'omsorgspenger',
        ytelseNavnBestemt: 'omsorgspengene',
        ytelseNavnUbestemt: 'omsorgspenger',
        ytelsePeriode: 'omsorgspengeperiode',
      };
    case fagsakYtelse.OPPLÆRINGSPENGER:
      return {
        ytelseNavn: 'opplæringspenger',
        ytelseNavnBestemt: 'opplæringspengene',
        ytelseNavnUbestemt: 'opplæringspenger',
        ytelsePeriode: 'opplæringspengeperiode',
      };
    case fagsakYtelse.FRISINN:
      return {
        ytelseNavn: 'frisinn',
        ytelseNavnBestemt: 'frisinn-ytelsen',
        ytelseNavnUbestemt: 'frisinn-ytelse',
        ytelsePeriode: 'frisinn-ytelseperiode',
      };
    case fagsakYtelse.UNGDOMSYTELSE:
      return {
        ytelseNavn: 'ungdomsytelse',
        ytelseNavnBestemt: 'ungdomsytelsen',
        ytelseNavnUbestemt: 'ungdomsytelse',
        ytelsePeriode: 'ungdomsytelseperiode',
      };
    default:
      return {
        ytelseNavn: 'pleiepenger',
        ytelseNavnBestemt: 'pleiepengene',
        ytelseNavnUbestemt: 'pleiepenger',
        ytelsePeriode: 'pleiepengeperiode',
      };
  }
};
