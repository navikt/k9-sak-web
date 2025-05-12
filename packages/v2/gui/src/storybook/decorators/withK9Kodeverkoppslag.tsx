import type { Decorator } from '@storybook/react';
import { K9KodeverkoppslagContext } from '../../kodeverk/oppslag/K9KodeverkoppslagContext.jsx';
import type { K9Kodeverkoppslag } from '../../kodeverk/oppslag/useK9Kodeverkoppslag.jsx';
import { K9SakKodeverkoppslag } from '../../kodeverk/oppslag/K9SakKodeverkoppslag.js';
import { oppslagKodeverkSomObjektK9Sak } from '../../kodeverk/mocks/oppslagKodeverkSomObjektK9Sak.js';

const withK9Kodeverkoppslag = (): Decorator => Story => {
  const k9Kodeverkoppslag: K9Kodeverkoppslag = {
    isPending: false,
    k9sak: new K9SakKodeverkoppslag(oppslagKodeverkSomObjektK9Sak),
  };
  return (
    <K9KodeverkoppslagContext value={k9Kodeverkoppslag}>
      <Story />
    </K9KodeverkoppslagContext>
  );
};
export default withK9Kodeverkoppslag;
