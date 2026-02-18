import type { Decorator } from '@storybook/react';
import { UngKodeverkoppslagContext } from '../../kodeverk/oppslag/UngKodeverkoppslagContext.jsx';
import type { UngKodeverkoppslag } from '../../kodeverk/oppslag/useUngKodeverkoppslag.jsx';
import { fakeUngKodeverkoppslag } from '../../kodeverk/mocks/fakeUngKodeverkoppslag.js';

const withUngKodeverkoppslag = (): Decorator => Story => {
  const ungKodeverkoppslag: UngKodeverkoppslag = fakeUngKodeverkoppslag();
  return (
    <UngKodeverkoppslagContext value={ungKodeverkoppslag}>
      <Story />
    </UngKodeverkoppslagContext>
  );
};
export default withUngKodeverkoppslag;
