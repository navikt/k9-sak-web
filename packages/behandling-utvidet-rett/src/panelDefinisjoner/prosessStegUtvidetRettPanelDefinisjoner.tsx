import { Vilkar } from '@k9-sak-web/types';
import InngangsvilkarProsessStegPanelDef from './prosessStegPaneler/InngangsvilkarProsessStegPanelDef';
import VedtakProsessStegPanelDef from './prosessStegPaneler/VedtakProsessStegPanelDef';
import UtvidetRettProsessStegPanelDef from './prosessStegPaneler/UtvidetRettProsessStegPanelDef';
import AlderProsessStegPanelDef from './prosessStegPaneler/AlderProsessStegPanelDef';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import { FeatureToggles } from '@k9-sak-web/types';

const prosessStegUtvidetRettPanelDefinisjoner = (
  erFagytelseTypeAleneOmOmsorgen: boolean,
  erFagytelseTypeKroniskSyk: boolean,
  vilkar: Vilkar[],
  featureToggles: FeatureToggles,
) => {
  const visAlderProsessSteg = erFagytelseTypeAleneOmOmsorgen || erFagytelseTypeKroniskSyk;
  const harAldersvilkår = vilkar.some(v => v.vilkarType.kode === vilkarType.ALDERSVILKAR_BARN);

  if (!(visAlderProsessSteg && harAldersvilkår))
    return [
      new InngangsvilkarProsessStegPanelDef(),
      new UtvidetRettProsessStegPanelDef(erFagytelseTypeAleneOmOmsorgen),
      new VedtakProsessStegPanelDef(),
    ];

  return featureToggles?.FLYTT_ALDERSVILKAR
    ? [
        new InngangsvilkarProsessStegPanelDef(),
        new UtvidetRettProsessStegPanelDef(erFagytelseTypeAleneOmOmsorgen),
        new AlderProsessStegPanelDef(),
        new VedtakProsessStegPanelDef(),
      ]
    : [
        new AlderProsessStegPanelDef(),
        new InngangsvilkarProsessStegPanelDef(),
        new UtvidetRettProsessStegPanelDef(erFagytelseTypeAleneOmOmsorgen),
        new VedtakProsessStegPanelDef(),
      ];
};

export default prosessStegUtvidetRettPanelDefinisjoner;
