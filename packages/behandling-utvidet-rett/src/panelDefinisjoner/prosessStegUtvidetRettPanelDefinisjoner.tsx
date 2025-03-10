import { Vilkar } from '@k9-sak-web/types';
import InngangsvilkarProsessStegPanelDef from './prosessStegPaneler/InngangsvilkarProsessStegPanelDef';
import VedtakProsessStegPanelDef from './prosessStegPaneler/VedtakProsessStegPanelDef';
import UtvidetRettProsessStegPanelDef from './prosessStegPaneler/UtvidetRettProsessStegPanelDef';
import AlderProsessStegPanelDef from './prosessStegPaneler/AlderProsessStegPanelDef';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';

const prosessStegUtvidetRettPanelDefinisjoner = (
  erFagytelseTypeAleneOmOmsorgen: boolean,
  erFagytelseTypeKroniskSyk: boolean,
  vilkar: Vilkar[],
) => {
  const visAlderProsessSteg = erFagytelseTypeAleneOmOmsorgen || erFagytelseTypeKroniskSyk;
  const harAldersvilkår = vilkar.some(v => v.vilkarType.kode === vilkarType.ALDERSVILKAR_BARN);

  return visAlderProsessSteg && harAldersvilkår
    ? [
        new AlderProsessStegPanelDef(),
        new InngangsvilkarProsessStegPanelDef(),
        new UtvidetRettProsessStegPanelDef(erFagytelseTypeAleneOmOmsorgen),
        new VedtakProsessStegPanelDef(),
      ]
    : [
        new InngangsvilkarProsessStegPanelDef(),
        new UtvidetRettProsessStegPanelDef(erFagytelseTypeAleneOmOmsorgen),
        new VedtakProsessStegPanelDef(),
      ];
};

export default prosessStegUtvidetRettPanelDefinisjoner;
