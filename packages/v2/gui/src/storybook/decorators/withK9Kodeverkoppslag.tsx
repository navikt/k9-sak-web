import type { Decorator } from '@storybook/react';
import { fakeK9Kodeverkoppslag } from '../../kodeverk/mocks/fakeK9Kodeverkoppslag.js';
import { K9KodeverkoppslagContext } from '../../kodeverk/oppslag/K9KodeverkoppslagContext.jsx';
import type { K9Kodeverkoppslag } from '../../kodeverk/oppslag/useK9Kodeverkoppslag.jsx';

const withK9Kodeverkoppslag = (): Decorator => Story => {
  const k9Kodeverkoppslag: K9Kodeverkoppslag = fakeK9Kodeverkoppslag();
  return (
    <K9KodeverkoppslagContext value={k9Kodeverkoppslag}>
      <Story />
    </K9KodeverkoppslagContext>
  );
};
export default withK9Kodeverkoppslag;
