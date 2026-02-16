import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import type { FeatureToggles } from '@k9-sak-web/gui/featuretoggles/FeatureToggles.js';
import type { Vilkar } from '@k9-sak-web/types';
import AlderProsessStegPanelDef from './prosessStegPaneler/AlderProsessStegPanelDef';
import InngangsvilkarProsessStegPanelDef from './prosessStegPaneler/InngangsvilkarProsessStegPanelDef';
import UtvidetRettProsessStegPanelDef from './prosessStegPaneler/UtvidetRettProsessStegPanelDef';
import VedtakProsessStegPanelDef from './prosessStegPaneler/VedtakProsessStegPanelDef';

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
