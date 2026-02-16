import AnkeBehandlingProsessStegPanelDef from './prosessStegPaneler/AnkeBehandlingProsessStegPanelDef';
import AnkeMerknaderProsessStegPanelDef from './prosessStegPaneler/AnkeMerknaderProsessStegPanelDef';
import AnkeResultatProsessStegPanelDef from './prosessStegPaneler/AnkeResultatProsessStegPanelDef';

const prosessStegPanelDefinisjoner = [
  new AnkeBehandlingProsessStegPanelDef(),
  new AnkeResultatProsessStegPanelDef(),
  new AnkeMerknaderProsessStegPanelDef(),
];

export default prosessStegPanelDefinisjoner;
