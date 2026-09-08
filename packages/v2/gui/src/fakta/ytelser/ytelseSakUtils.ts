import type {
  RelatertYtelseData,
  RelatertYtelseResponse,
} from '@k9-sak-web/backend/k9sak/kontrakt/arbeidsforhold/RelatertYtelseResponse.js';
import type { FagsakYtelseType } from '@k9-sak-web/backend/k9sak/kontrakt/fagsak/FagsakYtelseType.js';

export type YtelsePeriode = RelatertYtelseData & {
  rowId: string;
  ytelseType: FagsakYtelseType;
};

export type YtelseSak = {
  id: string;
  ytelseType: FagsakYtelseType;
  saksnummer?: string;
  perioder: YtelsePeriode[];
  erGjeldendeSak: boolean;
};

const sortByFom = <T extends { fom: string }>(a: T, b: T) => a.fom.localeCompare(b.fom);

export const lagYtelsePerioder = (ytelser: RelatertYtelseResponse[]): YtelsePeriode[] =>
  ytelser.flatMap((ytelse, ytelseIndex) =>
    ytelse.data.map((periode, periodeIndex) => ({
      ...periode,
      rowId: `${ytelse.ytelseType}-${periode.relatertSaksnummer ?? 'uten-saksnummer'}-${periode.fom}-${periode.tom}-${ytelseIndex}-${periodeIndex}`,
      ytelseType: ytelse.ytelseType,
    })),
  );

export const grupperYtelserPåSak = (perioder: YtelsePeriode[], gjeldendeSaksnummer: string): YtelseSak[] => {
  const saker = new Map<string, YtelseSak>();

  perioder.forEach(periode => {
    // Uten saksnummer kan vi ikke vite om to perioder tilhører samme sak.
    const sakId = periode.relatertSaksnummer ?? periode.rowId;
    const id = `${periode.ytelseType}-${sakId}`;
    const eksisterendeSak = saker.get(id);

    if (eksisterendeSak) {
      eksisterendeSak.perioder.push(periode);
      return;
    }

    saker.set(id, {
      id,
      ytelseType: periode.ytelseType,
      saksnummer: periode.relatertSaksnummer,
      perioder: [periode],
      erGjeldendeSak: periode.relatertSaksnummer === gjeldendeSaksnummer,
    });
  });

  return [...saker.values()].map(sak => ({ ...sak, perioder: sak.perioder.toSorted(sortByFom) }));
};

export const sorterYtelseSaker = (
  saker: YtelseSak[],
  formatYtelseType: (ytelseType: FagsakYtelseType) => string,
): YtelseSak[] =>
  saker.toSorted((a, b) => {
    if (a.erGjeldendeSak !== b.erGjeldendeSak) {
      return a.erGjeldendeSak ? -1 : 1;
    }
    if (a.ytelseType === 'PSB' && b.ytelseType !== 'PSB') return -1;
    if (b.ytelseType === 'PSB' && a.ytelseType !== 'PSB') return 1;

    const typeCompare = formatYtelseType(a.ytelseType).localeCompare(formatYtelseType(b.ytelseType));
    if (typeCompare !== 0) return typeCompare;

    return (a.saksnummer ?? a.id).localeCompare(b.saksnummer ?? b.id);
  });

export const sorterYtelsePerioder = (perioder: YtelsePeriode[], gjeldendeSaksnummer: string): YtelsePeriode[] =>
  perioder.toSorted((a, b) => {
    const aErGjeldende = a.relatertSaksnummer === gjeldendeSaksnummer;
    const bErGjeldende = b.relatertSaksnummer === gjeldendeSaksnummer;
    if (aErGjeldende !== bErGjeldende) return aErGjeldende ? -1 : 1;
    return sortByFom(a, b);
  });
