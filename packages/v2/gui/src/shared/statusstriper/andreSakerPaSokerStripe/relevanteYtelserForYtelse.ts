import { fagsakYtelsesType, type FagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';

export const finnRelevanteYtelserForYtelse = (fagsakYtelseType: FagsakYtelsesType) => {
  const ytelser: FagsakYtelsesType[] = [fagsakYtelseType];

  const relevanteYtelserForType = andreRelevanteYtelserMap.get(fagsakYtelseType);
  if (relevanteYtelserForType) {
    relevanteYtelserForType.forEach(ytelse => {
      ytelser.push(ytelse);
    });
  }

  return ytelser;
};

const andreRelevanteYtelserMap = new Map<FagsakYtelsesType, FagsakYtelsesType[]>([
  [
    fagsakYtelsesType.PLEIEPENGER_SYKT_BARN,
    [fagsakYtelsesType.PLEIEPENGER_NÆRSTÅENDE, fagsakYtelsesType.OPPLÆRINGSPENGER],
  ],
  [
    fagsakYtelsesType.PLEIEPENGER_NÆRSTÅENDE,
    [fagsakYtelsesType.PLEIEPENGER_SYKT_BARN, fagsakYtelsesType.OPPLÆRINGSPENGER],
  ],
  [
    fagsakYtelsesType.OMSORGSPENGER,
    [fagsakYtelsesType.OMSORGSPENGER_AO, fagsakYtelsesType.OMSORGSPENGER_MA, fagsakYtelsesType.OMSORGSPENGER_KS],
  ],
  [
    fagsakYtelsesType.OMSORGSPENGER_AO,
    [fagsakYtelsesType.OMSORGSPENGER, fagsakYtelsesType.OMSORGSPENGER_MA, fagsakYtelsesType.OMSORGSPENGER_KS],
  ],
  [
    fagsakYtelsesType.OMSORGSPENGER_MA,
    [fagsakYtelsesType.OMSORGSPENGER, fagsakYtelsesType.OMSORGSPENGER_AO, fagsakYtelsesType.OMSORGSPENGER_MA],
  ],
  [
    fagsakYtelsesType.OMSORGSPENGER_KS,
    [fagsakYtelsesType.OMSORGSPENGER, fagsakYtelsesType.OMSORGSPENGER_AO, fagsakYtelsesType.OMSORGSPENGER_MA],
  ],
  [
    fagsakYtelsesType.OPPLÆRINGSPENGER,
    [fagsakYtelsesType.PLEIEPENGER_SYKT_BARN, fagsakYtelsesType.PLEIEPENGER_NÆRSTÅENDE],
  ],
]);
