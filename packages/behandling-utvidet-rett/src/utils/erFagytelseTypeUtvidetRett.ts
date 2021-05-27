import FagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';

const erFagytelseTypeUtvidetRett = (fagytelseType: string) => {
  switch (fagytelseType) {
    case FagsakYtelseType.OMSORGSPENGER_ALENE_OM_OMSORGEN:
      return true;
    case FagsakYtelseType.OMSORGSPENGER_MIDLERTIDIG_ALENE:
      return true;
    case FagsakYtelseType.OMSORGSPENGER_KRONISK_SYKT_BARN:
      return true;
    default:
      return false;
  }
};

export default erFagytelseTypeUtvidetRett;
