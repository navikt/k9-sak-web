import * as React from 'react';
import OmsorgenForFaktaIndex from '@fpsak-frontend/fakta-omsorgen-for/src/OmsorgenForFaktaIndex';
import { faktaPanelCodes } from '@fpsak-frontend/fp-felles';
import withReduxProvider from '../../../decorators/withRedux';

const behandling = {
  id: 1,
  versjon: 1,
};

const toggle = (openInfoPanels, togglePanel) => value => {
  const exists = openInfoPanels.some(op => op === value);
  return togglePanel(exists ? [] : [value]);
};

export default {
  title: 'fakta/pleiepenger/fakta-omsorgen-for',
  component: OmsorgenForFaktaIndex,
  decorators: [withReduxProvider],
};

export const visFaktaOmAlderOgOmsorg = () => {
  const [openInfoPanels, togglePanel] = React.useState([faktaPanelCodes.OMSORGEN_FOR]);
  return (
    <OmsorgenForFaktaIndex
      behandling={behandling}
      aksjonspunkter={[]}
      openInfoPanels={openInfoPanels}
      readOnly
      shouldOpenDefaultInfoPanels
      toggleInfoPanelCallback={toggle(openInfoPanels, togglePanel)}
    />
  );
};
