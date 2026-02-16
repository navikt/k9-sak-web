import FormKravFamOgPensjonProsessStegPanelDef from './prosessStegPaneler/FormKravFamOgPensjonProsessStegPanelDef';
import FormKravKlageInstansProsessStegPanelDef from './prosessStegPaneler/FormKravKlageInstansProsessStegPanelDef';
import KlageresultatProsessStegPanelDef from './prosessStegPaneler/KlageresultatProsessStegPanelDef';
import VurderingFamOgPensjonProsessStegPanelDef from './prosessStegPaneler/VurderingFamOgPensjonProsessStegPanelDef';
import VurderingKlageInstansProsessStegPanelDef from './prosessStegPaneler/VurderingKlageInstansProsessStegPanelDef';

const prosessStegPanelDefinisjoner = [
  new FormKravFamOgPensjonProsessStegPanelDef(),
  new VurderingFamOgPensjonProsessStegPanelDef(),
  new FormKravKlageInstansProsessStegPanelDef(),
  new VurderingKlageInstansProsessStegPanelDef(),
  new KlageresultatProsessStegPanelDef(),
];

export default prosessStegPanelDefinisjoner;
